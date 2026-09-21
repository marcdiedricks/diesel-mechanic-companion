import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  CircleGauge,
  ClipboardCheck,
  Droplets,
  ExternalLink,
  Fuel,
  Gauge,
  HardHat,
  Info,
  Languages,
  LockKeyhole,
  Menu,
  Ruler,
  ShieldAlert,
  Siren,
  Wind,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { TradeCalculators } from '@/components/TradeCalculators';
import {
  getHpcrFuelInjectionTestWarning,
  PNEUMATIC_AIR_BRAKE_GOVERNOR_PRESSURE_LIMITS,
} from '@/engines/calculations/dieselMechanic';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type Language = 'EN' | 'AF' | 'XH' | 'ZU';

const languages: Language[] = ['EN', 'AF', 'XH', 'ZU'];

const copy: Record<Language, {
  welcome: string;
  safetyTitle: string;
  safetyLead: string;
  safetyAction: string;
  toolLabel: string;
  referenceLabel: string;
  termsLabel: string;
  videoLabel: string;
  openLabel: string;
}> = {
  EN: {
    welcome: 'Molo / Hallo! I am your Diesel Mechanic Companion™ (SAQA ID: 117237). Use this app for diesel-mechanic theory, terminology, system understanding, hazard recognition, diagnostic reasoning, curriculum revision and evidence preparation. Practical vehicle work must be completed through an approved provider or workplace process with competent adult supervision.',
    safetyTitle: 'SAFETY GATE',
    safetyLead: 'Common Rail systems can hold lethal pressure after shutdown.',
    safetyAction: 'Do not open, test or work on high-risk systems through app instructions. Use the approved workshop process and competent supervision.',
    toolLabel: 'FIELD TOOLS',
    referenceLabel: 'TEST REFERENCES',
    termsLabel: 'TRADE TERMS',
    videoLabel: 'CURRICULUM VIDEO RESOURCE',
    openLabel: 'OPEN RESOURCE',
  },
  AF: {
    welcome: 'Molo / Hallo! Ek is jou Dieselwerktuigkundige Metgesel™ (SAQA ID: 117237). Gebruik die app vir teorie, terminologie, stelselbegrip, gevaarherkenning, diagnostiese redenasie, hersiening en bewysvoorbereiding. Praktiese voertuigwerk moet deur ’n goedgekeurde opleidings- of werkplekproses met bevoegde volwasse toesig plaasvind.',
    safetyTitle: 'VEILIGHEIDSHEK',
    safetyLead: 'Common Rail-stelsels kan dodelike druk behou nadat die enjin afgeskakel is.',
    safetyAction: 'Moenie hoërisikostelsels volgens app-instruksies oopmaak, toets of herstel nie. Gebruik die goedgekeurde werkswinkelproses en bevoegde toesig.',
    toolLabel: 'WERKSWINKELGEREEDSKAP',
    referenceLabel: 'TOETSVERWYSINGS',
    termsLabel: 'HANDELSTERME',
    videoLabel: 'KURRIKULUM-VIDEOHULPBRON',
    openLabel: 'OPEN HULPBRON',
  },
  XH: {
    welcome: 'Molo! NdinguMkhapheli wakho weMechanic yeDiesel™ (SAQA ID: 117237). Sebenzisa le app kufundo lwethiyori, amagama omsebenzi, ukuqonda iinkqubo, ukuqaphela iingozi, ukucinga ngoxilongo, uphononongo lwekharityhulam kunye nokulungiselela ubungqina. Umsebenzi osebenzayo kwisithuthi kufuneka wenziwe phantsi kwenkqubo evunyiweyo kunye nolawulo lomntu omdala ofanelekileyo.',
    safetyTitle: 'ISANGO LOKHUSELEKO',
    safetyLead: 'Iinkqubo zeCommon Rail zinokugcina uxinzelelo olubulalayo emva kokucinywa.',
    safetyAction: 'Musa ukuvula, ukuvavanya okanye ukulungisa iinkqubo ezinobungozi usebenzisa imiyalelo ye-app. Landela inkqubo evunyiweyo kunye nolawulo olufanelekileyo.',
    toolLabel: 'IZIXHOBO ZOMSEBENZI',
    referenceLabel: 'IINGCACISO ZOVAVANYO',
    termsLabel: 'AMAGAMA OMSEBENZI',
    videoLabel: 'IZIFUNDO ZEVIDIYO ZEKHARITYHULAM',
    openLabel: 'VULA ISIXHOBO',
  },
  ZU: {
    welcome: 'Molo! NginguMngani wakho kaMakhenikha weDiesel™ (SAQA ID: 117237). Sebenzisa lolu hlelo ukufunda ithiyori, amagama omsebenzi, ukuqonda amasistimu, ukuqaphela izingozi, ukucabanga ngokuxilonga, ukubuyekeza ikharikhulamu nokulungiselela ubufakazi. Umsebenzi osebenzayo emotweni kufanele wenziwe ngaphansi kwenqubo egunyaziwe kanye nokuqondiswa umuntu omdala onekhono.',
    safetyTitle: 'ISANGO LOKUPHEPHA',
    safetyLead: 'Amasistimu eCommon Rail angagcina umfutho obulalayo ngemva kokucima.',
    safetyAction: 'Ungavuli, uvivinye noma ulungise amasistimu ayingozi usebenzisa imiyalelo ye-app. Landela inqubo egunyaziwe kanye nokuqondiswa okufanele.',
    toolLabel: 'AMATHULUZI ENDLWENI',
    referenceLabel: 'IZINKOMBA ZOKUHLOLA',
    termsLabel: 'AMAGAMA OMSEBENZI',
    videoLabel: 'IZINSIZA ZEVIDIYO ZEKHARIKHULAMU',
    openLabel: 'VULA INSIZA',
  },
};

const tradeTerms = {
  English: ['Common Rail Injector', 'Turbocharger Boost', 'Cylinder Liner Protrusion', 'Air Brake Slack Adjuster', 'Slack Adjuster', 'Air Dryer Cartridge', 'Governor Valve', 'Injector Return Flow', 'Jake/Retarder Brake', 'Flash Point'],
  Afrikaans: ['Gemeenskaplike Spuitbuis', 'Turbo-aanjaer Druk', 'Silindervoering Uitsteeksel', 'Lugrem Slakversteller', 'Vlampunt'],
  isiXhosa: ['Isitshisi se-Common Rail', 'Uxinzelelo lwe-Turbocharger', 'Ubude be-Cylinder Liner', 'Isilungisi sebhuleki yomoya'],
  isiZulu: ['Isitshisi se-Common Rail', 'Umfutho we-Turbocharger', 'Ukuphakama kwe-Cylinder Liner', 'Isilungisi samabhuleki omoya'],
} as const;

const SMART_SEARCH_FALLBACK = 'No direct match found in offline knowledge base. Try launching the 📐 Workshop Calculators (Hydraulics, Compression, Power, Boost) or selecting a topic chip below.';

const videoUnits = [
  ['01', 'Workplace Fundamentals — controlled visual reference', '#visual-library'],
  ['02', 'Foundational Concepts for Mechanics — controlled visual reference', '#visual-library'],
  ['03', 'Vehicle and Equipment Fundamentals — controlled visual reference', '#visual-library'],
  ['04', 'Basic Engine Systems — controlled visual reference', '#visual-library'],
  ['05', 'Vehicle, Equipment and Propulsion Systems — controlled visual reference', '#visual-library'],
  ['06', 'Electrical, Electronic, Hydraulic and Pneumatic Principles — controlled visual reference', '#visual-library'],
  ['07', 'Advanced Vehicle and Equipment Systems — controlled visual reference', '#visual-library'],
  ['08', 'Problem Solving and Engine Optimisation — controlled visual reference', '#visual-library'],
] as const;

const km01Lessons = [
  {
    id: 'KM01-L01',
    title: 'Workplace roles, rights and responsibilities',
    summary: 'Understand the Diesel Mechanic learning pathway, workplace roles, responsible behaviour, reporting lines and the difference between learning support and authorised practical work.',
    check: 'A learner should ask the responsible supervisor or facilitator when an instruction is unclear or outside their training.'
  },
  {
    id: 'KM01-L02',
    title: 'Safety culture and hazard recognition',
    summary: 'Recognise common workshop hazard categories, warning signs, stored-energy risks and the need to stop, report and escalate rather than improvise.',
    check: 'The app supports hazard recognition; it does not authorise practical testing, isolation, lifting, disassembly or repair.'
  },
  {
    id: 'KM01-L03',
    title: 'Communication, teamwork and workplace records',
    summary: 'Practise clear communication, active listening, task handovers, basic workplace documentation and respectful teamwork.',
    check: 'Important task information should be confirmed and recorded through the approved workplace or provider process.'
  },
  {
    id: 'KM01-L04',
    title: 'Quality, environment and ethical work behaviour',
    summary: 'Understand why quality checks, environmental responsibility, housekeeping, honesty, care of resources and reporting non-conformances matter in a professional workshop.',
    check: 'Learners should never alter records or hide defects to make work appear complete.'
  },
] as const;

const km02Lessons = [
  {
    id: 'KM02-L01',
    title: 'Mechanical principles and basic forces',
    summary: 'Build conceptual understanding of force, motion, torque, friction, mechanical advantage and energy as they apply to vehicle systems.',
    check: 'Use calculations and diagrams for learning only; do not use them to set up or perform hazardous workshop tasks.'
  },
  {
    id: 'KM02-L02',
    title: 'Measurement, units and workshop mathematics',
    summary: 'Revise SI units, ratios, tolerances, conversions, reading scales and recording measurements accurately.',
    check: 'A measured value is meaningful only when the correct unit, tool and approved specification are identified.'
  },
  {
    id: 'KM02-L03',
    title: 'Materials, fasteners and component behaviour',
    summary: 'Recognise broad material properties, common fastener types, wear concepts and why material choice affects reliability.',
    check: 'Component identification and material theory do not authorise removal, tightening, heating, cutting or replacement.'
  },
  {
    id: 'KM02-L04',
    title: 'Technical information, symbols and schematics',
    summary: 'Practise reading basic symbols, labels, diagrams, parts information and controlled technical documents.',
    check: 'When a drawing, symbol or specification is unclear, use the approved source and ask a competent person rather than guessing.'
  },
  {
    id: 'KM02-L05',
    title: 'Fault reasoning and evidence-based thinking',
    summary: 'Learn the difference between symptom, possible cause, evidence and conclusion. Use structured reasoning instead of replacing parts by guesswork.',
    check: 'The app can help organise reasoning, but real testing and repair remain supervised practical work.'
  },
] as const;

const km03Lessons = [
  {
    id: 'KM03-L01',
    title: 'Vehicle and equipment system overview',
    summary: 'Identify the main vehicle and equipment systems at a high level and understand how engine, driveline, braking, steering, suspension, electrical and fluid-power systems interact.',
    check: 'System recognition helps with learning and fault reasoning, but does not authorise inspection or repair of a real vehicle.'
  },
  {
    id: 'KM03-L02',
    title: 'Engine, driveline and chassis relationships',
    summary: 'Understand how power is produced, transferred and supported through the engine, clutch or torque-transfer elements, transmission, final drive and chassis structure.',
    check: 'Use diagrams and component names for learning only; removal, adjustment and disassembly remain supervised practical work.'
  },
  {
    id: 'KM03-L03',
    title: 'Braking, steering and suspension fundamentals',
    summary: 'Recognise the purpose of braking, steering and suspension systems and the types of hazards associated with stored energy, vehicle movement and heavy components.',
    check: 'Do not use the app to release, support, dismantle, adjust or test braking, steering or suspension systems.'
  },
  {
    id: 'KM03-L04',
    title: 'Basic electrical and electronic system awareness',
    summary: 'Learn the purpose of batteries, starting and charging systems, basic circuits, sensors, actuators and electronic control units at a conceptual level.',
    check: 'Live electrical testing, isolation and component replacement require approved procedures and competent supervision.'
  },
  {
    id: 'KM03-L05',
    title: 'Hydraulic and pneumatic system awareness',
    summary: 'Recognise basic pressure, flow, actuators, valves and stored-energy concepts used in hydraulic and pneumatic vehicle systems.',
    check: 'Pressurised fluid and air systems are high risk. The app supports theory only and does not teach release, disconnection or testing procedures.'
  },
] as const;

const km04Lessons = [
  {
    id: 'KM04-L01',
    title: 'Four-stroke diesel engine cycle and component roles',
    summary: 'Understand the intake, compression, power and exhaust events at a conceptual level and identify the broad purpose of major engine components.',
    check: 'This lesson explains engine operation only; it does not provide dismantling, timing, adjustment or repair procedures.'
  },
  {
    id: 'KM04-L02',
    title: 'Air intake, turbocharging and exhaust fundamentals',
    summary: 'Recognise the purpose of air filters, intake paths, turbochargers, charge-air cooling and exhaust flow in supporting combustion and engine performance.',
    check: 'Boost, turbocharger and exhaust-system practical testing remains supervised work using approved OEM or provider procedures.'
  },
  {
    id: 'KM04-L03',
    title: 'Fuel supply and combustion fundamentals',
    summary: 'Learn the broad function of fuel storage, filtration, low-pressure supply, injection, atomisation and combustion without operational high-pressure fuel instructions.',
    check: 'High-pressure diesel fuel systems are hazardous. The app must not be used to open, test, depressurise or repair them.'
  },
  {
    id: 'KM04-L04',
    title: 'Lubrication and cooling system fundamentals',
    summary: 'Understand why lubrication and cooling protect engine components, manage heat and support reliable operation.',
    check: 'Opening hot, pressurised or contaminated systems requires approved workplace procedures and competent supervision.'
  },
  {
    id: 'KM04-L05',
    title: 'Engine condition, symptoms and quality evidence',
    summary: 'Distinguish symptoms from causes and organise safe evidence such as service history, warning indicators, approved measurements and observations for human diagnostic review.',
    check: 'A symptom alone does not justify a repair decision; real diagnosis requires controlled testing and competent review.'
  },
] as const;

const km05Lessons = [
  {
    id: 'KM05-L01',
    title: 'Power transmission and driveline concepts',
    summary: 'Understand how engine output is transferred through clutch or torque-transfer elements, transmission, propeller shafts, differentials and final drive systems at a conceptual level.',
    check: 'This lesson supports system understanding only; removal, alignment, adjustment and repair remain supervised practical work.'
  },
  {
    id: 'KM05-L02',
    title: 'Steering and suspension system principles',
    summary: 'Recognise the purpose of steering geometry, suspension support, damping and load control in vehicle stability, comfort and tyre contact.',
    check: 'Do not use the app to lift, support, dismantle, adjust or align a vehicle or suspension component.'
  },
  {
    id: 'KM05-L03',
    title: 'Brake system architecture and stored-energy awareness',
    summary: 'Understand the high-level purpose of service braking, parking braking and common hydraulic or pneumatic brake-system components without operational release or adjustment guidance.',
    check: 'Brake systems may contain stored energy and safety-critical components. Practical testing, release, adjustment and repair require approved procedures and competent supervision.'
  },
  {
    id: 'KM05-L04',
    title: 'Vehicle body, chassis and equipment interfaces',
    summary: 'Learn how chassis, mounting points, cab structures, body equipment and auxiliary systems interact with the vehicle as a whole.',
    check: 'Raised cabs, heavy components and mounted equipment introduce crush and movement hazards; the app does not teach support or removal procedures.'
  },
  {
    id: 'KM05-L05',
    title: 'Propulsion-system symptoms and evidence',
    summary: 'Practise linking driver reports, warning indicators, service history and approved measurements to possible system areas without jumping directly to a repair conclusion.',
    check: 'Evidence supports diagnosis; it does not replace controlled testing or authorise component replacement.'
  },
] as const;

const km06Lessons = [
  {
    id: 'KM06-L01',
    title: 'Basic electrical principles',
    summary: 'Understand voltage, current, resistance, power, conductors, insulators and simple circuit relationships at a conceptual level.',
    check: 'This lesson supports theory only; live testing, isolation, probing and repair remain supervised practical work.'
  },
  {
    id: 'KM06-L02',
    title: 'Starting, charging and battery system awareness',
    summary: 'Recognise the purpose of batteries, starters, alternators, charging circuits and broad warning indicators without providing test or replacement procedures.',
    check: 'Vehicle electrical systems can deliver high current. The app does not teach jump-starting, battery removal, live testing or charging procedures.'
  },
  {
    id: 'KM06-L03',
    title: 'Sensors, actuators and electronic control concepts',
    summary: 'Learn how sensors provide information, actuators respond to commands and electronic control units coordinate vehicle functions at a high level.',
    check: 'Electronic diagnosis requires controlled testing, approved information and competent supervision; the app supports conceptual reasoning only.'
  },
  {
    id: 'KM06-L04',
    title: 'Wiring diagrams, symbols and circuit interpretation',
    summary: 'Practise reading basic wiring symbols, connectors, circuit paths and diagram conventions using approved technical information.',
    check: 'Do not bridge, bypass or probe a real circuit from app instructions. Unclear schematics must be checked against the approved source.'
  },
  {
    id: 'KM06-L05',
    title: 'Hydraulic principles and stored-energy awareness',
    summary: 'Understand pressure, flow, force, pumps, valves, actuators and broad hydraulic-system relationships without operational instructions.',
    check: 'Hydraulic systems may contain dangerous stored energy. The app does not teach pressure release, hose disconnection, lifting or component testing.'
  },
  {
    id: 'KM06-L06',
    title: 'Pneumatic principles and stored-energy awareness',
    summary: 'Understand compressed-air generation, storage, control valves, actuators and broad pneumatic-system relationships in vehicle applications.',
    check: 'Compressed-air systems can release stored energy suddenly. The app does not teach draining, caging, releasing, disconnecting or testing procedures.'
  },
] as const;

const km07Lessons = [
  {
    id: 'KM07-L01',
    title: 'Advanced engine-management concepts',
    summary: 'Understand at a high level how electronic control, sensor inputs, actuator outputs and control strategies influence engine performance, emissions and drivability.',
    check: 'This lesson supports conceptual understanding only; live diagnostics, programming, adaptation and repair remain supervised practical work.'
  },
  {
    id: 'KM07-L02',
    title: 'Advanced fuel, air and emissions systems',
    summary: 'Recognise the purpose and interaction of modern fuel-delivery, boost-control, exhaust after-treatment and emissions-monitoring systems without operational service instructions.',
    check: 'High-pressure fuel, hot exhaust and emissions systems can be hazardous. The app does not provide opening, regeneration, bypassing or repair procedures.'
  },
  {
    id: 'KM07-L03',
    title: 'Advanced braking and stability system concepts',
    summary: 'Understand the high-level role of electronically controlled braking, stability assistance and related sensors and control units in heavy vehicles and equipment.',
    check: 'Safety-critical braking and stability systems must be diagnosed and repaired through approved procedures with competent supervision.'
  },
  {
    id: 'KM07-L04',
    title: 'Advanced driveline and transmission concepts',
    summary: 'Build conceptual understanding of electronically managed transmissions, driveline control, torque transfer and system interactions that affect performance and fault symptoms.',
    check: 'The app does not teach transmission removal, adjustment, programming or internal repair procedures.'
  },
  {
    id: 'KM07-L05',
    title: 'Networked vehicle electronics and communication',
    summary: 'Learn how control modules exchange information across vehicle networks and why communication faults can affect multiple systems at once.',
    check: 'Network diagnosis requires controlled test methods and approved technical information; do not probe, bridge or modify live circuits from app guidance.'
  },
  {
    id: 'KM07-L06',
    title: 'Advanced hydraulic and pneumatic control concepts',
    summary: 'Understand electronically controlled valves, feedback, pressure and flow relationships and system-level interactions in advanced fluid-power applications.',
    check: 'Pressurised systems may contain dangerous stored energy. Practical testing, release and component work must remain supervised.'
  },
  {
    id: 'KM07-L07',
    title: 'Integrated fault patterns and system interactions',
    summary: 'Practise distinguishing primary faults, secondary symptoms and cross-system effects by organising evidence before forming a diagnosis.',
    check: 'A fault code or symptom is not a repair instruction; conclusions must be verified using approved evidence and competent review.'
  },
] as const;

const km08Lessons = [
  {
    id: 'KM08-L01',
    title: 'Structured problem solving and fault isolation',
    summary: 'Use a disciplined process to separate reported symptoms, observed evidence, possible causes and verified conclusions without jumping to a repair decision.',
    check: 'A hypothesis is not a diagnosis. Real testing and corrective work require approved procedures and competent supervision.'
  },
  {
    id: 'KM08-L02',
    title: 'Interpreting diagnostic information',
    summary: 'Learn how warning indicators, fault records, service history, approved measurements and technical information can be combined into an evidence trail.',
    check: 'Diagnostic information must be interpreted in context; fault codes and readings do not automatically identify a component to replace.'
  },
  {
    id: 'KM08-L03',
    title: 'Engine performance and efficiency concepts',
    summary: 'Understand the broad relationships between combustion, airflow, fuel delivery, temperature, load, friction and engine efficiency at a theory level.',
    check: 'This lesson supports conceptual learning only and does not provide tuning, adjustment, calibration or performance-modification instructions.'
  },
  {
    id: 'KM08-L04',
    title: 'Emissions, reliability and operating condition',
    summary: 'Recognise how poor combustion, excessive wear, restricted flow, incorrect operating conditions and maintenance history can affect emissions and reliability.',
    check: 'Emissions-system service, regeneration, bypassing or modification must not be performed from app guidance.'
  },
  {
    id: 'KM08-L05',
    title: 'Quality decisions, escalation and evidence',
    summary: 'Practise deciding when evidence is sufficient, when more approved information is needed and when a fault must be escalated to a competent supervisor or specialist.',
    check: 'Safe professional practice includes knowing when to stop. The app never substitutes for authorised practical diagnosis or sign-off.'
  },
] as const;

const pm01Activities = [
  {
    id: 'PM01-A01',
    title: 'Recognise workshop hazards and safe-stop conditions',
    summary: 'Use scenarios, images and written descriptions to identify broad hazard categories, warning signs and situations that must be stopped and escalated.',
    evidence: 'Learner notes describing the hazard, the reason work should stop, and who should be informed.'
  },
  {
    id: 'PM01-A02',
    title: 'Read and interpret emergency information',
    summary: 'Practise locating emergency contacts, signage, evacuation information, incident-reporting routes and approved workplace safety notices.',
    evidence: 'Completed classroom worksheet or facilitator-reviewed response using the provider or workplace emergency information.'
  },
  {
    id: 'PM01-A03',
    title: 'Plan a safe response without performing the hazardous action',
    summary: 'Work through classroom case studies covering fire, spills, injury, stored energy and unsafe equipment conditions, focusing on recognition, isolation-from-distance, communication and escalation.',
    evidence: 'Scenario response showing correct stop, warn, report and handover decisions.'
  },
  {
    id: 'PM01-A04',
    title: 'Complete safety and incident documentation',
    summary: 'Practise recording observations, near misses, incidents and corrective-action handovers using clear, factual and non-blaming language.',
    evidence: 'Sample incident or near-miss record reviewed by a facilitator or supervisor.'
  },
] as const;

const pm02Activities = [
  {
    id: 'PM02-A01',
    title: 'Identify tool categories and intended purpose',
    summary: 'Recognise broad categories of hand tools, measuring equipment and workshop support equipment from images, labels and approved training material.',
    evidence: 'Learner identification sheet matching tool categories to intended non-operational purpose.'
  },
  {
    id: 'PM02-A02',
    title: 'Read condition and safety information',
    summary: 'Practise recognising damaged, incorrect, unsuitable or unserviceable tools and equipment from classroom examples and inspection photographs.',
    evidence: 'Completed condition-check worksheet showing which items should be removed from use and escalated.'
  },
  {
    id: 'PM02-A03',
    title: 'Match tools to task requirements conceptually',
    summary: 'Use scenario cards to choose the correct type of tool or measuring instrument without performing the physical task.',
    evidence: 'Facilitator-reviewed task-to-tool matching activity with a short reason for each choice.'
  },
  {
    id: 'PM02-A04',
    title: 'Interpret measurement displays and units',
    summary: 'Read example scales, digital displays, units and simple tolerances from classroom images and sample readings.',
    evidence: 'Measurement-reading worksheet completed without operating real workshop equipment.'
  },
  {
    id: 'PM02-A05',
    title: 'Plan safe storage, care and reporting',
    summary: 'Understand why tools must be cleaned, stored, accounted for and reported when damaged or missing.',
    evidence: 'Short checklist or handover record demonstrating correct care, storage and reporting decisions.'
  },
] as const;

const pm03Activities = [
  {
    id: 'PM03-A01',
    title: 'Recognise metal-cutting and joining process categories',
    summary: 'Identify broad process families such as mechanical cutting, thermal cutting, welding, brazing and fastening from classroom images, labels and approved training material.',
    evidence: 'Learner classification sheet matching process categories to their general purpose and major hazard type.'
  },
  {
    id: 'PM03-A02',
    title: 'Identify hazards and required escalation',
    summary: 'Recognise heat, sparks, fumes, sharp edges, electrical energy, gas cylinders and fire risks from scenarios without performing any cutting or joining task.',
    evidence: 'Hazard-recognition worksheet showing the hazard, why work should stop, and who must supervise the task.'
  },
  {
    id: 'PM03-A03',
    title: 'Interpret symbols, drawings and job information',
    summary: 'Practise reading simple joint symbols, material notes, dimensions and controlled job information to understand what a fabrication task is asking for.',
    evidence: 'Completed drawing-reading activity reviewed by a facilitator.'
  },
  {
    id: 'PM03-A04',
    title: 'Plan quality checks conceptually',
    summary: 'Understand why fit-up, alignment, cleanliness, dimensional checks and visual inspection matter to quality without giving operational fabrication steps.',
    evidence: 'A simple quality-check plan listing what should be verified before and after supervised practical work.'
  },
  {
    id: 'PM03-A05',
    title: 'Document completed supervised work',
    summary: 'Practise recording the material, drawing reference, supervisor, observed result and any non-conformance after an authorised practical session.',
    evidence: 'Sample evidence record with practical status left unverified until authorised review.'
  },
] as const;

const queryClient = new QueryClient();


function KM01Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km01-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km01-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km01" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km01-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-01 • Workplace Fundamentals</div>
          <h2 id="km01-heading" className="section-heading">Workplace Fundamentals</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-01, NQF Level 2, 9 credits. These four learner lessons are a safe internal learning sequence; they do not claim to reproduce the unpublished detailed curriculum wording.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/4 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-01 teaches workplace understanding, hazard recognition, communication and responsible behaviour. It does not provide vehicle-repair, lifting, braking, fuel-system, electrical, hydraulic, pneumatic or refrigerant procedures.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km01Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 4</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • Curriculum 653306-000-01-00</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM02Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km02-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km02-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km02" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km02-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-02 • Foundational Concepts for Mechanics</div>
          <h2 id="km02-heading" className="section-heading">Foundational Concepts for Mechanics</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-02, NQF Level 2, 14 credits. This internal five-lesson sequence supports theory and reasoning without turning the app into a workshop operating manual.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-02 supports mechanics theory, measurement concepts, technical-document reading and diagnostic reasoning. It does not provide repair sequences, tool-use procedures, tightening instructions, live testing, lifting or disassembly guidance.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km02Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-02 • 14 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM03Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km03-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km03-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km03" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km03-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-03 • Vehicle and Equipment Fundamentals</div>
          <h2 id="km03-heading" className="section-heading">Vehicle and Equipment Fundamentals</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-03, NQF Level 2, 8 credits. This internal five-lesson sequence builds whole-vehicle understanding before later diagnostic learning.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-03 teaches system purpose, component recognition and conceptual relationships only. It does not provide disassembly, adjustment, testing, lifting, release-of-pressure or repair procedures.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km03Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-03 • 8 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM04Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km04-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km04-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km04" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km04-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-04 • Basic Engine Systems</div>
          <h2 id="km04-heading" className="section-heading">Basic Engine Systems</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-04, NQF Level 2, 8 credits. This five-lesson sequence builds engine-system understanding without giving workshop operating instructions.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-04 teaches engine theory, system purpose, symptoms and evidence reasoning. It does not teach engine dismantling, timing, adjustment, hot-system opening, high-pressure fuel testing or repair procedures.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km04Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-04 • 8 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM05Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km05-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km05-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km05" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km05-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-05 • Vehicle, Equipment and Propulsion Systems</div>
          <h2 id="km05-heading" className="section-heading">Vehicle, Equipment and Propulsion Systems</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-05, NQF Level 3, 13 credits. This five-lesson sequence develops system-level understanding of driveline, chassis, braking, steering and propulsion relationships.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-05 teaches system architecture, component roles, stored-energy awareness and diagnostic reasoning only. It does not provide braking, driveline, suspension, lifting, alignment, cab-support or component-removal procedures.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km05Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-05 • 13 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM06Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km06-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km06-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km06" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km06-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-06 • Electrical, Electronic, Hydraulic and Pneumatic Principles</div>
          <h2 id="km06-heading" className="section-heading">Electrical Systems and Basic Electronic, Hydraulic and Pneumatic Principles</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-06, NQF Level 3, 16 credits. This six-lesson sequence builds safe theory and schematic-reading skills across electrical, electronic, hydraulic and pneumatic systems.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-06 teaches principles, symbols, system purpose and hazard recognition. It does not provide live electrical testing, bypassing, pressure release, hose disconnection, brake-air release, hydraulic lifting or repair procedures.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km06Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-06 • 16 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM07Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km07-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km07-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km07" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km07-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-07 • Advanced Vehicle and Equipment Systems</div>
          <h2 id="km07-heading" className="section-heading">Advanced Vehicle and Equipment Systems</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-07, NQF Level 4, 30 credits. This seven-lesson sequence develops advanced system understanding and integrated diagnostic reasoning while preserving strict practical-safety boundaries.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/7 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-07 teaches advanced system purpose, electronics, network concepts, fault patterns and diagnostic reasoning. It does not provide high-pressure fuel work, brake-system procedures, live-circuit testing, programming, pressure release, disassembly or repair instructions.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km07Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 7</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-07 • 30 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function KM08Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-km08-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-km08-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="km08" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="km08-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> KM-08 • Problem Solving and Engine Optimisation</div>
          <h2 id="km08-heading" className="section-heading">Problem Solving and Engine Optimisation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Controlled learning support mapped to 653306-000-01-KM-08, NQF Level 4, 10 credits. This five-lesson sequence completes the Diesel Mechanic knowledge layer with structured diagnostic reasoning, efficiency concepts and safe escalation.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 complete</div>
      </div>

      <div className="mb-5 border border-[rgba(233,184,54,.25)] bg-[rgba(233,184,54,.06)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Safety boundary:</strong> KM-08 teaches problem solving, evidence interpretation, performance concepts and escalation. It does not provide tuning, programming, calibration, emissions-system procedures, live testing or repair instructions.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {km08Lessons.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          return (
            <article key={lesson.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Lesson {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{lesson.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Learning check:</strong> {lesson.check}
              </div>
              <button
                type="button"
                onClick={() => toggle(lesson.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not complete' : 'Mark lesson complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-[hsl(var(--border))] pt-4 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
        <span>Official qualification source: SAQA 117237 • 653306-000-01-KM-08 • 10 credits</span>
        <a className="text-[hsl(var(--primary))] underline-offset-4 hover:underline" href="https://pcqs.saqa.org.za/viewQualification.php?id=117237" target="_blank" rel="noopener noreferrer">Open SAQA qualification</a>
      </div>
    </section>
  );
}


function PM01Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm01-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm01-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="pm01" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm01-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-01 • Work Safely and Respond to Emergencies</div>
          <h2 id="pm01-heading" className="section-heading">Practical Skill Support — PM-01</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-01, NQF Level 2, 6 credits. This section prepares learners for supervised provider/workplace activities; it does not simulate completion or replace practical assessment.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/4 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> Emergency response, fire control, spill response, first aid, machinery isolation and other hazardous actions must follow the approved provider/workplace procedure under competent adult supervision. The app supports recognition, communication, planning and evidence preparation only.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm01Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 4</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Suggested evidence:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not prepared' : 'Mark preparation complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Evidence status:</strong> Learner-marked preparation is not verified practical competence. Any practical evidence remains unverified until reviewed and signed through the authorised provider/workplace process.
      </div>
    </section>
  );
}


function PM02Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm02-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm02-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="pm02" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm02-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-02 • Use Tools and Equipment</div>
          <h2 id="pm02-heading" className="section-heading">Practical Skill Support — PM-02</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-02, NQF Level 2, 20 credits. This section develops recognition, selection reasoning, condition awareness and measurement interpretation without teaching physical tool operation.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not teach the operation of powered tools, cutting equipment, presses, lifting equipment, jacks, grinders, drills or other hazardous workshop equipment. Physical use must occur only through the approved provider/workplace process with competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm02Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Suggested evidence:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not prepared' : 'Mark preparation complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Evidence status:</strong> Preparation records are learning evidence only and do not certify safe or competent tool use. Practical competence must be assessed by an authorised provider or workplace assessor.
      </div>
    </section>
  );
}


function PM03Module() {
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm03-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm03-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <section id="pm03" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm03-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-03 • Cut and Join Metals</div>
          <h2 id="pm03-heading" className="section-heading">Practical Skill Support — PM-03</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-03, NQF Level 2, 5 credits. This section supports process recognition, drawing interpretation, hazard awareness, quality planning and evidence capture without teaching cutting or joining techniques.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide welding, brazing, grinding, gas-cutting, plasma-cutting, arc setup, torch setup, cylinder handling, electrical setup or metal-cutting procedures. All hot work and powered cutting must remain within approved provider/workplace controls and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm03Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Suggested evidence:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not prepared' : 'Mark preparation complete'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Evidence status:</strong> Preparation records and learner reflections are not proof of practical competence. Any cutting or joining evidence must be generated and verified through the authorised training/workplace process.
      </div>
    </section>
  );
}

function TurboInjectorMark() {
  return (
    <svg aria-hidden="true" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 28c0-10.49 8.51-19 19-19h5.25C42.5 9 50 16.5 50 25.75V28H37.5v-2.25A7.25 7.25 0 0 0 30.25 18H28c-5.52 0-10 4.48-10 10s4.48 10 10 10h3.25A7.25 7.25 0 0 0 38.5 30.75V28H50v2.25C50 40.61 42.5 48 33.25 48H28C17.51 48 9 39.49 9 29v-1Z" stroke="currentColor" strokeWidth="3.2" />
      <path d="M5 28h8M43 28h8M27 3v8M27 45v8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
      <path d="M37 6v12m0 0h8l3 5H34l3-5Zm0 12v25m0 0h7m-7 0h-7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="27.5" cy="28" r="3.5" fill="currentColor" />
    </svg>
  );
}

function Header({ language, onLanguageChange, onOpenMenu, onOpenCalculators }: { language: Language; onLanguageChange: (language: Language) => void; onOpenMenu: () => void; onOpenCalculators: () => void }) {
  return (
    <header className="border-b border-[hsl(var(--border))] bg-[rgba(8,15,23,.86)]">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center border border-[hsl(var(--primary))] bg-[rgba(233,184,54,.1)] text-[hsl(var(--primary))]" aria-label="Diesel Mechanic Companion mark">
            <TurboInjectorMark />
          </div>
          <div className="min-w-0">
            <div className="eyebrow mb-1 flex items-center gap-2"><span className="status-dot" /> workshop mode / offline-ready</div>
            <h1 className="display-font truncate text-[clamp(1.5rem,3.5vw,2.45rem)] font-bold uppercase leading-none tracking-tight text-[hsl(var(--foreground))]">Diesel Mechanic Companion™</h1>
            <p className="mono-font mt-1 truncate text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">SAQA ID: 117237 <span className="text-[hsl(var(--primary))]">|</span> NQF Level 4 <span className="text-[hsl(var(--primary))]">|</span> MERSETA / NAMB</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onOpenMenu} className="grid size-10 place-items-center border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] md:hidden" aria-label="Open quick navigation" data-testid="button-open-navigation">
            <Menu size={18} />
          </button>
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,.055)] bg-[rgba(255,255,255,.018)]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <Languages size={15} />
            <span className="hidden text-[.68rem] font-semibold uppercase tracking-[.14em] sm:inline">Language / taal / ulwimi</span>
          </div>
           <div className="flex min-w-0 items-center gap-2">
             <nav className="flex items-center gap-1" aria-label="Language selection">
               {languages.map((item) => (
                 <button type="button" key={item} onClick={() => onLanguageChange(item)} className={`language-button px-3 py-1.5 text-[.7rem] font-bold tracking-[.12em] ${language === item ? 'active' : 'text-[hsl(var(--muted-foreground))] hover:bg-[rgba(255,255,255,.06)] hover:text-[hsl(var(--foreground))]'}`} aria-pressed={language === item} data-testid={`button-language-${item.toLowerCase()}`}>
                   {item}
                 </button>
               ))}
             </nav>
             <button
               type="button"
               onClick={onOpenCalculators}
               className="flex shrink-0 items-center gap-2 border border-[hsl(var(--primary))] bg-[rgba(233,184,54,.08)] px-2.5 py-1.5 text-[.65rem] font-bold uppercase tracking-[.08em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] sm:px-3"
               aria-label="Open Workshop Calculators"
               data-testid="button-open-trade-calculators"
             >
               <span aria-hidden="true">📐</span>
               <span className="hidden sm:inline">Workshop Calculators</span>
               <span className="sm:hidden">Calculators</span>
             </button>
           </div>
        </div>
      </div>
    </header>
  );
}

function SafetyPanel({ language }: { language: Language }) {
  const current = copy[language];
  const rules = [
    { icon: Fuel, title: 'High-pressure fuel systems', detail: 'Recognise these as high-risk systems. Do not use the app as an operating or leak-testing guide; stop and route practical work to the approved workshop process.' },
    { icon: ShieldAlert, title: 'Electrical, pneumatic and hydraulic systems', detail: 'Treat practical testing, isolation and disassembly as supervised work. The app supports theory and hazard recognition only.' },
    { icon: LockKeyhole, title: 'Raised vehicles, tilted cabs and heavy components', detail: 'Recognise crush and stored-energy hazards. Do not perform lifting, supporting or removal tasks from app instructions.' },
    { icon: Droplets, title: 'Brakes, cooling and other stored-energy systems', detail: 'Use the app to understand system purpose and warning signs. Practical release, opening, testing or repair requires approved procedures and competent supervision.' },
  ];
  return (
    <section className="panel bracket-corner border-l-2 border-l-[hsl(var(--destructive))] p-4 sm:p-5" aria-labelledby="safety-heading">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2 text-[hsl(var(--destructive))]"><Siren size={14} /> {current.safetyTitle}</div>
          <h2 id="safety-heading" className="section-heading">Statutory rules before the first spanner</h2>
        </div>
        <ShieldAlert className="shrink-0 text-[hsl(var(--destructive))]" size={26} strokeWidth={1.6} />
      </div>
      <div className="mb-4 border border-[rgba(234,96,83,.28)] bg-[rgba(234,96,83,.08)] p-3">
        <p className="text-sm font-semibold leading-relaxed text-[hsl(var(--foreground))]">{current.safetyLead}</p>
        <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{current.safetyAction}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {rules.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="flex gap-3 border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-3" data-testid={`safety-rule-${title.slice(0, 4).replace(/\s/g, '-').toLowerCase()}`}>
            <Icon className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" size={18} />
            <div><h3 className="text-xs font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{title}</h3><p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{detail}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LinerCalculator() {
  const [diameter, setDiameter] = useState('1.02');
  const [flange, setFlange] = useState('0.91');
  const [shim, setShim] = useState('0.04');
  const net = Number(diameter) - Number(flange) + Number(shim);
  const isPass = net >= 0.08 && net <= 0.15;
  const guidance = net < 0.08 ? 'Add copper shim thickness; re-measure at four points.' : net > 0.15 ? 'Remove shim / inspect counterbore; protrusion is high.' : 'Within range. Record four-point readings and torque sequence.';
  const input = (label: string, value: string, setValue: (value: string) => void, id: string) => (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[.68rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{label} <span className="font-normal normal-case tracking-normal">(mm)</span></span>
      <input id={id} className="input-field" type="number" step="0.01" min="0" value={value} onChange={(event) => setValue(event.target.value)} aria-label={`${label} in millimetres`} data-testid={`input-${id}`} />
    </label>
  );
  return (
    <section id="liner-calculator" className="panel data-grid bracket-corner p-4 sm:p-5" aria-labelledby="liner-heading">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div><div className="eyebrow mb-2 flex items-center gap-2"><Calculator size={14} /> field calculator / 01</div><h2 id="liner-heading" className="section-heading">Cylinder liner protrusion</h2></div>
        <Ruler className="text-[hsl(var(--primary))]" size={25} strokeWidth={1.6} />
      </div>
      <p className="mb-4 max-w-xl text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Net protrusion = <span className="mono-font text-[hsl(var(--foreground))]">D − F + S</span>. Measure clean liner, counterbore and fitted shim on the same datum.</p>
      <div className="grid grid-cols-3 gap-2">{input('Measured deck depth', diameter, setDiameter, 'liner-deck')}{input('Flange thickness', flange, setFlange, 'liner-flange')}{input('Copper shim', shim, setShim, 'liner-shim')}</div>
      <div className="mt-4 flex flex-col gap-3 border-t border-[hsl(var(--border))] pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-1 text-[.65rem] font-bold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">Net protrusion</div><div className="metric-value text-[hsl(var(--primary))]" data-testid="value-net-protrusion">{net.toFixed(2)} <span className="text-sm tracking-normal text-[hsl(var(--muted-foreground))]">mm</span></div></div>
        <div className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide ${isPass ? 'bg-[rgba(94,178,119,.13)] text-[hsl(var(--chart-3))]' : 'bg-[rgba(234,96,83,.13)] text-[hsl(var(--destructive))]'}`} data-testid="status-liner-protrusion">
          {isPass ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {isPass ? 'PASS · 0.08–0.15 mm' : 'FAIL · outside 0.08–0.15 mm'}
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]"><Info className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" size={15} /><span>{guidance}</span></div>
    </section>
  );
}

function AirBrakePanel() {
  const { cutIn, cutOut } = PNEUMATIC_AIR_BRAKE_GOVERNOR_PRESSURE_LIMITS;
  const rows = [
    ['Cut-in', `${cutIn.minBar.toFixed(1)}–${cutIn.maxBar.toFixed(1)} bar`, `${cutIn.minKpa}–${cutIn.maxKpa} kPa`, 'Compressor loads'],
    ['Cut-out', `${cutOut.minBar.toFixed(1)}–${cutOut.maxBar.toFixed(1)} bar`, `${cutOut.minKpa}–${cutOut.maxKpa} kPa`, 'Compressor unloads'],
    ['Low air buzzer', '4.5 bar', '450 kPa', 'Stop and investigate'],
  ];
  return (
    <section id="air-brake-reference" className="panel p-4 sm:p-5" aria-labelledby="air-heading">
      <div className="mb-4 flex items-start justify-between gap-3"><div><div className="eyebrow mb-2 flex items-center gap-2"><CircleGauge size={14} /> reference matrix / 02</div><h2 id="air-heading" className="section-heading">Heavy vehicle air brake</h2></div><Wind className="text-[hsl(var(--accent))]" size={25} strokeWidth={1.6} /></div>
      <p className="mb-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Pneumatic testing baseline for a dual-circuit commercial vehicle system. Compare gauge readings with the vehicle OEM plate.</p>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[480px] border-collapse text-left text-xs">
          <thead><tr className="border-b border-[hsl(var(--border))] text-[.62rem] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]"><th className="px-2 py-2 font-semibold">Test point</th><th className="px-2 py-2 font-semibold">bar</th><th className="px-2 py-2 font-semibold">kPa</th><th className="px-2 py-2 font-semibold">Expected action</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]} className="border-b border-[rgba(255,255,255,.05)] last:border-0"><td className="px-2 py-3 font-bold text-[hsl(var(--foreground))]">{row[0]}</td><td className="mono-font px-2 py-3 text-[hsl(var(--primary))]">{row[1]}</td><td className="mono-font px-2 py-3 text-[hsl(var(--muted-foreground))]">{row[2]}</td><td className="px-2 py-3 text-[hsl(var(--muted-foreground))]">{row[3]}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-4 flex items-start gap-2 border-l-2 border-[hsl(var(--accent))] pl-3 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]"><ClipboardCheck className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" size={14} />Check governor cycling, leaks, protection valves and both circuits. Never road-test a vehicle with a low-air warning.</div>
    </section>
  );
}

function InjectorPanel() {
  const hpcrSafetyWarning = getHpcrFuelInjectionTestWarning(2000);
  const rows = [
    ['Bosch CRD', '≤ 30 ml / 30 s', '≤ 80 ml / min', 'Compare all injectors in the bank'],
    ['Denso CRD', '≤ 25 ml / 30 s', '≤ 60 ml / min', 'Check return restriction first'],
  ];
  return (
    <section id="injector-reference" className="panel p-4 sm:p-5" aria-labelledby="injector-heading">
      <div className="mb-4 flex items-start justify-between gap-3"><div><div className="eyebrow mb-2 flex items-center gap-2"><Activity size={14} /> diagnostic matrix / 03</div><h2 id="injector-heading" className="section-heading">Injector return flow</h2></div><Fuel className="text-[hsl(var(--primary))]" size={25} strokeWidth={1.6} /></div>
      <p className="mb-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Maximum allowable return volume per bank. Warm engine, matched hoses and a clean graduated cylinder give useful comparisons.</p>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[530px] border-collapse text-left text-xs">
          <thead><tr className="border-b border-[hsl(var(--border))] text-[.62rem] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]"><th className="px-2 py-2 font-semibold">System</th><th className="px-2 py-2 font-semibold">Cranking max</th><th className="px-2 py-2 font-semibold">Idle max</th><th className="px-2 py-2 font-semibold">Field note</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row[0]} className="border-b border-[rgba(255,255,255,.05)] last:border-0"><td className="px-2 py-3 font-bold text-[hsl(var(--foreground))]">{row[0]}</td><td className="mono-font px-2 py-3 text-[hsl(var(--primary))]">{row[1]}</td><td className="mono-font px-2 py-3 text-[hsl(var(--primary))]">{row[2]}</td><td className="px-2 py-3 text-[hsl(var(--muted-foreground))]">{row[3]}</td></tr>)}</tbody>
        </table>
      </div>
       <div className="mt-4 flex items-start gap-2 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]"><Gauge className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" size={14} />A single high-return injector can pull rail pressure down. Confirm test kit limits and manufacturer data before condemning a component.</div>
       {hpcrSafetyWarning && <div className="mt-3 flex items-start gap-2 border border-[rgba(234,96,83,.28)] bg-[rgba(234,96,83,.08)] p-3 text-xs font-semibold leading-relaxed text-[hsl(var(--foreground))]" role="alert" data-testid="warning-hpcr-fuel-injection-test"><ShieldAlert className="mt-0.5 shrink-0 text-[hsl(var(--destructive))]" size={15} />{hpcrSafetyWarning}</div>}
    </section>
  );
}

function TradeTerms({ language, onOpenCalculators }: { language: Language; onOpenCalculators: () => void }) {
  const [search, setSearch] = useState('');
  const groups = useMemo(() => Object.entries(tradeTerms).map(([language, terms]) => ({ language, terms: terms.filter((term) => term.toLowerCase().includes(search.toLowerCase())) })).filter((group) => group.terms.length > 0), [search]);
  return (
    <section id="trade-terms" className="panel p-4 sm:p-5" aria-labelledby="terms-heading">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> {copy[language].termsLabel}</div><h2 id="terms-heading" className="section-heading">Say it at the bench</h2></div><label className="relative block w-full sm:w-56"><span className="sr-only">Search trade terms</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} className="input-field pl-3" placeholder="Filter terms..." aria-label="Filter trade terms" data-testid="input-search-terms" /></label></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => <div key={group.language} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.1)] p-3" data-testid={`terms-group-${group.language}`}><h3 className="mono-font mb-3 text-[.68rem] font-bold uppercase tracking-[.13em] text-[hsl(var(--primary))]">{group.language}</h3><ul className="space-y-2">{group.terms.map((term, index) => <li key={term} className="flex gap-2 text-xs leading-snug text-[hsl(var(--foreground))]"><span className="mono-font shrink-0 text-[.65rem] text-[hsl(var(--muted-foreground))]">0{index + 1}</span>{term}</li>)}</ul></div>)}
      </div>
      {groups.length === 0 && <div className="border border-dashed border-[hsl(var(--primary))] bg-[rgba(233,184,54,.05)] p-5 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]" data-testid="search-smart-fallback"><p>{SMART_SEARCH_FALLBACK}</p><div className="mt-4"><QuickNav onOpenCalculators={onOpenCalculators} /></div></div>}
    </section>
  );
}

function VideoModal({ language, selected, onSelect, onClose }: { language: Language; selected: number; onSelect: (index: number) => void; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  const unit = videoUnits[selected];
  const openVideo = () => window.open(unit[2], '_blank', 'noopener,noreferrer');
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-card panel bracket-corner bg-[hsl(var(--card))] p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="video-modal-heading">
        <div className="mb-5 flex items-start justify-between gap-4"><div><div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> {copy[language].videoLabel}</div><h2 id="video-modal-heading" className="section-heading">Curriculum video resource</h2><p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Select a unit, then open its exact YouTube search in a new tab.</p></div><button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" aria-label="Close curriculum video resource" data-testid="button-close-video-modal"><X size={18} /></button></div>
        <label className="mb-4 block md:hidden"><span className="mb-1.5 block text-[.68rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Choose unit</span><select value={selected} onChange={(event) => onSelect(Number(event.target.value))} className="input-field" aria-label="Choose curriculum video unit" data-testid="select-video-unit">{videoUnits.map((item, index) => <option key={item[0]} value={index}>{item[0]} · {item[1]}</option>)}</select></label>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="order-2 max-h-[360px] space-y-1 overflow-y-auto pr-1 scrollbar-thin md:order-1">{videoUnits.map((item, index) => <button type="button" key={item[0]} onClick={() => onSelect(index)} className={`unit-button ${selected === index ? 'selected' : ''}`} data-testid={`button-video-unit-${item[0]}`}><span className="mono-font w-7 shrink-0 text-[.68rem] text-[hsl(var(--primary))]">{item[0]}</span><span className="text-xs leading-snug">{item[1]}</span>{selected === index && <CheckCircle2 className="ml-auto shrink-0 text-[hsl(var(--primary))]" size={15} />}</button>)}</div>
          <div className="order-1 flex flex-col justify-between border border-[hsl(var(--border))] bg-[rgba(0,0,0,.15)] p-4 md:order-2"><div><div className="mono-font text-4xl font-semibold tracking-[-.08em] text-[hsl(var(--primary))]">{unit[0]}</div><h3 className="mt-2 text-lg font-bold leading-tight text-[hsl(var(--foreground))]">{unit[1]}</h3></div><button type="button" onClick={openVideo} className="mt-8 flex items-center justify-center gap-2 bg-[hsl(var(--primary))] px-4 py-3 text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--primary-foreground))] transition hover:brightness-110" data-testid="button-open-selected-video">{copy[language].openLabel}<ArrowUpRight size={16} /></button></div>
        </div>
      </div>
    </div>
  );
}

function QuickNav({ onClose, onOpenCalculators }: { onClose?: () => void; onOpenCalculators?: () => void }) {
  const jump = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); onClose?.(); };
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Quick reference navigation">
      {onOpenCalculators && <button type="button" onClick={onOpenCalculators} className="flex items-center gap-2 border border-[hsl(var(--primary))] bg-[rgba(233,184,54,.08)] px-3 py-2 text-[.68rem] font-bold uppercase tracking-wide text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]" data-testid="button-fallback-open-calculators"><Calculator size={14} /> Workshop calculators</button>}
      <button type="button" onClick={() => jump('liner-calculator')} className="flex items-center gap-2 border border-[hsl(var(--border))] bg-[rgba(255,255,255,.025)] px-3 py-2 text-[.68rem] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" data-testid="button-jump-liner"><Calculator size={14} /> Liner calculator</button>
      <button type="button" onClick={() => jump('air-brake-reference')} className="flex items-center gap-2 border border-[hsl(var(--border))] bg-[rgba(255,255,255,.025)] px-3 py-2 text-[.68rem] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" data-testid="button-jump-air-brake"><Wind size={14} /> Air brake matrix</button>
      <button type="button" onClick={() => jump('injector-reference')} className="flex items-center gap-2 border border-[hsl(var(--border))] bg-[rgba(255,255,255,.025)] px-3 py-2 text-[.68rem] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" data-testid="button-jump-injector"><Fuel size={14} /> Injector return</button>
      <button type="button" onClick={() => jump('trade-terms')} className="flex items-center gap-2 border border-[hsl(var(--border))] bg-[rgba(255,255,255,.025)] px-3 py-2 text-[.68rem] font-bold uppercase tracking-wide text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" data-testid="button-jump-terms"><Languages size={14} /> Trade terms</button>
    </nav>
  );
}

function Home() {
  const [language, setLanguage] = useState<Language>('EN');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const current = copy[language];
  const closeVideo = () => setIsVideoOpen(false);
  return (
    <div className="workshop-app">
       <Header language={language} onLanguageChange={setLanguage} onOpenMenu={() => setIsMobileNavOpen(true)} onOpenCalculators={() => setIsCalculatorsOpen(true)} />
      {isMobileNavOpen && <div className="fixed inset-0 z-40 bg-[rgba(6,11,17,.8)] md:hidden" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsMobileNavOpen(false); }}><aside className="h-full w-[min(320px,88vw)] border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar))] p-5 shadow-2xl"><div className="mb-8 flex items-center justify-between"><span className="eyebrow">quick navigation</span><button type="button" onClick={() => setIsMobileNavOpen(false)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" aria-label="Close quick navigation" data-testid="button-close-navigation"><X size={19} /></button></div><QuickNav onClose={() => setIsMobileNavOpen(false)} /><div className="mt-10 border-t border-[hsl(var(--border))] pt-5"><div className="mono-font text-xs text-[hsl(var(--muted-foreground))]">FIELD MODE</div><div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[hsl(var(--foreground))]"><span className="status-dot" /> Cached reference active</div></div></aside></div>}
      <main className="mx-auto max-w-[1500px] px-4 pb-12 pt-5 sm:px-6 lg:px-10 lg:pt-8">
        <div className="mb-5 hidden items-center justify-between gap-4 md:flex"><QuickNav /><div className="flex items-center gap-2 text-[.68rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]"><HardHat size={14} className="text-[hsl(var(--primary))]" /> Workshop reference / 2024.1</div></div>
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
          <div className="panel bracket-corner flex flex-col justify-between overflow-hidden p-5 sm:p-7">
            <div><div className="eyebrow mb-5 flex items-center gap-2"><Wrench size={14} /> SA diesel trade companion</div><h2 className="hero-title display-font max-w-3xl text-[clamp(3rem,7vw,6.3rem)] font-bold uppercase leading-[.82] tracking-[-.03em] text-[hsl(var(--foreground))]">Know the<br /><span className="text-[hsl(var(--primary))]">pressure.</span><br />Trust the reading.</h2></div>
            <div className="mt-9 flex flex-col gap-4 border-t border-[hsl(var(--border))] pt-4 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]" data-testid="text-welcome-message">{current.welcome}</p><div className="hidden shrink-0 text-right sm:block"><div className="mono-font text-3xl font-semibold tracking-[-.08em] text-[hsl(var(--primary))]">NQF<span className="text-[hsl(var(--foreground))]">04</span></div><div className="text-[.6rem] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">learn / measure / verify</div></div></div>
          </div>
          <SafetyPanel language={language} />
        </section>

        <KM01Module />
        <KM02Module />
        <KM03Module />
        <KM04Module />
        <KM05Module />
        <KM06Module />
        <KM07Module />
        <KM08Module />
        <PM01Module />
        <PM02Module />
        <PM03Module />

        <section className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="Workshop baseline values">
          <div className="panel flex items-center gap-3 p-4"><div className="grid size-10 shrink-0 place-items-center bg-[rgba(233,184,54,.1)] text-[hsl(var(--primary))]"><Gauge size={19} /></div><div><div className="mono-font text-[.62rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">CRD rail warning</div><div className="metric-value mt-1 text-[hsl(var(--foreground))]">2,000+ <span className="text-xs tracking-normal text-[hsl(var(--muted-foreground))]">bar</span></div></div></div>
          <div className="panel flex items-center gap-3 p-4"><div className="grid size-10 shrink-0 place-items-center bg-[rgba(74,165,188,.1)] text-[hsl(var(--accent))]"><Wind size={19} /></div><div><div className="mono-font text-[.62rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Air brake cut-in</div><div className="metric-value mt-1 text-[hsl(var(--foreground))]">6.5 <span className="text-xs tracking-normal text-[hsl(var(--muted-foreground))]">bar</span></div></div></div>
          <div className="panel flex items-center gap-3 p-4"><div className="grid size-10 shrink-0 place-items-center bg-[rgba(93,173,119,.1)] text-[hsl(var(--chart-3))]"><ClipboardCheck size={19} /></div><div><div className="mono-font text-[.62rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Liner target</div><div className="metric-value mt-1 text-[hsl(var(--foreground))]">0.08–0.15 <span className="text-xs tracking-normal text-[hsl(var(--muted-foreground))]">mm</span></div></div></div>
        </section>

        <section className="mt-10" aria-labelledby="tools-heading"><div className="mb-4 flex items-end justify-between gap-4"><div><div className="eyebrow mb-2">{current.toolLabel} <span className="mx-1 text-[hsl(var(--border))]">/</span> {current.referenceLabel}</div><h2 id="tools-heading" className="section-heading">Measure before you diagnose</h2></div><span className="mono-font hidden text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] sm:block">local calculations / no signal required</span></div><div className="grid gap-4 lg:grid-cols-2"><LinerCalculator /><AirBrakePanel /><InjectorPanel /><section className="panel data-grid flex flex-col justify-between border-[hsl(var(--primary))] p-5"><div><div className="eyebrow mb-3 flex items-center gap-2"><BookOpen size={14} /> {current.videoLabel}</div><h2 className="section-heading max-w-sm">Ten units. One practical route to Red Seal.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Open a focused YouTube search from the curriculum. Use the lesson beside the truck, then verify the method against your workshop manual.</p></div><button type="button" onClick={() => setIsVideoOpen(true)} className="mt-8 flex w-full items-center justify-between border border-[hsl(var(--primary))] bg-[rgba(233,184,54,.1)] px-4 py-3 text-left text-xs font-bold uppercase tracking-[.13em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]" data-testid="button-open-video-resources"><span>Browse 10 curriculum units</span><ArrowUpRight size={17} /></button></section></div></section>

         <section className="mt-10"><TradeTerms language={language} onOpenCalculators={() => setIsCalculatorsOpen(true)} /></section>
        <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[hsl(var(--border))] pt-4 text-[.65rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] sm:flex-row"><div className="flex items-center gap-2"><span className="status-dot" /> Built for the South African workshop floor</div><div>Educational reference · verify against OEM and statutory procedure</div></footer>
      </main>
      {isVideoOpen && <VideoModal language={language} selected={selectedVideo} onSelect={setSelectedVideo} onClose={closeVideo} />}
      <TradeCalculators isOpen={isCalculatorsOpen} onClose={() => setIsCalculatorsOpen(false)} />
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;