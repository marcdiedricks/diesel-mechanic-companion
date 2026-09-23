import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Droplets,
  Fuel,
  HardHat,
  Languages,
  LockKeyhole,
  ShieldAlert,
  Siren,
  Wind,
  Wrench,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { TradeCalculators } from '@/components/TradeCalculators';
import { lessonDetails } from '@/lessonDetails';
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
    toolLabel: 'THEORY TOOLS',
    referenceLabel: 'LEARNING REFERENCES',
    termsLabel: 'TRADE TERMS',
    videoLabel: 'VISUAL LEARNING LIBRARY',
    openLabel: 'RESOURCE STATUS',
  },
  AF: {
    welcome: 'Molo / Hallo! Ek is jou Dieselwerktuigkundige Metgesel™ (SAQA ID: 117237). Gebruik die app vir teorie, terminologie, stelselbegrip, gevaarherkenning, diagnostiese redenasie, hersiening en bewysvoorbereiding. Praktiese voertuigwerk moet deur ’n goedgekeurde opleidings- of werkplekproses met bevoegde volwasse toesig plaasvind.',
    safetyTitle: 'VEILIGHEIDSHEK',
    safetyLead: 'Common Rail-stelsels kan dodelike druk behou nadat die enjin afgeskakel is.',
    safetyAction: 'Moenie hoërisikostelsels volgens app-instruksies oopmaak, toets of herstel nie. Gebruik die goedgekeurde werkswinkelproses en bevoegde toesig.',
    toolLabel: 'TEORIEGEREEDSKAP',
    referenceLabel: 'LEERVERWYSINGS',
    termsLabel: 'HANDELSTERME',
    videoLabel: 'VISUELE LEERBIBLIOTEEK',
    openLabel: 'HULPBRONSTATUS',
  },
  XH: {
    welcome: 'Molo! NdinguMkhapheli wakho weMechanic yeDiesel™ (SAQA ID: 117237). Sebenzisa le app kufundo lwethiyori, amagama omsebenzi, ukuqonda iinkqubo, ukuqaphela iingozi, ukucinga ngoxilongo, uphononongo lwekharityhulam kunye nokulungiselela ubungqina. Umsebenzi osebenzayo kwisithuthi kufuneka wenziwe phantsi kwenkqubo evunyiweyo kunye nolawulo lomntu omdala ofanelekileyo.',
    safetyTitle: 'ISANGO LOKHUSELEKO',
    safetyLead: 'Iinkqubo zeCommon Rail zinokugcina uxinzelelo olubulalayo emva kokucinywa.',
    safetyAction: 'Musa ukuvula, ukuvavanya okanye ukulungisa iinkqubo ezinobungozi usebenzisa imiyalelo ye-app. Landela inkqubo evunyiweyo kunye nolawulo olufanelekileyo.',
    toolLabel: 'IZIXHOBO ZETHIYORI',
    referenceLabel: 'IINGCACISO ZOKUFUNDA',
    termsLabel: 'AMAGAMA OMSEBENZI',
    videoLabel: 'ITHALA LEENCWADI LOKUFUNDA NGEMIFANEKISO',
    openLabel: 'IMEKO YESIXHOBO',
  },
  ZU: {
    welcome: 'Molo! NginguMngani wakho kaMakhenikha weDiesel™ (SAQA ID: 117237). Sebenzisa lolu hlelo ukufunda ithiyori, amagama omsebenzi, ukuqonda amasistimu, ukuqaphela izingozi, ukucabanga ngokuxilonga, ukubuyekeza ikharikhulamu nokulungiselela ubufakazi. Umsebenzi osebenzayo emotweni kufanele wenziwe ngaphansi kwenqubo egunyaziwe kanye nokuqondiswa umuntu omdala onekhono.',
    safetyTitle: 'ISANGO LOKUPHEPHA',
    safetyLead: 'Amasistimu eCommon Rail angagcina umfutho obulalayo ngemva kokucima.',
    safetyAction: 'Ungavuli, uvivinye noma ulungise amasistimu ayingozi usebenzisa imiyalelo ye-app. Landela inqubo egunyaziwe kanye nokuqondiswa okufanele.',
    toolLabel: 'AMATHULUZI ETHIYORI',
    referenceLabel: 'IZINKOMBA ZOKUFUNDA',
    termsLabel: 'AMAGAMA OMSEBENZI',
    videoLabel: 'UMTAPO WOKUFUNDA NGEZITHOMBE',
    openLabel: 'ISIMO SENSIZA',
  },
};

const workspaceCopy: Record<Language, {
  language: string; home: string; learn: string; ask: string; tools: string; reference: string; check: string; practicalSupervision: string; footer: string;
  slogan: string; chooseArea: string; safety: string; qualification: string; chooseKmPmWm: string; learningBoundary: string;
  knowledge: string; practical: string; workplace: string; askFind: string; askTitle: string; askLead: string;
  toolsTitle: string; toolsLead: string; openCalculators: string; referenceTitle: string; visualLibrary: string; visualLead: string;
  terminology: string; terminologyLead: string; checkTitle: string; checkLead: string; currentCheck: string; notStarted: string;
}> = {
  EN: {
    language:'Language', home:'HOME', learn:'LEARN', ask:'ASK', tools:'TOOLS', reference:'REFERENCE', check:'CHECK', practicalSupervision:'Practical work remains supervised and must follow the approved provider or workplace process.', footer:'Educational support only · supervised practical work required',
    slogan:'LEARN. PRACTISE. PREPARE.', chooseArea:'Choose one workspace area above.', safety:'Safety',
    qualification:'Official qualification structure', chooseKmPmWm:'Choose KM, PM or WM.',
    learningBoundary:'{ui.learningBoundary}',
    knowledge:'Knowledge Modules', practical:'Practical Skill Modules', workplace:'Work Experience Modules',
    askFind:'Ask / find', askTitle:'Use the existing offline learner help.',
    askLead:'Use the existing local trade-term search below. When a direct match is unavailable, the safe fallback guides you to verified learning support.',
    toolsTitle:'Existing diesel theory calculators.', toolsLead:'{ui.toolsLead}',
    openCalculators:'Open calculators', referenceTitle:'Safety and controlled visual resources.',
    visualLibrary:'Visual learning library', visualLead:'{ui.visualLead}',
    terminology:'Trade terminology', terminologyLead:'{ui.terminologyLead}',
    checkTitle:'Progress and learning checks.', checkLead:'{ui.checkLead}',
    currentCheck:'{ui.currentCheck}', notStarted:'Not started'
  },
  AF: {
    language:'Taal', home:'TUIS', learn:'LEER', ask:'VRA', tools:'GEREEDSKAP', reference:'VERWYSING', check:'KONTROLE', practicalSupervision:'Praktiese werk bly onder toesig en moet die goedgekeurde verskaffer- of werkplekproses volg.', footer:'Slegs opvoedkundige ondersteuning · praktiese werk onder toesig vereis',
    slogan:'LEER. OEFEN. BEREI VOOR.', chooseArea:'Kies een werkruimte hier bo.', safety:'Veiligheid',
    qualification:'Amptelike kwalifikasiestruktuur', chooseKmPmWm:'Kies KM, PM of WM.',
    learningBoundary:'PWA-leerondersteuning vervang nie praktiese bevoegdheid onder toesig, werkplekervaring of eksterne assesseringsvereistes nie.',
    knowledge:'Kennismodules', practical:'Praktiese vaardigheidsmodules', workplace:'Werkservaringsmodules',
    askFind:'Vra / soek', askTitle:'Gebruik die bestaande aflyn leerderhulp.',
    askLead:'Gebruik die bestaande plaaslike soektog vir vakterme hieronder. As daar nie ’n direkte pasmaat is nie, lei die veilige terugval jou na geverifieerde leerondersteuning.',
    toolsTitle:'Bestaande diesel-teorie sakrekenaars.', toolsLead:'Slegs vir klaskamerberekeninge. Geen sakrekenaar mag gevaarlike werkswinkelwerk magtig of goedgekeurde spesifikasies vervang nie.',
    openCalculators:'Maak sakrekenaars oop', referenceTitle:'Veiligheid en beheerde visuele hulpbronne.',
    visualLibrary:'Visuele leerbiblioteek', visualLead:'Beheerde aanlyn konsepbronne; geskrewe leer bly aflyn.',
    terminology:'Vakterminologie', terminologyLead:'Maak die bestaande plaaslike terminologiesoektog onder Vra oop.',
    checkTitle:'Vordering en leerkontroles.', checkLead:'Bestaande leerkontroles bly binne hul geverifieerde modules. Vordering word plaaslik op hierdie toestel gestoor; geen leerderrekening is nodig nie.',
    currentCheck:'Maak huidige leerkontrole oop', notStarted:'Nog nie begin nie'
  },
  XH: {
    language:'Ulwimi', home:'IKHAYA', learn:'FUNDA', ask:'BUZA', tools:'IZIXHOBO', reference:'IZALATHISO', check:'HLOLA', practicalSupervision:'Umsebenzi osebenzayo uhlala uphantsi kolawulo kwaye kufuneka ulandele inkqubo evunyiweyo yomboneleli okanye yendawo yokusebenza.', footer:'Inkxaso yemfundo kuphela · umsebenzi osebenzayo phantsi kolawulo uyafuneka',
    slogan:'FUNDA. ZIQHELISE. LUNGISELELA.', chooseArea:'Khetha indawo enye yokusebenza apha ngasentla.', safety:'Ukhuseleko',
    qualification:'Ulwakhiwo olusemthethweni lwesiqinisekiso', chooseKmPmWm:'Khetha i-KM, PM okanye WM.',
    learningBoundary:'Inkxaso yokufunda ye-PWA ayithathi indawo yobuchule bokusebenza phantsi kolawulo, amava omsebenzi okanye iimfuno zovavanyo lwangaphandle.',
    knowledge:'Iimodyuli zoLwazi', practical:'Iimodyuli zeZakhono eziSebenzayo', workplace:'Iimodyuli zamaVa eMsebenzini',
    askFind:'Buza / khangela', askTitle:'Sebenzisa uncedo olukhoyo lomfundi olusebenza ngaphandle kwe-intanethi.',
    askLead:'Sebenzisa uphendlo lwamagama omsebenzi olukhoyo apha ngezantsi. Ukuba akukho mpendulo ngqo, inkqubo ekhuselekileyo ikukhokelela kwinkxaso yokufunda eqinisekisiweyo.',
    toolsTitle:'Iikhaltyhuleyitha zethiyori yedizili ezikhoyo.', toolsLead:'Inkxaso yokubala yeklasi kuphela. Akukho khaltyhuleyitha egunyazisa umsebenzi oyingozi okanye ithathe indawo yeenkcukacha ezivunyiweyo.',
    openCalculators:'Vula iikhaltyhuleyitha', referenceTitle:'Ukhuseleko kunye nezixhobo ezibonwayo ezilawulwayo.',
    visualLibrary:'Ithala lokufunda ngemifanekiso', visualLead:'Izixhobo zekhonsepthi ezilawulwayo kwi-intanethi; ukufunda okubhaliweyo kuhlala kusebenza ngaphandle kwe-intanethi.',
    terminology:'Amagama omsebenzi', terminologyLead:'Vula uphendlo lwamagama olukhoyo phantsi ko-Buza.',
    checkTitle:'Inkqubela kunye nokuhlolwa kokufunda.', checkLead:'Ukuhlolwa kokufunda okukhoyo kuhlala kwiimodyuli eziqinisekisiweyo. Inkqubela igcinwa kule bhrawuza/isixhobo; akukho akhawunti yomfundi ifunekayo.',
    currentCheck:'Vula ukuhlolwa kokufunda kwangoku', notStarted:'Akukaqalwa'
  },
  ZU: {
    language:'Ulimi', home:'IKHAYA', learn:'FUNDA', ask:'BUZA', tools:'AMATHULUZI', reference:'IZINKOMBA', check:'HLOLA', practicalSupervision:'Umsebenzi osebenzayo uhlala uqondisiwe futhi kufanele ulandele inqubo egunyaziwe yomhlinzeki noma yasemsebenzini.', footer:'Ukusekelwa kwemfundo kuphela · umsebenzi osebenzayo oqondisiwe uyadingeka',
    slogan:'FUNDA. ZIJWAYEZE. LUNGISELELA.', chooseArea:'Khetha indawo eyodwa yokusebenza ngenhla.', safety:'Ukuphepha',
    qualification:'Isakhiwo esisemthethweni seziqu', chooseKmPmWm:'Khetha i-KM, PM noma WM.',
    learningBoundary:'Ukusekelwa kokufunda kwe-PWA akuthathi indawo yobuchwepheshe obuqondisiwe, isipiliyoni sasemsebenzini noma izidingo zokuhlolwa zangaphandle.',
    knowledge:'Amamojula Olwazi', practical:'Amamojula Amakhono Okusebenza', workplace:'Amamojula Okuhlangenwe Nakho Emsebenzini',
    askFind:'Buza / sesha', askTitle:'Sebenzisa usizo olukhona lomfundi olusebenza ngaphandle kwe-inthanethi.',
    askLead:'Sebenzisa usesho lwamagama omsebenzi olukhona ngezansi. Uma kungatholakali okufanayo ngqo, indlela ephephile ikuqondisa ekusekelweni kokufunda okuqinisekisiwe.',
    toolsTitle:'Izibali zethiyori kadizili ezikhona.', toolsLead:'Ukusekelwa kokubala kwasekilasini kuphela. Asikho isibali esigunyaza umsebenzi oyingozi noma esithatha indawo yezincazelo ezigunyaziwe.',
    openCalculators:'Vula izibali', referenceTitle:'Ukuphepha nezinsiza ezibonwayo ezilawulwayo.',
    visualLibrary:'Umtapo wokufunda ngezithombe', visualLead:'Izinsiza zekhonsepthi ezilawulwayo ku-inthanethi; ukufunda okubhaliwe kuhlala kutholakala ngaphandle kwe-inthanethi.',
    terminology:'Amagama omsebenzi', terminologyLead:'Vula usesho lwamagama olukhona ngaphansi kuka-Buza.',
    checkTitle:'Inqubekela phambili nokuhlolwa kokufunda.', checkLead:'Ukuhlolwa kokufunda okukhona kuhlala kumamojula aqinisekisiwe. Inqubekela igcinwa kule bhrawuza/idivayisi; akukho akhawunti yomfundi edingekayo.',
    currentCheck:'Vula ukuhlolwa kokufunda kwamanje', notStarted:'Akukaqalwa'
  }
};

const tradeTerms = {
  English: ['Common Rail Injector', 'Turbocharger Boost', 'Cylinder Liner Protrusion', 'Air Brake Slack Adjuster', 'Slack Adjuster', 'Air Dryer Cartridge', 'Governor Valve', 'Injector Return Flow', 'Jake/Retarder Brake', 'Flash Point'],
  Afrikaans: ['Gemeenskaplike Spuitbuis', 'Turbo-aanjaer Druk', 'Silindervoering Uitsteeksel', 'Lugrem Slakversteller', 'Vlampunt'],
  isiXhosa: ['Isitshisi se-Common Rail', 'Uxinzelelo lwe-Turbocharger', 'Ubude be-Cylinder Liner', 'Isilungisi sebhuleki yomoya'],
  isiZulu: ['Isitshisi se-Common Rail', 'Umfutho we-Turbocharger', 'Ukuphakama kwe-Cylinder Liner', 'Isilungisi samabhuleki omoya'],
} as const;

const SMART_SEARCH_FALLBACK = 'No direct match found in the offline knowledge base. Try a theory calculation or select a curriculum topic. Practical vehicle work must use approved workplace information and supervision.';

const videoUnits = [
  {
    code: '01',
    module: 'Workplace Fundamentals',
    title: 'Understanding Hazards and Risks',
    provider: 'WorkSafeBC',
    url: 'https://www.worksafebc.com/en/resources/health-safety/videos/understanding-hazards-and-risks',
    scope: 'Hazard-versus-risk recognition and safe escalation awareness.',
    safety: 'CONTROLLED',
  },
  {
    code: '02',
    module: 'Foundational Concepts for Mechanics',
    title: 'Introduction to Torque',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/video/introduction-to-torque?playlist=Physics',
    scope: 'Classroom mechanics: force, distance and rotational effect.',
    safety: 'LOW',
  },
  {
    code: '03',
    module: 'Vehicle and Equipment Fundamentals',
    title: 'How a Car Engine Works',
    provider: 'Animagraffs',
    url: 'https://www.youtube.com/watch?v=ZQvfHyfgBtA',
    scope: 'Animated system overview for component recognition and relationships.',
    safety: 'CONTROLLED',
  },
  {
    code: '04',
    module: 'Basic Engine Systems',
    title: 'How a Turbocharger Works — Animation',
    provider: 'Educational Mechanics',
    url: 'https://www.youtube.com/watch?v=K8aCL56jZX4',
    scope: 'Conceptual turbocharger airflow and exhaust-energy relationship.',
    safety: 'CONTROLLED',
  },
  {
    code: '05',
    module: 'Vehicle, Equipment and Propulsion Systems',
    title: 'How a Manual Transmission and Clutch Works',
    provider: 'Animagraffs',
    url: 'https://www.youtube.com/watch?v=o1ED4FQjDGk',
    scope: 'Animated driveline and transmission relationship overview.',
    safety: 'CONTROLLED',
  },
  {
    code: '06',
    module: 'Electrical, Electronic, Hydraulic and Pneumatic Principles',
    title: 'Intro to Electric Circuits',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/science/ap-physics-2/x0e2f5a2c%3Aelectric-circuits/x0e2f5a2c%3Acircuits-oms-kirchhoffs-laws/v/electric-circuits-part-1',
    scope: 'Classroom circuit concepts: current paths, components and basic relationships.',
    safety: 'LOW',
  },
  {
    code: '07',
    module: 'Advanced Vehicle and Equipment Systems',
    title: 'CAN Bus System Explained',
    provider: 'Automotive Explained',
    url: 'https://www.youtube.com/watch?v=jnQoR67lIug',
    scope: 'Conceptual vehicle-network communication between control units.',
    safety: 'CONTROLLED',
  },
  {
    code: '08',
    module: 'Problem Solving and Engine Optimisation',
    title: 'Problem Solving Process',
    provider: 'MIT OpenCourseWare',
    url: 'https://ocw.mit.edu/courses/res-tll-004-stem-concept-videos-fall-2013/resources/problem-solving-process/',
    scope: 'Structured problem definition, evidence and iterative reasoning.',
    safety: 'LOW',
  },
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

const pm04Activities = [
  {
    id: 'PM04-A01',
    title: 'Identify mechanical component groups and interfaces',
    summary: 'Recognise common mechanical component groups, mounting relationships, fastener locations and interface points from diagrams and approved training material.',
    evidence: 'Learner identification sheet showing component group, purpose and interface points.'
  },
  {
    id: 'PM04-A02',
    title: 'Interpret removal and installation job information',
    summary: 'Practise reading job cards, exploded views, part references, orientation markings and approved technical information without carrying out the physical task.',
    evidence: 'Completed document-reading exercise with the relevant references identified.'
  },
  {
    id: 'PM04-A03',
    title: 'Recognise hazards and support requirements',
    summary: 'Identify risks linked to heavy components, pinch points, stored energy, unsupported assemblies and vehicle movement from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing what must be stopped, supported or escalated through the supervised workplace process.'
  },
  {
    id: 'PM04-A04',
    title: 'Plan sequence and quality checks conceptually',
    summary: 'Organise the broad logic of a supervised task: confirm identification, protect parts, record orientation, check condition and verify completion against approved information.',
    evidence: 'Facilitator-reviewed planning checklist that does not include operational removal or installation steps.'
  },
  {
    id: 'PM04-A05',
    title: 'Record supervised mechanical work evidence',
    summary: 'Capture the job reference, component, supervisor, observed condition, approved source and final verification status after a supervised practical activity.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm05Activities = [
  {
    id: 'PM05-A01',
    title: 'Identify auto-electric and auto-electronic components',
    summary: 'Recognise broad component categories such as batteries, starters, alternators, relays, fuses, sensors, actuators, connectors and control units from approved images and diagrams.',
    evidence: 'Learner identification sheet matching component category to its general purpose.'
  },
  {
    id: 'PM05-A02',
    title: 'Interpret wiring and component information',
    summary: 'Practise reading wiring diagrams, connector references, component labels and approved technical information without probing or energising a real circuit.',
    evidence: 'Completed diagram-reading exercise showing correct component and circuit references.'
  },
  {
    id: 'PM05-A03',
    title: 'Recognise electrical and electronic hazards',
    summary: 'Identify risks such as short circuits, high current, stored energy, damaged insulation, incorrect bridging and unsafe battery handling from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet describing when work must stop and be escalated.'
  },
  {
    id: 'PM05-A04',
    title: 'Plan diagnostic evidence collection conceptually',
    summary: 'Organise what information would be needed for a supervised diagnosis, such as fault history, warning indicators, circuit references and approved test results.',
    evidence: 'A diagnostic evidence plan that contains no live-test procedure or bypass instruction.'
  },
  {
    id: 'PM05-A05',
    title: 'Document supervised electrical work evidence',
    summary: 'Record component identification, job reference, approved source, supervisor and verification status after an authorised practical session.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm06Activities = [
  {
    id: 'PM06-A01',
    title: 'Identify hydraulic and pneumatic component groups',
    summary: 'Recognise broad categories such as pumps, compressors, reservoirs, valves, actuators, hoses, pipes, filters and gauges from approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching component groups to their general function.'
  },
  {
    id: 'PM06-A02',
    title: 'Interpret fluid-power symbols and system information',
    summary: 'Practise reading basic hydraulic and pneumatic symbols, flow paths and approved system diagrams without opening, pressurising or testing a real system.',
    evidence: 'Completed schematic-reading activity reviewed by a facilitator.'
  },
  {
    id: 'PM06-A03',
    title: 'Recognise pressure and stored-energy hazards',
    summary: 'Identify risks linked to pressurised fluid, compressed air, hose failure, moving actuators and unsupported loads from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing what must be stopped and escalated.'
  },
  {
    id: 'PM06-A04',
    title: 'Plan diagnostic evidence collection conceptually',
    summary: 'Organise approved information such as symptoms, system diagrams, warning indicators, service history and supervisor-provided readings into an evidence trail.',
    evidence: 'A diagnostic evidence plan containing no pressure-test or disconnection procedure.'
  },
  {
    id: 'PM06-A05',
    title: 'Document supervised fluid-power work evidence',
    summary: 'Record the job reference, system, supervisor, approved source, observed condition and verification status after an authorised practical session.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm07Activities = [
  {
    id: 'PM07-A01',
    title: 'Interpret service schedules and maintenance information',
    summary: 'Practise reading service intervals, job cards, maintenance schedules and approved technical information to understand what maintenance is due.',
    evidence: 'Completed service-planning worksheet identifying the required maintenance category and approved source.'
  },
  {
    id: 'PM07-A02',
    title: 'Recognise maintenance items and condition indicators',
    summary: 'Identify broad maintenance items such as filters, fluids, belts, hoses, fasteners, warning indicators and visible condition cues from classroom examples.',
    evidence: 'Learner identification sheet describing what should be checked or escalated without performing the service.'
  },
  {
    id: 'PM07-A03',
    title: 'Plan a supervised service logically',
    summary: 'Organise the broad sequence of a service at planning level: confirm vehicle identity, review history, identify maintenance items, note hazards, and prepare evidence fields.',
    evidence: 'Facilitator-reviewed service plan containing no operational maintenance steps.'
  },
  {
    id: 'PM07-A04',
    title: 'Apply quality and environmental checks conceptually',
    summary: 'Understand why contamination control, spill prevention, parts accountability, waste handling, cleanliness and post-service verification matter.',
    evidence: 'Quality and environmental checklist completed for a classroom scenario.'
  },
  {
    id: 'PM07-A05',
    title: 'Capture supervised maintenance evidence',
    summary: 'Record the vehicle, job reference, approved source, supervisor, maintenance category, observed condition and verification status after authorised practical work.',
    evidence: 'Maintenance evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm08Activities = [
  {
    id: 'PM08-A01',
    title: 'Identify engine sub-assemblies and their relationships',
    summary: 'Recognise major engine sub-assemblies, interfaces and broad functions from diagrams, exploded views and approved training material.',
    evidence: 'Learner identification sheet showing component group, purpose and relationship to the complete engine.'
  },
  {
    id: 'PM08-A02',
    title: 'Interpret overhaul documentation and references',
    summary: 'Practise reading job cards, exploded views, inspection records and approved overhaul information without carrying out dismantling or reassembly.',
    evidence: 'Completed document-reading activity identifying the correct references and evidence fields.'
  },
  {
    id: 'PM08-A03',
    title: 'Recognise dismantling and reassembly hazards',
    summary: 'Identify risks linked to heavy components, stored energy, hot parts, sharp edges, contamination, unsupported assemblies and incorrect handling from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, escalate and supervision decisions.'
  },
  {
    id: 'PM08-A04',
    title: 'Plan condition assessment conceptually',
    summary: 'Understand the difference between observation, measured evidence, approved limits and an assessment conclusion using facilitator-provided examples.',
    evidence: 'Assessment worksheet comparing sample evidence with an approved reference without generating real repair instructions.'
  },
  {
    id: 'PM08-A05',
    title: 'Plan parts control and quality evidence',
    summary: 'Learn why orientation, identification, cleanliness, traceability, part condition and documentation matter during a supervised engine overhaul.',
    evidence: 'Parts-control and quality checklist completed for a classroom scenario.'
  },
  {
    id: 'PM08-A06',
    title: 'Record supervised overhaul evidence',
    summary: 'Capture job reference, engine identification, supervisor, approved source, observed condition and verification status after authorised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm09Activities = [
  {
    id: 'PM09-A01',
    title: 'Identify cooling-system components and flow relationships',
    summary: 'Recognise broad cooling-system component groups, flow paths and heat-management roles from diagrams and approved training material.',
    evidence: 'Learner identification sheet showing component group, purpose and relationship to the cooling circuit.'
  },
  {
    id: 'PM09-A02',
    title: 'Interpret cooling-system job and technical information',
    summary: 'Practise reading job cards, diagrams, service information, inspection records and approved technical references without opening or working on a real cooling system.',
    evidence: 'Completed document-reading exercise identifying the correct references and evidence fields.'
  },
  {
    id: 'PM09-A03',
    title: 'Recognise temperature, pressure and chemical hazards',
    summary: 'Identify risks linked to hot coolant, pressurised systems, moving fans, contamination and chemical exposure from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing when work must stop and be escalated.'
  },
  {
    id: 'PM09-A04',
    title: 'Plan condition assessment conceptually',
    summary: 'Understand how observations, approved measurements, leakage evidence, contamination signs and technical limits contribute to a supervised assessment.',
    evidence: 'Condition-assessment worksheet using facilitator-provided evidence rather than live testing.'
  },
  {
    id: 'PM09-A05',
    title: 'Plan quality and environmental controls',
    summary: 'Understand why cleanliness, contamination control, coolant handling, spill prevention, parts accountability and post-work verification matter.',
    evidence: 'Quality and environmental checklist completed for a classroom scenario.'
  },
  {
    id: 'PM09-A06',
    title: 'Record supervised cooling-system evidence',
    summary: 'Capture the job reference, system, supervisor, approved source, observed condition and verification status after authorised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm10Activities = [
  {
    id: 'PM10-A01',
    title: 'Identify brake-system component groups',
    summary: 'Recognise broad hydraulic and pneumatic brake-system component categories, their purpose and how they relate within the complete braking system using approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching component groups to their general role.'
  },
  {
    id: 'PM10-A02',
    title: 'Interpret brake-system job and technical information',
    summary: 'Practise reading job cards, schematics, inspection records and approved technical references without releasing, dismantling or testing a real brake system.',
    evidence: 'Completed document-reading exercise identifying the correct references and evidence fields.'
  },
  {
    id: 'PM10-A03',
    title: 'Recognise stored-energy and vehicle-movement hazards',
    summary: 'Identify risks linked to compressed air, springs, hydraulic pressure, vehicle movement, unsupported vehicles and heavy wheel-end components from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, secure, escalate and supervision decisions.'
  },
  {
    id: 'PM10-A04',
    title: 'Plan condition assessment conceptually',
    summary: 'Understand how observations, approved measurements, wear evidence, leakage evidence and technical limits contribute to a supervised brake-system assessment.',
    evidence: 'Condition-assessment worksheet using facilitator-provided evidence rather than live system testing.'
  },
  {
    id: 'PM10-A05',
    title: 'Plan quality and verification evidence',
    summary: 'Understand why component identity, cleanliness, condition, traceability and final verification are essential in safety-critical brake work.',
    evidence: 'Quality and verification checklist completed for a classroom scenario.'
  },
  {
    id: 'PM10-A06',
    title: 'Record supervised brake-system evidence',
    summary: 'Capture the job reference, brake-system area, supervisor, approved source, observed condition and verification status after authorised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm11Activities = [
  {
    id: 'PM11-A01',
    title: 'Identify drive train component groups',
    summary: 'Recognise broad drive train groups such as clutch or torque-transfer elements, transmissions, propeller shafts, differentials, axles and final-drive components from approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching component groups to their general role.'
  },
  {
    id: 'PM11-A02',
    title: 'Interpret drive train job and technical information',
    summary: 'Practise reading job cards, exploded views, component references, service information and inspection records without removing or opening a real drive train component.',
    evidence: 'Completed document-reading exercise identifying the correct references and evidence fields.'
  },
  {
    id: 'PM11-A03',
    title: 'Recognise heavy-component, movement and stored-energy hazards',
    summary: 'Identify risks linked to heavy assemblies, rotating parts, pinch points, unsupported components, vehicle movement and stored energy from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, support, isolate-by-approved-process and escalation decisions.'
  },
  {
    id: 'PM11-A04',
    title: 'Plan condition assessment conceptually',
    summary: 'Understand how observations, approved measurements, wear evidence, noise or vibration reports and technical limits contribute to a supervised drive train assessment.',
    evidence: 'Condition-assessment worksheet using facilitator-provided evidence rather than live testing.'
  },
  {
    id: 'PM11-A05',
    title: 'Plan quality, orientation and traceability evidence',
    summary: 'Understand why component identity, orientation, cleanliness, fastener accountability, condition and final verification matter during supervised drive train work.',
    evidence: 'Quality and traceability checklist completed for a classroom scenario.'
  },
  {
    id: 'PM11-A06',
    title: 'Record supervised drive train evidence',
    summary: 'Capture the job reference, drive train area, supervisor, approved source, observed condition and verification status after authorised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm12Activities = [
  {
    id: 'PM12-A01',
    title: 'Identify steering and suspension component groups',
    summary: 'Recognise broad steering and suspension component categories, their purpose and how they relate to vehicle control, stability and load support using approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching component groups to their general role.'
  },
  {
    id: 'PM12-A02',
    title: 'Interpret steering and suspension job information',
    summary: 'Practise reading job cards, exploded views, alignment reports, inspection records and approved technical references without lifting, dismantling or adjusting a real vehicle.',
    evidence: 'Completed document-reading exercise identifying the correct references and evidence fields.'
  },
  {
    id: 'PM12-A03',
    title: 'Recognise vehicle-support, spring and movement hazards',
    summary: 'Identify risks linked to vehicle movement, unsupported vehicles, stored spring energy, heavy components and pinch points from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, support-by-approved-process and escalation decisions.'
  },
  {
    id: 'PM12-A04',
    title: 'Plan condition assessment conceptually',
    summary: 'Understand how observations, approved measurements, tyre-wear patterns, play or looseness reports and technical limits contribute to a supervised assessment.',
    evidence: 'Condition-assessment worksheet using facilitator-provided evidence rather than live inspection procedures.'
  },
  {
    id: 'PM12-A05',
    title: 'Plan quality, geometry and verification evidence',
    summary: 'Understand why component identity, alignment information, fastener accountability, condition, traceability and final verification matter in steering and suspension work.',
    evidence: 'Quality and verification checklist completed for a classroom scenario.'
  },
  {
    id: 'PM12-A06',
    title: 'Record supervised steering and suspension evidence',
    summary: 'Capture the job reference, system area, supervisor, approved source, observed condition and verification status after authorised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm13Activities = [
  {
    id: 'PM13-A01',
    title: 'Identify basic hydraulic-system component groups',
    summary: 'Recognise broad hydraulic component categories such as pumps, reservoirs, control valves, actuators, hoses, pipes, filters and gauges from approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching component groups to their general function.'
  },
  {
    id: 'PM13-A02',
    title: 'Interpret hydraulic job and technical information',
    summary: 'Practise reading job cards, hydraulic schematics, inspection records and approved technical references without opening, pressurising or testing a real system.',
    evidence: 'Completed schematic-reading exercise identifying the correct references and evidence fields.'
  },
  {
    id: 'PM13-A03',
    title: 'Recognise pressure, injection and load hazards',
    summary: 'Identify risks linked to high-pressure fluid, hose failure, fluid injection, moving actuators, unsupported loads and stored energy from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, isolate-by-approved-process and escalation decisions.'
  },
  {
    id: 'PM13-A04',
    title: 'Plan condition assessment conceptually',
    summary: 'Understand how observations, approved measurements, leakage evidence, contamination signs and technical limits contribute to a supervised hydraulic assessment.',
    evidence: 'Condition-assessment worksheet using facilitator-provided evidence rather than live pressure testing.'
  },
  {
    id: 'PM13-A05',
    title: 'Plan quality, cleanliness and contamination controls',
    summary: 'Understand why cleanliness, sealing surfaces, hose condition, contamination control, fluid handling and final verification matter in hydraulic work.',
    evidence: 'Quality and contamination-control checklist completed for a classroom scenario.'
  },
  {
    id: 'PM13-A06',
    title: 'Record supervised hydraulic-system evidence',
    summary: 'Capture the job reference, hydraulic-system area, supervisor, approved source, observed condition and verification status after authorised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm14Activities = [
  {
    id: 'PM14-A01',
    title: 'Identify engine and vehicle component groups',
    summary: 'Recognise broad engine and vehicle component categories, interfaces and mounting relationships from approved diagrams, exploded views and classroom material.',
    evidence: 'Learner identification sheet showing component group, purpose and interface points.'
  },
  {
    id: 'PM14-A02',
    title: 'Interpret removal, test and refit job information',
    summary: 'Practise reading job cards, component references, inspection records and approved technical information without carrying out removal, testing, repair or refitting.',
    evidence: 'Completed document-reading exercise identifying the relevant references and evidence fields.'
  },
  {
    id: 'PM14-A03',
    title: 'Recognise heavy-component, stored-energy and system hazards',
    summary: 'Identify risks linked to heavy engines, rotating assemblies, hot systems, pressurised systems, electrical energy and unsupported components from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, escalate and supervision decisions.'
  },
  {
    id: 'PM14-A04',
    title: 'Plan diagnostic and repair evidence conceptually',
    summary: 'Organise symptom history, approved measurements, inspection findings, technical references and supervisor decisions into a clear evidence trail without prescribing the repair itself.',
    evidence: 'Diagnostic-evidence plan that contains no live-test or repair procedure.'
  },
  {
    id: 'PM14-A05',
    title: 'Plan quality, traceability and final verification',
    summary: 'Understand why component identity, part condition, cleanliness, orientation, approved specifications and final verification matter before a vehicle is returned to service.',
    evidence: 'Quality and traceability checklist completed for a classroom scenario.'
  },
  {
    id: 'PM14-A06',
    title: 'Record supervised removal, repair and refit evidence',
    summary: 'Capture the job reference, component, approved source, supervisor, observed condition, authorised work stage and verification status after supervised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm15Activities = [
  {
    id: 'PM15-A01',
    title: 'Organise vehicle-system symptoms and evidence',
    summary: 'Practise separating reported symptoms, observed evidence, service history, approved measurements and possible system areas before forming a diagnostic hypothesis.',
    evidence: 'Structured diagnostic worksheet showing symptom, evidence, possible system area and escalation point.'
  },
  {
    id: 'PM15-A02',
    title: 'Interpret diagnostic information and approved references',
    summary: 'Use classroom examples of fault records, warning indicators, technical diagrams and approved service information to build a reasoned diagnostic picture.',
    evidence: 'Facilitator-reviewed diagnostic information map containing no live-test procedure.'
  },
  {
    id: 'PM15-A03',
    title: 'Recognise when diagnostic work becomes high risk',
    summary: 'Identify when diagnosis involves high-pressure fuel, brakes, hydraulics, pneumatics, live electrical systems, heavy components, hot systems or moving machinery and must be escalated.',
    evidence: 'Hazard/escalation worksheet showing when app-supported reasoning must stop and supervised practical diagnosis must begin.'
  },
  {
    id: 'PM15-A04',
    title: 'Compare hypotheses against evidence',
    summary: 'Practise ranking possible causes by how well they fit the available evidence without prescribing a repair or parts replacement.',
    evidence: 'Reasoning table comparing multiple hypotheses with supporting and contradicting evidence.'
  },
  {
    id: 'PM15-A05',
    title: 'Plan repair verification conceptually',
    summary: 'Understand why an authorised repair must be verified against the original symptom, approved technical information and quality criteria before return to service.',
    evidence: 'Verification-planning worksheet that contains no operational repair or test sequence.'
  },
  {
    id: 'PM15-A06',
    title: 'Record supervised diagnostic and repair evidence',
    summary: 'Capture the job reference, system area, supervisor, approved source, evidence considered, authorised action and verification status after supervised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm16Activities = [
  {
    id: 'PM16-A01',
    title: 'Organise electrical-system symptoms and evidence',
    summary: 'Practise separating reported symptoms, warning indicators, service history, approved readings and circuit information before forming an electrical diagnostic hypothesis.',
    evidence: 'Structured diagnostic worksheet showing symptom, evidence, possible circuit or component area and escalation point.'
  },
  {
    id: 'PM16-A02',
    title: 'Interpret circuit diagrams and approved test information',
    summary: 'Use classroom examples of wiring diagrams, connector views, component references and supervisor-provided measurements to understand likely fault areas without probing a live vehicle.',
    evidence: 'Facilitator-reviewed circuit information map containing no live-test sequence.'
  },
  {
    id: 'PM16-A03',
    title: 'Recognise electrical hazards and unsafe test conditions',
    summary: 'Identify risks such as high current, short circuits, damaged insulation, incorrect bridging, battery hazards and electronically controlled systems from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing when diagnostic work must stop and be escalated.'
  },
  {
    id: 'PM16-A04',
    title: 'Compare electrical fault hypotheses against evidence',
    summary: 'Practise ranking possible causes by how well they fit approved evidence, without prescribing probing points, bypasses or component replacement.',
    evidence: 'Reasoning table comparing multiple hypotheses with supporting and contradicting evidence.'
  },
  {
    id: 'PM16-A05',
    title: 'Plan verification after an authorised repair',
    summary: 'Understand why an authorised electrical repair must be verified against the original symptom, approved technical information and quality criteria before return to service.',
    evidence: 'Verification-planning worksheet containing no operational repair or test sequence.'
  },
  {
    id: 'PM16-A06',
    title: 'Record supervised electrical diagnostic and repair evidence',
    summary: 'Capture the job reference, electrical system area, supervisor, approved source, evidence considered, authorised action and verification status after supervised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm17Activities = [
  {
    id: 'PM17-A01',
    title: 'Identify electronically controlled vehicle-system elements',
    summary: 'Recognise broad categories such as control modules, sensors, actuators, networked systems, warning indicators and communication pathways from approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching system elements to their general role.'
  },
  {
    id: 'PM17-A02',
    title: 'Interpret electronic diagnostic information conceptually',
    summary: 'Practise reading classroom examples of fault records, data labels, module diagrams and approved technical references without connecting diagnostic equipment to a real vehicle.',
    evidence: 'Facilitator-reviewed information map linking symptoms, module area and approved reference source.'
  },
  {
    id: 'PM17-A03',
    title: 'Recognise risks around electronic diagnosis and control',
    summary: 'Identify hazards and quality risks linked to incorrect probing, bypassing, module substitution, programming, battery condition, live circuits and unsafe test environments.',
    evidence: 'Hazard-recognition worksheet showing when work must stop and be escalated.'
  },
  {
    id: 'PM17-A04',
    title: 'Compare electronically controlled fault hypotheses',
    summary: 'Practise comparing possible causes such as sensor, actuator, wiring, power-supply or communication issues against approved evidence without prescribing a live test sequence.',
    evidence: 'Reasoning table with supporting and contradicting evidence for multiple hypotheses.'
  },
  {
    id: 'PM17-A05',
    title: 'Plan software, programming and verification evidence safely',
    summary: 'Understand at a high level why software state, calibration records, approved procedures and post-repair verification matter in electronically controlled systems.',
    evidence: 'Verification-planning worksheet containing no programming, coding or adaptation instructions.'
  },
  {
    id: 'PM17-A06',
    title: 'Record supervised electronic diagnostic and repair evidence',
    summary: 'Capture the job reference, electronic system area, supervisor, approved source, evidence considered, authorised action and verification status after supervised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const pm18Activities = [
  {
    id: 'PM18-A01',
    title: 'Identify air-conditioning system component groups',
    summary: 'Recognise broad component categories such as compressor, condenser, evaporator, expansion device, receiver/drier, hoses, controls and sensors from approved diagrams and classroom material.',
    evidence: 'Learner identification sheet matching component groups to their general function.'
  },
  {
    id: 'PM18-A02',
    title: 'Interpret air-conditioning job and technical information',
    summary: 'Practise reading job cards, system diagrams, inspection records and approved technical references without opening, charging or testing a real refrigerant system.',
    evidence: 'Completed document-reading exercise identifying the correct references and evidence fields.'
  },
  {
    id: 'PM18-A03',
    title: 'Recognise pressure, refrigerant and environmental hazards',
    summary: 'Identify risks linked to pressurised refrigerant, cold burns, hot components, moving belts or fans, electrical systems and environmental release from classroom scenarios.',
    evidence: 'Hazard-recognition worksheet showing stop, escalate and supervision decisions.'
  },
  {
    id: 'PM18-A04',
    title: 'Plan diagnostic evidence collection conceptually',
    summary: 'Organise symptoms, approved readings, warning indicators, service history and system information into a diagnostic evidence trail without prescribing refrigerant handling or live testing.',
    evidence: 'Diagnostic-evidence plan containing no charging, recovery or pressure-test procedure.'
  },
  {
    id: 'PM18-A05',
    title: 'Plan quality and environmental compliance evidence',
    summary: 'Understand why refrigerant identification, leak control, equipment certification, contamination prevention, record keeping and environmental compliance matter.',
    evidence: 'Quality and environmental checklist completed for a classroom scenario.'
  },
  {
    id: 'PM18-A06',
    title: 'Record supervised air-conditioning evidence',
    summary: 'Capture the job reference, system area, supervisor, approved source, observed condition, authorised action and verification status after supervised practical work.',
    evidence: 'Evidence record explicitly marked unverified until authorised review.'
  },
] as const;

const wm01Activities = [
  {
    id: 'WM01-A01',
    title: 'Understand the purpose of routine scheduled services',
    summary: 'Recognise why scheduled maintenance supports reliability, safety, service history and early fault detection in a real workplace context.',
    evidence: 'Workplace reflection or supervisor discussion note describing the purpose of scheduled servicing.'
  },
  {
    id: 'WM01-A02',
    title: 'Read service records and workplace documentation',
    summary: 'Practise interpreting service history, job cards, maintenance schedules and sign-off fields using workplace-approved documents.',
    evidence: 'Completed workplace documentation exercise or supervised record review.'
  },
  {
    id: 'WM01-A03',
    title: 'Recognise maintenance findings that require escalation',
    summary: 'Identify broad examples of abnormal wear, leaks, damage, warning indicators or overdue items that must be reported rather than ignored.',
    evidence: 'Supervisor-reviewed note showing the observation and escalation route.'
  },
  {
    id: 'WM01-A04',
    title: 'Reflect on quality and environmental controls',
    summary: 'Observe and document how the workplace manages cleanliness, waste, contamination, parts accountability and final quality checks during scheduled servicing.',
    evidence: 'Workplace observation checklist completed with supervisor review.'
  },
  {
    id: 'WM01-A05',
    title: 'Maintain a verified workplace evidence record',
    summary: 'Capture date, workplace, job reference, service category, supervising person and evidence status without self-certifying practical competence.',
    evidence: 'Workplace evidence entry awaiting authorised human verification.'
  },
] as const;

const wm02Activities = [
  {
    id: 'WM02-A01',
    title: 'Identify engine sub-system components in workplace context',
    summary: 'Recognise the relevant engine sub-system component groups, interfaces and job context from approved workplace information without performing the removal or replacement through app instructions.',
    evidence: 'Workplace learning record showing job reference, component group, supervisor and approved source.'
  },
  {
    id: 'WM02-A02',
    title: 'Interpret removal and replacement documentation',
    summary: 'Review job cards, component references, exploded views and approved technical information to understand the supervised task and required evidence fields.',
    evidence: 'Document-reading record identifying the relevant references and task context.'
  },
  {
    id: 'WM02-A03',
    title: 'Recognise hazards and escalation points',
    summary: 'Identify risks linked to hot systems, heavy components, pressure, electrical energy, pinch points and unsupported assemblies from the actual workplace context.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM02-A04',
    title: 'Capture condition and quality observations',
    summary: 'Record observed component condition, contamination issues, orientation, traceability and quality checks after supervised work without prescribing repair decisions.',
    evidence: 'Condition and quality observation record linked to the workplace job.'
  },
  {
    id: 'WM02-A05',
    title: 'Prepare workplace evidence for authorised verification',
    summary: 'Organise the job reference, component, supervisor, approved source, observed result and verification status into a clear evidence record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm03Activities = [
  {
    id: 'WM03-A01',
    title: 'Identify vehicle sub-system components in workplace context',
    summary: 'Recognise the relevant non-engine vehicle sub-system component groups, interfaces and task context from approved workplace information without performing removal or replacement through app instructions.',
    evidence: 'Workplace learning record showing job reference, system area, component group, supervisor and approved source.'
  },
  {
    id: 'WM03-A02',
    title: 'Interpret removal and replacement documentation',
    summary: 'Review job cards, exploded views, component references, inspection records and approved technical information to understand the supervised workplace task and evidence requirements.',
    evidence: 'Document-reading record identifying the relevant references, system area and evidence fields.'
  },
  {
    id: 'WM03-A03',
    title: 'Recognise system-specific hazards and escalation points',
    summary: 'Identify risks linked to vehicle support, stored energy, braking, steering, suspension, driveline, electrical, hydraulic or pneumatic systems from the actual workplace context.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM03-A04',
    title: 'Capture component condition and quality observations',
    summary: 'Record observed component condition, alignment or orientation cues, contamination issues, traceability and quality checks after supervised work without prescribing repair decisions.',
    evidence: 'Condition and quality observation record linked to the workplace job.'
  },
  {
    id: 'WM03-A05',
    title: 'Prepare workplace evidence for authorised verification',
    summary: 'Organise the job reference, system area, component, supervisor, approved source, observed result and verification status into a clear evidence record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm04Activities = [
  {
    id: 'WM04-A01',
    title: 'Identify engine-removal job context and interfaces',
    summary: 'Review vehicle and engine identification, mounting interfaces, connected systems and the supervised workplace job context from approved information without performing any removal or installation through app instructions.',
    evidence: 'Workplace learning record showing vehicle, engine, job reference, supervisor and approved source.'
  },
  {
    id: 'WM04-A02',
    title: 'Interpret engine-removal and installation documentation',
    summary: 'Review job cards, lifting plans, exploded views, interface references and approved technical information to understand the supervised task and evidence requirements.',
    evidence: 'Document-reading record identifying relevant references, connected systems and evidence fields.'
  },
  {
    id: 'WM04-A03',
    title: 'Recognise heavy-lift, crush and stored-energy hazards',
    summary: 'Identify risks linked to engine mass, suspended loads, support points, vehicle movement, hot systems, fuel, electricity, pressure and pinch zones from the actual workplace context.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM04-A04',
    title: 'Capture interface, condition and quality observations',
    summary: 'Record observed mounts, hoses, wiring, driveline interfaces, contamination issues, identification marks and quality observations after supervised work without prescribing operational steps.',
    evidence: 'Condition and interface observation record linked to the workplace job.'
  },
  {
    id: 'WM04-A05',
    title: 'Prepare engine removal/installation evidence for verification',
    summary: 'Organise the job reference, engine identification, supervisor, approved source, observed result and verification status into a clear workplace evidence record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm05Activities = [
  {
    id: 'WM05-A01',
    title: 'Identify vehicle sub-system repair context',
    summary: 'Review the workplace job, affected vehicle sub-system, reported symptoms, approved technical information and supervisor direction without performing the repair through app instructions.',
    evidence: 'Workplace learning record showing job reference, system area, supervisor and approved source.'
  },
  {
    id: 'WM05-A02',
    title: 'Interpret repair documentation and evidence requirements',
    summary: 'Review job cards, inspection findings, approved repair information, part references and quality requirements to understand the supervised workplace task.',
    evidence: 'Document-reading record identifying the relevant references and evidence fields.'
  },
  {
    id: 'WM05-A03',
    title: 'Recognise repair hazards and escalation points',
    summary: 'Identify risks linked to the relevant vehicle system, including stored energy, heavy components, hot systems, pressure, electricity, rotating parts and vehicle movement.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM05-A04',
    title: 'Capture pre-repair condition evidence',
    summary: 'Record observed symptoms, condition, approved measurements, part identity and supporting evidence before authorised repair work begins.',
    evidence: 'Pre-repair evidence record linked to the workplace job.'
  },
  {
    id: 'WM05-A05',
    title: 'Capture authorised repair-stage observations',
    summary: 'Record supervised observations such as component condition, replaced or retained parts, traceability, cleanliness and non-conformances without prescribing repair steps.',
    evidence: 'Repair-stage observation record reviewed by the supervisor.'
  },
  {
    id: 'WM05-A06',
    title: 'Record quality and verification evidence',
    summary: 'Capture the approved verification criteria, observed result, unresolved issues and supervisor decision after the authorised repair.',
    evidence: 'Quality/verification record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM05-A07',
    title: 'Prepare vehicle sub-system repair evidence for authorised verification',
    summary: 'Organise the job reference, system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm06Activities = [
  {
    id: 'WM06-A01',
    title: 'Identify cooling-system workplace task context',
    summary: 'Review vehicle identification, cooling-system area, job card information and approved workplace references to understand the supervised removal/replacement task without performing it through app instructions.',
    evidence: 'Workplace learning record showing job reference, system area, component group, supervisor and approved source.'
  },
  {
    id: 'WM06-A02',
    title: 'Interpret cooling-system documentation',
    summary: 'Review cooling-system diagrams, component references, inspection records and approved technical information to understand the workplace task and evidence requirements.',
    evidence: 'Document-reading record identifying the relevant references and evidence fields.'
  },
  {
    id: 'WM06-A03',
    title: 'Recognise temperature, pressure and chemical hazards',
    summary: 'Identify risks linked to hot coolant, pressurised systems, moving fans, chemical exposure, spills and contamination from the actual workplace context.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM06-A04',
    title: 'Capture condition and contamination observations',
    summary: 'Record visible condition, leakage evidence, contamination, hose or component condition, mounting observations and other supervisor-approved findings without prescribing repair actions.',
    evidence: 'Condition and contamination observation record linked to the workplace job.'
  },
  {
    id: 'WM06-A05',
    title: 'Record quality and environmental evidence',
    summary: 'Capture housekeeping, spill control, fluid handling, contamination prevention, part traceability and quality verification observed during supervised work.',
    evidence: 'Quality/environment record reviewed by the workplace supervisor.'
  },
  {
    id: 'WM06-A06',
    title: 'Prepare cooling-system workplace evidence for authorised verification',
    summary: 'Organise the job reference, system area, supervisor, approved source, observed result and verification status into a clear evidence record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm07Activities = [
  {
    id: 'WM07-A01',
    title: 'Capture electrical fault context in the workplace',
    summary: 'Record the reported symptom, relevant warning indicators, vehicle history, affected electrical system area and approved workplace references before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, symptom context, system area, supervisor and approved source.'
  },
  {
    id: 'WM07-A02',
    title: 'Interpret circuit and diagnostic information',
    summary: 'Review wiring diagrams, connector references, supervisor-provided readings, approved service information and existing fault records without carrying out live probing through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and the relevant circuit area.'
  },
  {
    id: 'WM07-A03',
    title: 'Recognise electrical hazards and escalation points',
    summary: 'Identify workplace risks linked to high current, damaged insulation, battery systems, live circuits, incorrect bridging and unsafe test conditions.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM07-A04',
    title: 'Capture diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, supervisor decisions and contradictions without prescribing live-test sequences or repair actions.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM07-A05',
    title: 'Record supervised repair and verification observations',
    summary: 'Capture the authorised repair stage, observed result, quality checks and unresolved issues after supervised practical work.',
    evidence: 'Repair/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM07-A06',
    title: 'Prepare electrical workplace evidence for authorised verification',
    summary: 'Organise the job reference, electrical system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm08Activities = [
  {
    id: 'WM08-A01',
    title: 'Capture air-conditioning fault context in the workplace',
    summary: 'Record the reported symptom, system area, vehicle history, warning indicators and approved workplace references before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, symptom context, system area, supervisor and approved source.'
  },
  {
    id: 'WM08-A02',
    title: 'Interpret system and diagnostic information',
    summary: 'Review approved diagrams, supervisor-provided readings, service information and existing records without opening, charging or testing a live refrigerant system through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and relevant system area.'
  },
  {
    id: 'WM08-A03',
    title: 'Recognise refrigerant, pressure and environmental hazards',
    summary: 'Identify workplace risks linked to pressurised refrigerant, cold burns, hot components, moving belts or fans, electrical systems and environmental release.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM08-A04',
    title: 'Capture diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, supervisor decisions and contradictions without prescribing charging, recovery or pressure-test procedures.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM08-A05',
    title: 'Record supervised repair and environmental-compliance observations',
    summary: 'Capture authorised work stage, environmental controls, observed result, quality checks and unresolved issues after supervised practical work.',
    evidence: 'Repair/environment/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM08-A06',
    title: 'Prepare air-conditioning workplace evidence for authorised verification',
    summary: 'Organise the job reference, system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm09Activities = [
  {
    id: 'WM09-A01',
    title: 'Capture electronic-control fault context',
    summary: 'Record reported symptoms, warning indicators, vehicle history, affected control-system area and approved workplace references before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, symptom context, system area, supervisor and approved source.'
  },
  {
    id: 'WM09-A02',
    title: 'Interpret network, module and diagnostic information',
    summary: 'Review approved diagrams, module references, supervisor-provided fault records and communication information without connecting or operating diagnostic equipment through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and relevant control-system area.'
  },
  {
    id: 'WM09-A03',
    title: 'Recognise risks in electronic-control diagnosis',
    summary: 'Identify workplace risks linked to live circuits, incorrect probing, module substitution, software state, network disruption, battery condition and unsafe test environments.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM09-A04',
    title: 'Capture diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, contradictions and supervisor decisions without prescribing scan-tool, programming or live-test procedures.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM09-A05',
    title: 'Record supervised repair, programming-status and verification observations',
    summary: 'Capture the authorised work stage, software or calibration status where relevant, observed result, quality checks and unresolved issues after supervised work.',
    evidence: 'Repair/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM09-A06',
    title: 'Prepare electronic-control workplace evidence for authorised verification',
    summary: 'Organise the job reference, control-system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm10Activities = [
  {
    id: 'WM10-A01',
    title: 'Capture engine fault context in the workplace',
    summary: 'Record reported symptoms, engine history, warning indicators, approved measurements and affected engine sub-system area before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, symptom context, engine/system area, supervisor and approved source.'
  },
  {
    id: 'WM10-A02',
    title: 'Interpret engine diagnostic information',
    summary: 'Review approved diagrams, service information, supervisor-provided readings, inspection findings and existing fault records without performing live tests through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and relevant engine sub-system area.'
  },
  {
    id: 'WM10-A03',
    title: 'Recognise engine-system hazards and escalation points',
    summary: 'Identify workplace risks linked to hot components, high-pressure fuel, rotating parts, heavy assemblies, stored energy, electrical systems and pressurised cooling or lubrication circuits.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM10-A04',
    title: 'Capture engine diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, contradictions and supervisor decisions without prescribing live test sequences or repair actions.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM10-A05',
    title: 'Record supervised engine repair and verification observations',
    summary: 'Capture the authorised work stage, observed result, quality checks, remaining concerns and supervisor decision after supervised practical work.',
    evidence: 'Repair/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM10-A06',
    title: 'Prepare engine-system workplace evidence for authorised verification',
    summary: 'Organise the job reference, engine/system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm11Activities = [
  {
    id: 'WM11-A01',
    title: 'Capture hydraulic or pneumatic fault context',
    summary: 'Record reported symptoms, system area, workplace history, approved diagrams and supervisor information before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, system area, symptom context, supervisor and approved source.'
  },
  {
    id: 'WM11-A02',
    title: 'Interpret fluid-power diagnostic information',
    summary: 'Review approved hydraulic or pneumatic schematics, component references, supervisor-provided readings and inspection records without carrying out live pressure testing through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and the relevant fluid-power system area.'
  },
  {
    id: 'WM11-A03',
    title: 'Recognise pressure, injection and stored-energy hazards',
    summary: 'Identify workplace risks linked to high-pressure fluid, compressed air, hose failure, fluid injection, moving actuators, unsupported loads and stored energy.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM11-A04',
    title: 'Capture diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, contradictions and supervisor decisions without prescribing pressure-test, release or component-repair procedures.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM11-A05',
    title: 'Record supervised repair and verification observations',
    summary: 'Capture the authorised work stage, contamination-control observations, observed result, quality checks and unresolved issues after supervised practical work.',
    evidence: 'Repair/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM11-A06',
    title: 'Prepare fluid-power workplace evidence for authorised verification',
    summary: 'Organise the job reference, system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm12Activities = [
  {
    id: 'WM12-A01',
    title: 'Capture brake-system fault context',
    summary: 'Record reported symptoms, warning indicators, service history, brake-system area and approved workplace references before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, symptom context, brake-system area, supervisor and approved source.'
  },
  {
    id: 'WM12-A02',
    title: 'Interpret brake-system diagnostic information',
    summary: 'Review approved schematics, inspection records, supervisor-provided readings and technical information without carrying out live brake-system testing through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and the relevant brake-system area.'
  },
  {
    id: 'WM12-A03',
    title: 'Recognise stored-energy and vehicle-movement hazards',
    summary: 'Identify workplace risks linked to compressed air, hydraulic pressure, springs, vehicle movement, unsupported vehicles and heavy wheel-end components.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM12-A04',
    title: 'Capture diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, contradictions and supervisor decisions without prescribing release, adjustment, pressure-test or repair procedures.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM12-A05',
    title: 'Record supervised repair and verification observations',
    summary: 'Capture the authorised work stage, observed result, quality checks and unresolved issues after supervised practical work.',
    evidence: 'Repair/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM12-A06',
    title: 'Prepare brake-system workplace evidence for authorised verification',
    summary: 'Organise the job reference, brake-system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm13Activities = [
  {
    id: 'WM13-A01',
    title: 'Capture drive-train fault context',
    summary: 'Record reported symptoms, operating context, service history, affected drive-train area and approved workplace references before supervised diagnosis begins.',
    evidence: 'Workplace learning record showing job reference, symptom context, drive-train area, supervisor and approved source.'
  },
  {
    id: 'WM13-A02',
    title: 'Interpret drive-train diagnostic information',
    summary: 'Review approved diagrams, inspection records, supervisor-provided findings and technical information without carrying out live drive-train testing through app instructions.',
    evidence: 'Diagnostic information record identifying the evidence used and the relevant drive-train area.'
  },
  {
    id: 'WM13-A03',
    title: 'Recognise heavy-component and movement hazards',
    summary: 'Identify workplace risks linked to vehicle movement, rotating shafts, heavy assemblies, stored energy, unsupported components and lifting operations.',
    evidence: 'Hazard and escalation note reviewed by the workplace supervisor.'
  },
  {
    id: 'WM13-A04',
    title: 'Capture diagnostic reasoning and authorised findings',
    summary: 'Record possible fault areas, evidence considered, contradictions and supervisor decisions without prescribing removal, adjustment, alignment or repair procedures.',
    evidence: 'Reasoning record linking workplace evidence to the authorised diagnostic decision.'
  },
  {
    id: 'WM13-A05',
    title: 'Record supervised repair and verification observations',
    summary: 'Capture the authorised work stage, observed result, quality checks, traceability and unresolved issues after supervised practical work.',
    evidence: 'Repair/verification observation record with final status left to the authorised reviewer.'
  },
  {
    id: 'WM13-A06',
    title: 'Prepare drive-train workplace evidence for authorised verification',
    summary: 'Organise the job reference, drive-train area, supervisor, approved source, evidence trail and verification status into a clear workplace record.',
    evidence: 'Completed workplace evidence record marked NOT VERIFIED until authorised review.'
  },
] as const;

const wm14Activities = [
  { id:'WM14-A01', title:'Capture steering and suspension fault context', summary:'Record reported symptoms, operating context, service history, affected steering or suspension area and approved workplace references before supervised diagnosis begins.', evidence:'Workplace learning record showing job reference, symptom context, system area, supervisor and approved source.' },
  { id:'WM14-A02', title:'Interpret steering and suspension diagnostic information', summary:'Review approved diagrams, inspection records, supervisor-provided findings and technical information without carrying out live steering or suspension testing through app instructions.', evidence:'Diagnostic information record identifying the evidence used and the relevant system area.' },
  { id:'WM14-A03', title:'Recognise support, spring and movement hazards', summary:'Identify workplace risks linked to unsupported vehicles, compressed springs, steering movement, heavy assemblies, stored energy and lifting operations.', evidence:'Hazard and escalation note reviewed by the workplace supervisor.' },
  { id:'WM14-A04', title:'Capture diagnostic reasoning and authorised findings', summary:'Record possible fault areas, evidence considered, contradictions and supervisor decisions without prescribing lifting, spring-compression, alignment, adjustment or repair procedures.', evidence:'Reasoning record linking workplace evidence to the authorised diagnostic decision.' },
  { id:'WM14-A05', title:'Record supervised repair and verification observations', summary:'Capture the authorised work stage, observed result, quality checks, alignment-status evidence where applicable and unresolved issues after supervised practical work.', evidence:'Repair/verification observation record with final status left to the authorised reviewer.' },
  { id:'WM14-A06', title:'Prepare steering and suspension workplace evidence for authorised verification', summary:'Organise the job reference, system area, supervisor, approved source, evidence trail and verification status into a clear workplace record.', evidence:'Completed workplace evidence record marked NOT VERIFIED until authorised review.' }
] as const;

const queryClient = new QueryClient();



function SupportActivityReader({
  activities,
  selectedId,
  completed,
  kind,
  moduleCode,
  onClose,
  onSelect,
  onToggle,
}: {
  activities: readonly { id: string; title: string; summary: string; evidence: string }[];
  selectedId: string;
  completed: string[];
  kind: 'practical' | 'workplace';
  moduleCode: string;
  onClose: () => void;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const index = activities.findIndex((activity) => activity.id === selectedId);
  const activity = activities[index];
  if (!activity) return null;
  const done = completed.includes(activity.id);
  const previous = index > 0 ? activities[index - 1] : null;
  const next = index < activities.length - 1 ? activities[index + 1] : null;
  const isPractical = kind === 'practical';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[hsl(var(--background))]" role="dialog" aria-modal="true" aria-labelledby="support-reader-title">
      <div className="sticky top-0 z-10 border-b border-[hsl(var(--border))] bg-[rgba(8,15,23,.97)] px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-3">
          <button type="button" onClick={onClose} className="text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">← Module</button>
          <div className="mono-font text-[.65rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{moduleCode} · {index + 1}/{activities.length}</div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center border border-[hsl(var(--border))]" aria-label="Close activity"><X size={17} /></button>
        </div>
      </div>

      <article className="mx-auto max-w-[900px] px-4 pb-24 pt-6 sm:px-6">
        <div className="eyebrow mb-3">{activity.id} · {isPractical ? 'preparation activity' : 'workplace evidence item'}</div>
        <h2 id="support-reader-title" className="display-font text-[2.15rem] font-bold uppercase leading-[.94] tracking-tight text-[hsl(var(--foreground))] sm:text-[2.8rem]">{activity.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{activity.summary}</p>

        <section className="mt-6 border-l-2 border-l-[hsl(var(--destructive))] bg-[rgba(234,96,83,.07)] p-5">
          <div className="eyebrow mb-2 text-[hsl(var(--destructive))]">Safety / authority boundary</div>
          <p className="text-sm leading-7 text-[hsl(var(--foreground))]">This screen supports recognition, planning, reflection and evidence preparation only. It does not provide operating, dismantling, isolation, pressure-release, lifting, live-testing, refrigerant, repair or return-to-service instructions. Any practical work must use the approved provider/workplace process under competent supervision.</p>
        </section>

        <section className="mt-4 panel p-5">
          <div className="eyebrow mb-3">{isPractical ? 'Preparation focus' : 'Workplace reflection focus'}</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Identify the task or learning purpose clearly before practical work begins.',
              'Confirm which approved document, job card, drawing or workplace source controls the activity.',
              'Recognise hazards, limits of learner authority and the point at which escalation is required.',
              'Record observations as facts and keep assumptions or unverified conclusions separate.',
            ].map((item, itemIndex) => (
              <div key={item} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
                <div className="mono-font text-[.62rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">Focus {itemIndex + 1}</div>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--foreground))]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 panel bracket-corner p-5">
          <div className="eyebrow mb-3">Evidence to prepare</div>
          <p className="text-sm leading-7 text-[hsl(var(--foreground))]">{activity.evidence}</p>
          <div className="mt-4 grid gap-2 text-sm text-[hsl(var(--muted-foreground))]">
            <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[hsl(var(--chart-3))]" /><span>Job, module or workplace reference identified.</span></div>
            <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[hsl(var(--chart-3))]" /><span>Supervisor or authorised reviewer identified where applicable.</span></div>
            <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[hsl(var(--chart-3))]" /><span>Observed facts recorded separately from assumptions.</span></div>
            <div className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[hsl(var(--chart-3))]" /><span>Verification status remains unverified until authorised human review.</span></div>
          </div>
        </section>

        <section className="mt-4 panel p-5">
          <div className="eyebrow mb-3">Reflection check</div>
          <div className="space-y-3 text-sm leading-6 text-[hsl(var(--foreground))]">
            <p><strong>Before:</strong> What information and authority must be confirmed before the supervised activity?</p>
            <p><strong>During:</strong> Which observations should be captured without turning them into unsupported conclusions?</p>
            <p><strong>After:</strong> What evidence still needs supervisor, assessor or workplace verification?</p>
          </div>
        </section>

        <button
          type="button"
          onClick={() => onToggle(activity.id)}
          className={`mt-5 w-full border px-4 py-3 text-xs font-bold uppercase tracking-[.1em] ${
            done
              ? 'border-[hsl(var(--chart-3))] text-[hsl(var(--chart-3))]'
              : 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
          }`}
        >
          {done ? (isPractical ? '✓ Preparation complete — tap to undo' : '✓ Evidence logged — tap to undo') : (isPractical ? 'Mark preparation complete' : 'Mark evidence logged')}
        </button>

        <nav className="mt-5 grid grid-cols-2 gap-3" aria-label="Activity navigation">
          <button type="button" disabled={!previous} onClick={() => previous && onSelect(previous.id)} className="border border-[hsl(var(--border))] p-4 text-left disabled:opacity-30">
            <div className="mono-font text-[.6rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Previous</div>
            <div className="mt-1 text-sm font-bold">{previous?.title || 'Start of module'}</div>
          </button>
          <button type="button" disabled={!next} onClick={() => next && onSelect(next.id)} className="border border-[hsl(var(--primary))] p-4 text-right disabled:opacity-30">
            <div className="mono-font text-[.6rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">Next</div>
            <div className="mt-1 text-sm font-bold">{next?.title || 'Module complete'}</div>
          </button>
        </nav>
      </article>
    </div>
  );
}

function LessonReader({
  lessons,
  selectedId,
  completed,
  onClose,
  onSelect,
  onToggle,
}: {
  lessons: readonly { id: string; title: string; summary: string; check: string }[];
  selectedId: string;
  completed: string[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const index = lessons.findIndex((lesson) => lesson.id === selectedId);
  const lesson = lessons[index];
  const detail = lesson ? lessonDetails[lesson.id] : undefined;
  const [answer, setAnswer] = useState<number | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [selectedId]);

  if (!lesson || !detail) return null;

  const done = completed.includes(lesson.id);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[hsl(var(--background))]" role="dialog" aria-modal="true" aria-labelledby="lesson-reader-title">
      <div className="sticky top-0 z-10 border-b border-[hsl(var(--border))] bg-[rgba(8,15,23,.97)] px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-3">
          <button type="button" onClick={onClose} className="text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">← Module</button>
          <div className="mono-font text-[.65rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Lesson {index + 1} of {lessons.length}</div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center border border-[hsl(var(--border))]" aria-label="Close lesson"><X size={17} /></button>
        </div>
      </div>

      <article className="mx-auto max-w-[900px] px-4 pb-24 pt-6 sm:px-6">
        <div className="eyebrow mb-3">{lesson.id} · full lesson</div>
        <h2 id="lesson-reader-title" className="display-font text-[2.3rem] font-bold uppercase leading-[.92] tracking-tight text-[hsl(var(--foreground))] sm:text-[3rem]">{lesson.title}</h2>
        <p className="mt-4 text-sm leading-7 text-[hsl(var(--muted-foreground))]">{lesson.summary}</p>

        <section className="mt-6 panel bracket-corner p-5">
          <div className="eyebrow mb-3">Learning objectives</div>
          <ul className="space-y-2 text-sm leading-6 text-[hsl(var(--foreground))]">
            {detail.objectives.map((item) => <li key={item} className="flex gap-3"><span className="text-[hsl(var(--primary))]">◆</span><span>{item}</span></li>)}
          </ul>
        </section>

        <section className="mt-4 panel p-5">
          <div className="eyebrow mb-3">Core teaching</div>
          <div className="space-y-4 text-sm leading-7 text-[hsl(var(--foreground))]">
            {detail.explanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <section className="mt-4 panel p-5">
          <div className="eyebrow mb-3">Key concepts</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {detail.concepts.map((concept, conceptIndex) => (
              <div key={concept} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
                <div className="mono-font text-[.62rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">Concept {conceptIndex + 1}</div>
                <p className="mt-2 text-sm leading-6 text-[hsl(var(--foreground))]">{concept}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 border-l-2 border-l-[hsl(var(--primary))] bg-[rgba(233,184,54,.06)] p-5">
          <div className="eyebrow mb-2">Worked learning scenario</div>
          <p className="text-sm leading-7 text-[hsl(var(--foreground))]">{detail.scenario}</p>
        </section>

        <section className="mt-4 panel p-5">
          <div className="eyebrow mb-3">Knowledge check</div>
          <h3 className="text-base font-bold leading-6 text-[hsl(var(--foreground))]">{detail.question}</h3>
          <div className="mt-4 grid gap-2">
            {detail.options.map((option, optionIndex) => {
              const chosen = answer === optionIndex;
              const correct = answer !== null && optionIndex === detail.answer;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswer(optionIndex)}
                  className={`border px-4 py-3 text-left text-sm leading-5 ${
                    correct ? 'border-[hsl(var(--chart-3))] bg-[rgba(93,173,119,.12)]' :
                    chosen ? 'border-[hsl(var(--primary))] bg-[rgba(233,184,54,.08)]' :
                    'border-[hsl(var(--border))]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {answer !== null && (
            <div className={`mt-4 border-l-2 p-3 text-sm ${
              answer === detail.answer
                ? 'border-l-[hsl(var(--chart-3))] bg-[rgba(93,173,119,.08)]'
                : 'border-l-[hsl(var(--primary))] bg-[rgba(233,184,54,.06)]'
            }`}>
              {answer === detail.answer ? 'Correct. ' : 'Not quite. '}
              {lesson.check}
            </div>
          )}
        </section>

        <section className="mt-4 panel p-5">
          <div className="eyebrow mb-3">Lesson recap</div>
          <ul className="space-y-2 text-sm leading-6">
            {detail.recap.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 size={16} className="mt-1 shrink-0 text-[hsl(var(--chart-3))]" /><span>{item}</span></li>)}
          </ul>
          <button
            type="button"
            onClick={() => onToggle(lesson.id)}
            className={`mt-5 w-full border px-4 py-3 text-xs font-bold uppercase tracking-[.1em] ${
              done
                ? 'border-[hsl(var(--chart-3))] text-[hsl(var(--chart-3))]'
                : 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
            }`}
          >
            {done ? '✓ Lesson complete — tap to undo' : 'Mark lesson complete'}
          </button>
        </section>

        <nav className="mt-5 grid grid-cols-2 gap-3" aria-label="Lesson navigation">
          <button type="button" disabled={!previous} onClick={() => previous && onSelect(previous.id)} className="border border-[hsl(var(--border))] p-4 text-left disabled:opacity-30">
            <div className="mono-font text-[.6rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Previous</div>
            <div className="mt-1 text-sm font-bold">{previous?.title || 'Start of module'}</div>
          </button>
          <button type="button" disabled={!next} onClick={() => next && onSelect(next.id)} className="border border-[hsl(var(--primary))] p-4 text-right disabled:opacity-30">
            <div className="mono-font text-[.6rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">Next</div>
            <div className="mt-1 text-sm font-bold">{next?.title || 'Module complete'}</div>
          </button>
        </nav>

        <div className="mt-6 border-t border-[hsl(var(--border))] pt-4 text-xs leading-6 text-[hsl(var(--muted-foreground))]">
          Learning companion only. Practical vehicle work must follow the approved provider/workplace process with competent supervision.
        </div>
      </article>
    </div>
  );
}




function KM01Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km01Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM02Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km02Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM03Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km03Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM04Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km04Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM05Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km05Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM06Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km06Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM07Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km07Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function KM08Module() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedLesson(lesson.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open full lesson
              </button>
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
      {selectedLesson && (
        <LessonReader
          lessons={km08Lessons}
          selectedId={selectedLesson}
          completed={completed}
          onClose={() => setSelectedLesson(null)}
          onSelect={setSelectedLesson}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM01Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
      {selectedActivity && (
        <SupportActivityReader
          activities={pm01Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-01"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM02Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
      {selectedActivity && (
        <SupportActivityReader
          activities={pm02Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-02"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM03Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
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
    <>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
      {selectedActivity && (
        <SupportActivityReader
          activities={pm03Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-03"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM04Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm04-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm04-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm04" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm04-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-04 • Remove and Install Mechanical Components</div>
          <h2 id="pm04-heading" className="section-heading">Practical Skill Support — PM-04</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-04, NQF Level 2, 6 credits. This section develops component recognition, document reading, hazard awareness, planning and evidence capture without teaching removal or installation procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide step-by-step component removal, installation, lifting, supporting, tightening, alignment or adjustment instructions. Practical work must follow approved technical information and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm04Activities.map((activity, index) => {
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> Preparation and learner records are not proof that a component was safely removed or installed. Practical competence must be verified by the authorised training/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm04Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-04"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM05Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm05-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm05-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm05" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm05-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-05 • Work with Auto-electric and Auto-electronic Components</div>
          <h2 id="pm05-heading" className="section-heading">Practical Skill Support — PM-05</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-05, NQF Level 2, 2 credits. This section supports component recognition, diagram interpretation, hazard awareness, diagnostic-evidence planning and evidence capture without teaching live electrical procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide live probing, jump-starting, battery removal, charging, circuit bridging, bypassing, ECU programming, connector back-probing or repair procedures. Practical work must follow approved technical information under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm05Activities.map((activity, index) => {
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> Learner preparation and app records do not prove safe electrical competence. Any practical work must be verified through the authorised training or workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm05Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-05"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM06Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm06-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm06-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm06" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm06-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-06 • Work with Fluid Power Components</div>
          <h2 id="pm06-heading" className="section-heading">Practical Skill Support — PM-06</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-06, NQF Level 2, 2 credits. This section supports component recognition, schematic reading, stored-energy awareness, diagnostic-evidence planning and supervised evidence capture.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide pressure-release, hose or pipe disconnection, hydraulic lifting, air-system release, actuator movement, pressure testing or component replacement procedures. Practical work must remain within approved provider/workplace controls and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm06Activities.map((activity, index) => {
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> Learner preparation and app records do not establish practical competence. Any fluid-power task must be completed and verified through the authorised training or workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm06Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-06"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM07Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm07-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm07-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm07" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm07-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-07 • Maintain and Service Vehicles and Vehicle Components</div>
          <h2 id="pm07-heading" className="section-heading">Practical Skill Support — PM-07</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-07, NQF Level 2, 5 credits. This section supports service-planning, maintenance-item recognition, quality thinking and evidence capture without teaching physical servicing procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide fluid-draining, filter-changing, belt adjustment, jacking, lifting, wheel removal, torque-setting, bleeding, hot-system opening or other vehicle-service procedures. Practical servicing must follow approved provider/workplace procedures under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm07Activities.map((activity, index) => {
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App preparation records do not prove that a vehicle was safely serviced. Practical competence must be generated and verified through the authorised training/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm07Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-07"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM08Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm08-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm08-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm08" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm08-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-08 • Dismantle, Assess and Reassemble Engines and Engine Sub-assemblies</div>
          <h2 id="pm08-heading" className="section-heading">Practical Skill Support — PM-08</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-08, NQF Level 3, 16 credits. This section supports component recognition, document interpretation, condition-assessment reasoning, parts control and evidence capture without teaching overhaul procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide engine dismantling, reassembly, lifting, timing, torque-setting, machining, bearing-fit, sealing, measurement or adjustment procedures. Practical overhaul work must follow approved technical information under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm08Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish practical overhaul competence. Any dismantling, assessment or reassembly evidence must be generated and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm08Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-08"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM09Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm09-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm09-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm09" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm09-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-09 • Dismantle, Assess and Reassemble Cooling Systems</div>
          <h2 id="pm09-heading" className="section-heading">Practical Skill Support — PM-09</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-09, NQF Level 4, 8 credits. This section supports component recognition, document interpretation, hazard awareness, condition-assessment reasoning, environmental controls and evidence capture without teaching cooling-system procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide hot-system opening, pressure release, coolant draining, fan access, chemical handling, flushing, dismantling, reassembly, pressure testing or repair procedures. Practical work must remain within approved provider/workplace controls and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm09Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish practical cooling-system competence. Any dismantling, assessment or reassembly evidence must be generated and verified through the authorised training or workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm09Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-09"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM10Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm10-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm10-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm10" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm10-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-10 • Dismantle, Assess and Reassemble Brake Systems</div>
          <h2 id="pm10-heading" className="section-heading">Practical Skill Support — PM-10</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-10, NQF Level 3, 5 credits. This section supports component recognition, technical-document reading, hazard awareness, condition-assessment reasoning, quality planning and supervised evidence capture without teaching brake procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> Brake systems are safety-critical. The app does not provide release, caging, bleeding, adjustment, dismantling, reassembly, air-pressure testing, hydraulic testing, wheel removal or brake repair procedures. Practical work must follow approved provider/workplace controls under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm10Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish brake-system practical competence. Any brake-system evidence must be generated and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm10Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-10"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM11Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm11-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm11-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm11" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm11-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-11 • Dismantle, Assess and Reassemble Drive Train System Components</div>
          <h2 id="pm11-heading" className="section-heading">Practical Skill Support — PM-11</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-11, NQF Level 3, 5 credits. This section supports component recognition, document interpretation, hazard awareness, condition-assessment reasoning, traceability and supervised evidence capture without teaching drive train procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide clutch, transmission, propeller-shaft, differential or axle dismantling, lifting, support, alignment, adjustment, lubrication, torque-setting, reassembly or repair procedures. Practical work must follow approved technical information under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm11Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish drive train practical competence. Any dismantling, assessment or reassembly evidence must be generated and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm11Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-11"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM12Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm12-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm12-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm12" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm12-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-12 • Dismantle, Assess and Reassemble Steering and Suspension Systems</div>
          <h2 id="pm12-heading" className="section-heading">Practical Skill Support — PM-12</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-12, NQF Level 3, 5 credits. This section supports component recognition, document interpretation, hazard awareness, condition-assessment reasoning, geometry/quality thinking and supervised evidence capture without teaching steering or suspension procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide vehicle lifting, supporting, spring release/compression, steering or suspension dismantling, alignment, adjustment, torque-setting, reassembly or repair procedures. Practical work must follow approved technical information under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm12Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish steering or suspension practical competence. Any dismantling, assessment, alignment or reassembly evidence must be generated and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm12Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-12"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM13Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm13-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm13-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm13" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm13-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-13 • Dismantle, Assess and Reassemble Basic Hydraulic Systems</div>
          <h2 id="pm13-heading" className="section-heading">Practical Skill Support — PM-13</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-13, NQF Level 3, 5 credits. This section supports component recognition, schematic interpretation, pressure-hazard awareness, condition-assessment reasoning, contamination control and supervised evidence capture without teaching hydraulic procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide pressure release, hose or pipe disconnection, hydraulic lifting, accumulator work, live pressure testing, component dismantling, reassembly, sealing or repair procedures. Practical work must follow approved technical information under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm13Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish hydraulic-system practical competence. Any dismantling, assessment or reassembly evidence must be generated and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm13Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-13"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM14Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm14-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm14-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm14" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm14-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-14 • Remove, Test, Repair and Refit Engines and Vehicle Components</div>
          <h2 id="pm14-heading" className="section-heading">Practical Skill Support — PM-14</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-14, NQF Level 3, 15 credits. This section supports component recognition, technical-document reading, hazard awareness, diagnostic-evidence planning, quality thinking and supervised evidence capture without teaching engine or vehicle-component repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide engine removal, lifting, testing, repair, refitting, alignment, torque-setting, timing, pressure release, live electrical testing or return-to-service procedures. Practical work must follow approved technical information under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm14Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish engine or vehicle-component practical competence. Any removal, testing, repair or refit evidence must be generated and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm14Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-14"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM15Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm15-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm15-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm15" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm15-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-15 • Diagnose and Repair Vehicle Systems</div>
          <h2 id="pm15-heading" className="section-heading">Practical Skill Support — PM-15</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-15, NQF Level 4, 30 credits. This section develops structured diagnostic reasoning, evidence comparison, escalation and verification planning without teaching live diagnosis or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide live diagnostic sequences, fault-code clearing, component bypassing, pressure testing, road-test procedures, brake work, fuel-system work, electrical probing, hydraulic or pneumatic testing, repair steps or return-to-service authorisation. Practical diagnosis and repair must remain under approved provider/workplace control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm15Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support diagnostic preparation only and do not establish practical diagnostic or repair competence. Any real diagnosis, repair or return-to-service decision must be completed and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm15Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-15"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM16Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm16-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm16-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm16" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm16-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-16 • Diagnose and Repair Electrical Systems</div>
          <h2 id="pm16-heading" className="section-heading">Practical Skill Support — PM-16</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-16, NQF Level 4, 12 credits. This section develops electrical diagnostic reasoning, circuit interpretation, hazard escalation, evidence comparison and verification planning without teaching live electrical test or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide live probing, battery work, circuit bridging, bypassing, continuity-test sequences, load testing, jump-starting, starter or alternator testing, connector back-probing, wiring repair or return-to-service authorisation. Practical electrical diagnosis and repair must remain under approved provider/workplace control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm16Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support diagnostic preparation only and do not establish electrical practical competence. Any real diagnosis, repair or return-to-service decision must be completed and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm16Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-16"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM17Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm17-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm17-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm17" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm17-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-17 • Diagnose and Repair Electronically Controlled Vehicle Systems</div>
          <h2 id="pm17-heading" className="section-heading">Practical Skill Support — PM-17</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-17, NQF Level 4, 10 credits. This section develops electronic-system recognition, diagnostic reasoning, hazard awareness, evidence comparison and verification planning without teaching live electronic diagnostic or programming procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide scan-tool connection, live data testing, actuator activation, coding, programming, adaptation, immobiliser procedures, module replacement, network probing, circuit bypassing or return-to-service authorisation. Practical electronic diagnosis and repair must remain under approved provider/workplace control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm17Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish electronic diagnostic or repair competence. Any real electronic diagnosis, programming, repair or return-to-service decision must be completed and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm17Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-17"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function PM18Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-pm18-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-pm18-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="pm18" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="pm18-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> PM-18 • Diagnose and Repair Air Conditioning System</div>
          <h2 id="pm18-heading" className="section-heading">Practical Skill Support — PM-18</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Preparation and evidence support mapped to 653306-000-01-PM-18, NQF Level 4, 5 credits. This section supports component recognition, document interpretation, hazard awareness, diagnostic-evidence planning, environmental compliance thinking and supervised evidence capture without teaching refrigerant handling or air-conditioning repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 prepared</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Supervision boundary:</strong> The app does not provide refrigerant recovery, charging, venting, pressure testing, vacuum procedures, leak testing, compressor removal, electrical testing or repair instructions. Practical air-conditioning work must follow approved provider/workplace procedures, environmental requirements and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pm18Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Preparation activity {index + 1} of 6</div>
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
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open preparation
              </button>
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
        <strong>Evidence status:</strong> App records support preparation only and do not establish air-conditioning practical competence. Any real diagnosis, refrigerant handling, repair or return-to-service decision must be completed and verified through the authorised provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={pm18Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="practical"
          moduleCode="PM-18"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM01Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm01-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm01-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm01" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm01-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-01 • Routine Scheduled Services</div>
          <h2 id="wm01-heading" className="section-heading">Work Experience Support — WM-01</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-01, NQF Level 2, 16 credits. This section helps learners understand, document and reflect on supervised workplace experience without simulating service completion or assessor sign-off.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 logged</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not teach or authorise servicing procedures and does not convert learner notes into verified workplace competence. All vehicle servicing must occur through the authorised workplace process under competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm01Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence example:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not logged' : 'Mark evidence logged'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> App entries remain learner records only. Workplace competence and experience must be verified by an authorised human through the provider/workplace process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm01Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-01"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM02Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm02-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm02-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm02" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm02-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-02 • Removal and Replacement of Engine Sub-system Components</div>
          <h2 id="wm02-heading" className="section-heading">Work Experience Support — WM-02</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-02, NQF Level 3, 16 credits. This section helps learners structure supervised workplace evidence for engine sub-system component removal and replacement without teaching or simulating the practical task.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide engine-component removal, replacement, lifting, timing, alignment, pressure-release, live electrical test, tightening or reassembly procedures. Practical work must remain under the approved workplace/provider process and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm02Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm02Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-02"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM03Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm03-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm03-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm03" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm03-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-03 • Removal and Replacement of Other Vehicle Sub-system Components</div>
          <h2 id="wm03-heading" className="section-heading">Work Experience Support — WM-03</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-03, NQF Level 3, 20 credits. This section helps learners structure supervised workplace evidence for non-engine vehicle sub-system component removal and replacement without teaching or simulating the practical task.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide removal, lifting, supporting, pressure-release, brake release, alignment, suspension work, driveline work, live electrical testing, tightening, adjustment or reassembly procedures. Practical work must remain under the approved workplace/provider process and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm03Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm03Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-03"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM04Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm04-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm04-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm04" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm04-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-04 • Engine Removal and Installation Processes</div>
          <h2 id="wm04-heading" className="section-heading">Work Experience Support — WM-04</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-04, NQF Level 3, 18 credits. This section helps learners structure evidence from supervised engine removal and installation work without teaching or simulating the physical process.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/5 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide lifting, slinging, support-point selection, engine removal, engine installation, disconnection, reconnection, alignment, pressure-release, live electrical work, torque-setting or return-to-service procedures. Practical work must remain under the approved workplace/provider process and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm04Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 5</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm04Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-04"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM05Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm05-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm05-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm05" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm05-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-05 • Repair Processes for Vehicle Sub-systems</div>
          <h2 id="wm05-heading" className="section-heading">Work Experience Support — WM-05</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-05, NQF Level 3, 50 credits. This section helps learners structure evidence from supervised vehicle sub-system repair processes without teaching, simulating or authorising the repair itself.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/7 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide repair sequences, component removal/replacement instructions, live testing, pressure release, brake work, electrical probing, lifting, adjustment, torque-setting or return-to-service authorisation. Real repair work must remain under the approved workplace/provider process and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm05Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 7</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm05Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-05"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM06Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm06-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm06-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm06" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm06-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-06 • Removal and Replacement of Cooling System</div>
          <h2 id="wm06-heading" className="section-heading">Work Experience Support — WM-06</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-06, NQF Level 3, 20 credits. This section helps learners structure supervised workplace evidence for cooling-system removal and replacement without teaching or simulating the physical task.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide hot-system opening, pressure release, coolant draining, fan access, hose removal, flushing, dismantling, reassembly, pressure testing or repair procedures. Practical work must remain under the approved workplace/provider process and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm06Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm06Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-06"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM07Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm07-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm07-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm07" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm07-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-07 • Diagnosis and Repair of Electrical Systems</div>
          <h2 id="wm07-heading" className="section-heading">Work Experience Support — WM-07</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-07, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised electrical diagnosis and repair without teaching live electrical test or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide live probing, battery work, circuit bridging, bypassing, load testing, continuity-test sequences, jump-starting, back-probing, wiring repair or return-to-service authorisation. Practical diagnosis and repair must remain under the approved workplace/provider process and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm07Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm07Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-07"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM08Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm08-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm08-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm08" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm08-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-08 • Diagnose and Repair Air Conditioning System</div>
          <h2 id="wm08-heading" className="section-heading">Work Experience Support — WM-08</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-08, NQF Level 4, 8 credits. This section helps learners structure evidence from supervised air-conditioning diagnosis and repair without teaching refrigerant handling or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide refrigerant recovery, charging, venting, pressure testing, vacuum procedures, leak testing, compressor removal, electrical testing or return-to-service authorisation. Practical work must remain under approved provider/workplace control, environmental requirements and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm08Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm08Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-08"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM09Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm09-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm09-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm09" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm09-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-09 • Diagnosis and Repair of Electronic Control Systems</div>
          <h2 id="wm09-heading" className="section-heading">Work Experience Support — WM-09</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-09, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised electronic-control diagnosis and repair without teaching scan-tool, programming or live electronic procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide scan-tool connection, live-data testing, actuator activation, coding, programming, adaptation, immobiliser procedures, module replacement, network probing, circuit bypassing or return-to-service authorisation. Practical diagnosis and repair must remain under approved workplace/provider control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm09Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm09Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-09"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM10Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm10-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm10-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm10" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm10-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-10 • Diagnosis and Repair of Engines and Engine Sub-systems</div>
          <h2 id="wm10-heading" className="section-heading">Work Experience Support — WM-10</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-10, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised engine and engine-sub-system diagnosis and repair without teaching live diagnostic or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide high-pressure fuel work, live engine testing, timing, adjustment, dismantling, machining, pressure testing, hot-system opening, electrical probing, repair sequences or return-to-service authorisation. Practical diagnosis and repair must remain under approved workplace/provider control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm10Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm10Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-10"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM11Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm11-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm11-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm11" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm11-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-11 • Diagnosis and Repair of Hydraulic and Pneumatic Systems</div>
          <h2 id="wm11-heading" className="section-heading">Work Experience Support — WM-11</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-11, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised hydraulic and pneumatic diagnosis and repair without teaching live pressure, release or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide pressure release, hose or pipe disconnection, live pressure testing, hydraulic lifting, actuator movement, accumulator work, brake-air release, dismantling, reassembly, sealing or return-to-service authorisation. Practical work must remain under approved workplace/provider control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm11Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm11Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-11"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM12Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm12-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm12-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm12" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm12-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-12 • Diagnosis and Repair of Brake Systems</div>
          <h2 id="wm12-heading" className="section-heading">Work Experience Support — WM-12</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-12, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised brake-system diagnosis and repair without teaching live brake testing or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> Brake systems are safety-critical. The app does not provide release, caging, bleeding, adjustment, pressure testing, wheel removal, dismantling, reassembly, repair or return-to-service authorisation. Practical diagnosis and repair must remain under approved workplace/provider control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm12Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm12Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-12"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}


function WM13Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('diesel-wm13-progress') || '[]'); } catch { return []; }
  });

  const toggle = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('diesel-wm13-progress', JSON.stringify(next));
      return next;
    });
  };

  return (
    <>
    <section id="wm13" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm13-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14} /> WM-13 • Diagnosis and Repair of Drive Train Systems</div>
          <h2 id="wm13-heading" className="section-heading">Work Experience Support — WM-13</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
            Workplace evidence support mapped to 653306-000-01-WM-13, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised drive-train diagnosis and repair without teaching removal, lifting, alignment or repair procedures.
          </p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>

      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
        <strong>Workplace boundary:</strong> The app does not provide clutch, transmission, prop-shaft, differential or axle removal; lifting or support procedures; alignment; adjustment; dismantling; repair; torque-setting; or return-to-service authorisation. Practical work must remain under approved workplace/provider control and competent adult supervision.
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {wm13Activities.map((activity, index) => {
          const done = completed.includes(activity.id);
          return (
            <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index + 1} of 6</div>
                  <h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3>
                </div>
                {done && <CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]" />}
              </div>
              <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
              <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
                <strong>Evidence scaffold:</strong> {activity.evidence}
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(activity.id)}
                className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
              >
                Open evidence item
              </button>
              <button
                type="button"
                onClick={() => toggle(activity.id)}
                className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                aria-pressed={done}
              >
                {done ? 'Mark not recorded' : 'Mark evidence recorded'}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        <strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.
      </div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm13Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-13"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
  );
}

function WM14Module() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [completed,setCompleted]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('diesel-wm14-progress')||'[]')}catch{return []}});
  const toggle=(id:string)=>setCompleted(current=>{const next=current.includes(id)?current.filter(x=>x!==id):[...current,id];localStorage.setItem('diesel-wm14-progress',JSON.stringify(next));return next;});
  return (
    <>
    <section id="wm14" className="mt-6 panel bracket-corner p-4 sm:p-6" aria-labelledby="wm14-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2 flex items-center gap-2"><ClipboardCheck size={14}/> WM-14 • Diagnosis and Repair of Steering and Suspension Systems</div>
          <h2 id="wm14-heading" className="section-heading">Work Experience Support — WM-14</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Workplace evidence support mapped to 653306-000-01-WM-14, NQF Level 4, 18 credits. This section helps learners structure evidence from supervised steering and suspension diagnosis and repair without teaching lifting, spring-compression, alignment or repair procedures.</p>
        </div>
        <div className="mono-font shrink-0 text-right text-[.68rem] uppercase tracking-[.1em] text-[hsl(var(--primary))]">{completed.length}/6 recorded</div>
      </div>
      <div className="mb-5 border border-[rgba(234,96,83,.35)] bg-[rgba(234,96,83,.08)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]"><strong>Workplace boundary:</strong> The app does not provide vehicle lifting/support, spring compression, steering disassembly, suspension dismantling, alignment, adjustment, torque-setting, repair or return-to-service authorisation. Practical work must remain under approved workplace/provider control and competent adult supervision.</div>
      <div className="grid gap-3 md:grid-cols-2">
        {wm14Activities.map((activity,index)=>{const done=completed.includes(activity.id);return <article key={activity.id} className="border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-4">
          <div className="mb-2 flex items-start justify-between gap-3"><div><div className="mono-font text-[.62rem] uppercase tracking-[.12em] text-[hsl(var(--primary))]">Workplace evidence item {index+1} of 6</div><h3 className="mt-1 text-sm font-bold uppercase tracking-wide text-[hsl(var(--foreground))]">{activity.title}</h3></div>{done&&<CheckCircle2 size={18} className="shrink-0 text-[hsl(var(--chart-3))]"/>}</div>
          <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{activity.summary}</p>
          <div className="mt-3 border-l-2 border-[hsl(var(--primary))] pl-3 text-xs leading-relaxed text-[hsl(var(--foreground))]"><strong>Evidence scaffold:</strong> {activity.evidence}</div>
          <button type="button" onClick={()=>setSelectedActivity(activity.id)} className="mt-4 mr-2 border border-[hsl(var(--foreground))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--foreground))]">Open evidence item</button>
          <button type="button" onClick={()=>toggle(activity.id)} className="mt-4 border border-[hsl(var(--primary))] px-3 py-2 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]" aria-pressed={done}>{done?'Mark not recorded':'Mark evidence recorded'}</button>
        </article>})}
      </div>
      <div className="mt-5 border-t border-[hsl(var(--border))] pt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]"><strong>Verification status:</strong> Learner-entered workplace evidence remains NOT VERIFIED until reviewed through the authorised workplace/provider process.</div>
    </section>
      {selectedActivity && (
        <SupportActivityReader
          activities={wm14Activities}
          selectedId={selectedActivity}
          completed={completed}
          kind="workplace"
          moduleCode="WM-14"
          onClose={() => setSelectedActivity(null)}
          onSelect={setSelectedActivity}
          onToggle={toggle}
        />
      )}

    </>
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

function Header({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  const ui = workspaceCopy[language];
  return (
    <header className="border-b border-[hsl(var(--border))] bg-[rgba(8,15,23,.92)]">
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="grid size-10 shrink-0 place-items-center border border-[hsl(var(--primary))] bg-[rgba(233,184,54,.1)] text-[hsl(var(--primary))]" aria-label="Diesel Mechanic Companion mark">
          <TurboInjectorMark />
        </div>
        <div className="min-w-0">
          <div className="eyebrow mb-1 flex items-center gap-2"><span className="status-dot" /> workshop mode / offline-ready</div>
          <h1 className="display-font text-[clamp(1.15rem,5vw,1.9rem)] font-bold uppercase leading-[1.05] tracking-tight text-[hsl(var(--foreground))]">Diesel Mechanic Companion™</h1>
          <p className="mono-font mt-1 text-[.58rem] uppercase leading-relaxed tracking-[.1em] text-[hsl(var(--muted-foreground))]">SAQA 117237 <span className="text-[hsl(var(--primary))]">|</span> NQF 4 <span className="text-[hsl(var(--primary))]">|</span> 544 credits <span className="text-[hsl(var(--primary))]">|</span> MERSETA / NAMB</p>
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,.055)] bg-[rgba(255,255,255,.018)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
            <Languages size={14} />
            <span className="text-[.62rem] font-semibold uppercase tracking-[.12em]">{ui.language}</span>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-1" aria-label="Language selection">
            {languages.map((item) => (
              <button type="button" key={item} onClick={() => onLanguageChange(item)} className={`language-button px-2.5 py-1.5 text-[.68rem] font-bold tracking-[.1em] ${language === item ? 'active' : 'text-[hsl(var(--muted-foreground))] hover:bg-[rgba(255,255,255,.06)] hover:text-[hsl(var(--foreground))]'}`} aria-pressed={language === item} data-testid={`button-language-${item.toLowerCase()}`}>
                {item}
              </button>
            ))}
          </nav>
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

function TradeTerms({ language, onOpenCalculators }: { language: Language; onOpenCalculators: () => void }) {
  const [search, setSearch] = useState('');
  const selectedTradeLanguage = language === 'AF' ? 'Afrikaans' : language === 'XH' ? 'isiXhosa' : language === 'ZU' ? 'isiZulu' : 'English';
  const groups = useMemo(() => {
    const terms = tradeTerms[selectedTradeLanguage as keyof typeof tradeTerms] || [];
    const filtered = terms.filter((term) => term.toLowerCase().includes(search.toLowerCase()));
    return filtered.length ? [{ language: selectedTradeLanguage, terms: filtered }] : [];
  }, [search, selectedTradeLanguage]);
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
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const updateOnline = () => setOnline(navigator.onLine);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, [onClose]);

  const unit = videoUnits[selected];
  const openVideo = () => {
    if (!online) return;
    window.open(unit.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-card panel bracket-corner bg-[hsl(var(--card))] p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="video-modal-heading">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow mb-2 flex items-center gap-2"><BookOpen size={14} /> {copy[language].videoLabel}</div>
            <h2 id="video-modal-heading" className="section-heading">Controlled visual-learning library</h2>
            <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
              Optional online concept support only. The written lesson remains complete offline. External resources do not authorise practical work or count as competence evidence.
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" aria-label="Close visual learning library" data-testid="button-close-video-modal"><X size={18} /></button>
        </div>

        <div className="mb-4 flex items-center justify-between border border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] px-3 py-2 text-[.68rem] uppercase tracking-[.1em]">
          <span>Internet status</span>
          <span className={online ? 'text-[hsl(var(--chart-3))]' : 'text-[hsl(var(--destructive))]'}>{online ? 'ONLINE · LINKS AVAILABLE' : 'OFFLINE · LESSONS STILL AVAILABLE'}</span>
        </div>

        <label className="mb-4 block md:hidden">
          <span className="mb-1.5 block text-[.68rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Choose unit</span>
          <select value={selected} onChange={(event) => onSelect(Number(event.target.value))} className="input-field" aria-label="Choose curriculum video unit" data-testid="select-video-unit">
            {videoUnits.map((item, index) => <option key={item.code} value={index}>{item.code} · {item.module}</option>)}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="order-2 max-h-[420px] space-y-1 overflow-y-auto pr-1 scrollbar-thin md:order-1">
            {videoUnits.map((item, index) => (
              <button type="button" key={item.code} onClick={() => onSelect(index)} className={`unit-button ${selected === index ? 'selected' : ''}`} data-testid={`button-video-unit-${item.code}`}>
                <span className="mono-font w-7 shrink-0 text-[.68rem] text-[hsl(var(--primary))]">{item.code}</span>
                <span className="text-left text-xs leading-snug">
                  <strong>{item.module}</strong><br />
                  <span className="text-[hsl(var(--muted-foreground))]">{item.title}</span>
                </span>
                {selected === index && <CheckCircle2 className="ml-auto shrink-0 text-[hsl(var(--primary))]" size={15} />}
              </button>
            ))}
          </div>

          <div className="order-1 flex flex-col justify-between border border-[hsl(var(--border))] bg-[rgba(0,0,0,.15)] p-4 md:order-2">
            <div>
              <div className="mono-font text-4xl font-semibold tracking-[-.08em] text-[hsl(var(--primary))]">{unit.code}</div>
              <div className="mt-1 text-[.62rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{unit.module}</div>
              <h3 className="mt-3 text-lg font-bold leading-tight text-[hsl(var(--foreground))]">{unit.title}</h3>
              <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{unit.provider}</p>
              <p className="mt-4 text-xs leading-6 text-[hsl(var(--foreground))]">{unit.scope}</p>
              <div className="mt-4 inline-flex border border-[hsl(var(--border))] px-2 py-1 text-[.6rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Vetted 2026-09-21 · {unit.safety}</div>
            </div>
            <button
              type="button"
              onClick={openVideo}
              disabled={!online}
              className={`mt-8 flex items-center justify-center gap-2 border px-4 py-3 text-xs font-bold uppercase tracking-[.12em] ${
                online
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'
                  : 'cursor-not-allowed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
              }`}
              data-testid="button-open-selected-video"
            >
              {online ? 'OPEN VETTED ONLINE RESOURCE' : 'INTERNET REQUIRED'}
            </button>
          </div>
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
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [section, setSection] = useState<'home' | 'learn' | 'ask' | 'tools' | 'reference' | 'check'>('home');
  const [learnGroup, setLearnGroup] = useState<'knowledge' | 'practical' | 'workplace'>('knowledge');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const current = copy[language];
  const ui = workspaceCopy[language];
  const closeVideo = () => setIsVideoOpen(false);

  const knowledgeModules = [
    { code: 'KM-01', title: 'Workplace Fundamentals', credits: 9, Component: KM01Module },
    { code: 'KM-02', title: 'Foundational Concepts for Mechanics', credits: 14, Component: KM02Module },
    { code: 'KM-03', title: 'Vehicle and Equipment Fundamentals', credits: 8, Component: KM03Module },
    { code: 'KM-04', title: 'Basic Engine Systems', credits: 8, Component: KM04Module },
    { code: 'KM-05', title: 'Vehicle, Equipment and Propulsion Systems', credits: 13, Component: KM05Module },
    { code: 'KM-06', title: 'Electrical Systems and Basic Electronic, Hydraulic and Pneumatic Principles', credits: 16, Component: KM06Module },
    { code: 'KM-07', title: 'Advanced Vehicle and Equipment Systems', credits: 30, Component: KM07Module },
    { code: 'KM-08', title: 'Problem Solving and Engine Optimisation', credits: 10, Component: KM08Module },
  ];

  const practicalModules = [
    { code: 'PM-01', title: 'Work Safely and Respond to Emergencies', credits: 6, Component: PM01Module },
    { code: 'PM-02', title: 'Use Tools and Equipment', credits: 20, Component: PM02Module },
    { code: 'PM-03', title: 'Cut and Join Metals', credits: 5, Component: PM03Module },
    { code: 'PM-04', title: 'Remove and Install Mechanical Components (Gaskets, Seals, Bearings and Locking Devices)', credits: 6, Component: PM04Module },
    { code: 'PM-05', title: 'Work with Auto-electric and Auto-electronic Components', credits: 2, Component: PM05Module },
    { code: 'PM-06', title: 'Work with Fluid Power Components', credits: 2, Component: PM06Module },
    { code: 'PM-07', title: 'Maintain and Service Vehicles and Vehicle Components', credits: 5, Component: PM07Module },
    { code: 'PM-08', title: 'Dismantle, Assess and Reassemble Engines and Engine Sub-assemblies', credits: 16, Component: PM08Module },
    { code: 'PM-09', title: 'Dismantle, Assess and Reassemble Cooling Systems', credits: 8, Component: PM09Module },
    { code: 'PM-10', title: 'Dismantle, Assess and Reassemble Brake Systems (including Hydraulic and Pneumatic Components)', credits: 5, Component: PM10Module },
    { code: 'PM-11', title: 'Dismantle, Assess and Reassemble Drive Train System Components', credits: 5, Component: PM11Module },
    { code: 'PM-12', title: 'Dismantle, Assess and Reassemble Steering and Suspension Systems (including Hydraulic and Pneumatic Components)', credits: 5, Component: PM12Module },
    { code: 'PM-13', title: 'Dismantle, Assess and Reassemble Basic Hydraulic Systems', credits: 5, Component: PM13Module },
    { code: 'PM-14', title: 'Remove, Test, Repair and Refit Engines and Vehicle Components', credits: 15, Component: PM14Module },
    { code: 'PM-15', title: 'Diagnose and Repair Vehicle Systems', credits: 30, Component: PM15Module },
    { code: 'PM-16', title: 'Diagnose and Repair Electrical Systems', credits: 12, Component: PM16Module },
    { code: 'PM-17', title: 'Diagnose and Repair Electronically Controlled Vehicle Systems', credits: 10, Component: PM17Module },
    { code: 'PM-18', title: 'Diagnose and Repair Air Conditioning System', credits: 5, Component: PM18Module },
  ];

  const workplaceModules = [
    { code: 'WM-01', title: 'Routine Scheduled Services', credits: 16, Component: WM01Module },
    { code: 'WM-02', title: 'Removal and Replacement of Engine Sub-system Components (including Batteries)', credits: 16, Component: WM02Module },
    { code: 'WM-03', title: 'Removal and Replacement of Other Vehicle Sub-system Components', credits: 20, Component: WM03Module },
    { code: 'WM-04', title: 'Engine Removal and Installation Processes', credits: 18, Component: WM04Module },
    { code: 'WM-05', title: 'Repair Processes for Vehicle Sub-systems', credits: 50, Component: WM05Module },
    { code: 'WM-06', title: 'Removal and Replacement of Cooling System', credits: 20, Component: WM06Module },
    { code: 'WM-07', title: 'Diagnosis and Repair of Electrical Systems (Charging, Starting, Lighting and Auxiliary)', credits: 18, Component: WM07Module },
    { code: 'WM-08', title: 'Diagnose and Repair Air Conditioning System', credits: 8, Component: WM08Module },
    { code: 'WM-09', title: 'Diagnosis and Repair of Electronic Control Systems', credits: 18, Component: WM09Module },
    { code: 'WM-10', title: 'Diagnosis and Repair of Engines and Engine Sub-systems', credits: 18, Component: WM10Module },
    { code: 'WM-11', title: 'Diagnosis and Repair of Hydraulic and Pneumatic Systems', credits: 18, Component: WM11Module },
    { code: 'WM-12', title: 'Diagnosis and Repair of Brake Systems', credits: 18, Component: WM12Module },
    { code: 'WM-13', title: 'Diagnosis and Repair of Drive Train Systems', credits: 18, Component: WM13Module },
    { code: 'WM-14', title: 'Diagnosis and Repair of Steering and Suspension Systems', credits: 18, Component: WM14Module },
  ];

  const allModules = [...knowledgeModules, ...practicalModules, ...workplaceModules];
  const activeEntry = activeModule ? allModules.find((item) => item.code === activeModule) : null;
  const ActiveComponent = activeEntry?.Component;

  const storageKeyFor = (code: string) => `diesel-${code.toLowerCase().replace('-', '')}-progress`;
  const progressFor = (code: string) => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKeyFor(code)) || '[]');
      return Array.isArray(value) ? value.length : 0;
    } catch {
      return 0;
    }
  };

  const startedCount = (items: typeof knowledgeModules) => items.filter((item) => progressFor(item.code) > 0).length;
  const completedModules = allModules.filter((item) => progressFor(item.code) > 0).length;
  const lastStarted = [...allModules].reverse().find((item) => progressFor(item.code) > 0) || knowledgeModules[0];

  const openSection = (next: typeof section) => {
    setSection(next);
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLearnGroup = (next: typeof learnGroup) => {
    setSection('learn');
    setLearnGroup(next);
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModule = (code: string) => {
    setActiveModule(code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sectionModules =
    learnGroup === 'knowledge' ? knowledgeModules :
    learnGroup === 'practical' ? practicalModules :
    workplaceModules;

  const workspaceAreas = [
    { label: ui.home, value: 'home' as const, Icon: Wrench },
    { label: ui.learn, value: 'learn' as const, Icon: BookOpen },
    { label: ui.ask, value: 'ask' as const, Icon: CheckCircle2 },
    { label: ui.tools, value: 'tools' as const, Icon: Calculator },
    { label: ui.reference, value: 'reference' as const, Icon: Languages },
    { label: ui.check, value: 'check' as const, Icon: ClipboardCheck },
  ];

  return (
    <div className="workshop-app">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-4 sm:px-6">
        <nav className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Student workspace">
          {workspaceAreas.map(({ label, value, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => openSection(value)}
              className={`flex min-h-12 items-center justify-center gap-2 border px-2 py-2 text-[.66rem] font-bold uppercase tracking-[.08em] ${section === value
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                : 'border-[hsl(var(--border))] bg-[rgba(255,255,255,.02)] text-[hsl(var(--muted-foreground))]'}`}
              aria-current={section === value ? 'page' : undefined}
            >
              <Icon size={15} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {activeEntry && ActiveComponent ? (
          <>
            <button type="button" onClick={() => setActiveModule(null)} className="mb-3 text-xs font-bold uppercase tracking-[.1em] text-[hsl(var(--primary))]">
              ← Back to Learn
            </button>
            <div className="mb-3 panel p-3">
              <div className="eyebrow">Current module</div>
              <div className="mt-1 break-words text-sm font-semibold text-[hsl(var(--foreground))]">{activeEntry.code} · {activeEntry.title} · {activeEntry.credits} credits</div>
            </div>
            <ActiveComponent />
          </>
        ) : section === 'home' ? (
          <section className="space-y-3">
            <div className="panel bracket-corner p-4 sm:p-5">
              <div className="eyebrow mb-2 flex items-center gap-2"><Wrench size={14} /> Mzansi Artisan · Diesel Mechanic</div>
              <h2 className="display-font text-[1.8rem] font-bold uppercase leading-none tracking-tight text-[hsl(var(--foreground))] sm:text-[2.3rem]">
                {ui.slogan}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
                SAQA 117237 · Curriculum 653306-000-01-00 · NQF 4 · 544 credits. {ui.chooseArea}
              </p>
            </div>
            <div className="border border-[rgba(234,96,83,.28)] bg-[rgba(234,96,83,.06)] px-4 py-3 text-xs leading-relaxed text-[hsl(var(--foreground))]">
              <strong>{ui.safety}:</strong> {current.safetyLead} {ui.practicalSupervision}
            </div>
          </section>
        ) : section === 'learn' ? (
          <>
            <section className="panel bracket-corner p-4">
              <div className="eyebrow mb-2">{ui.qualification}</div>
              <h2 className="section-heading">{ui.chooseKmPmWm}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                PWA learning support does not replace supervised practical competence, workplace experience or external assessment requirements.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  ['knowledge', 'KM', ui.knowledge, '8 modules · 108 credits'],
                  ['practical', 'PM', ui.practical, '18 modules · 162 credits'],
                  ['workplace', 'WM', ui.workplace, '14 modules · 274 credits'],
                ].map(([value, code, title, meta]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => openLearnGroup(value as typeof learnGroup)}
                    className={`min-w-0 border p-3 text-left ${learnGroup === value ? 'border-[hsl(var(--primary))] bg-[rgba(233,184,54,.07)]' : 'border-[hsl(var(--border))]'}`}
                  >
                    <div className="mono-font text-[.68rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{code}</div>
                    <div className="mt-1 break-words text-sm font-bold text-[hsl(var(--foreground))]">{title}</div>
                    <div className="mt-1 text-[.66rem] text-[hsl(var(--muted-foreground))]">{meta}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-4 grid gap-3 sm:grid-cols-2">
              {sectionModules.map((item) => {
                const progress = progressFor(item.code);
                return (
                  <button key={item.code} type="button" onClick={() => openModule(item.code)} className="panel min-w-0 p-4 text-left">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mono-font text-[.68rem] font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{item.code} · {item.credits} credits</div>
                        <div className="mt-1 break-words text-sm font-bold leading-snug text-[hsl(var(--foreground))]">{item.title}</div>
                      </div>
                      <ChevronDown size={17} className="-rotate-90 shrink-0 text-[hsl(var(--muted-foreground))]" />
                    </div>
                    <div className="mt-3 text-[.68rem] text-[hsl(var(--muted-foreground))]">
                      {progress > 0 ? `${progress} item(s) marked on this device` : ui.notStarted}
                    </div>
                  </button>
                );
              })}
            </section>
          </>
        ) : section === 'ask' ? (
          <>
            <section className="panel bracket-corner p-4">
              <div className="eyebrow mb-2">{ui.askFind}</div>
              <h2 className="section-heading">{ui.askTitle}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                {ui.askLead}
              </p>
            </section>
            <section className="mt-4"><TradeTerms language={language} onOpenCalculators={() => setIsCalculatorsOpen(true)} /></section>
          </>
        ) : section === 'tools' ? (
          <section className="panel bracket-corner p-4 sm:p-5">
            <div className="eyebrow mb-2">Tools</div>
            <h2 className="section-heading">{ui.toolsTitle}</h2>
            <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
              Classroom calculation support only. No calculator authorises hazardous workshop work or replaces approved specifications.
            </p>
            <button type="button" onClick={() => setIsCalculatorsOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 border border-[hsl(var(--primary))] bg-[rgba(233,184,54,.08)] px-4 py-3 text-sm font-bold uppercase tracking-[.08em] text-[hsl(var(--primary))]">
              <Calculator size={18} /> {ui.openCalculators}
            </button>
          </section>
        ) : section === 'reference' ? (
          <>
            <section className="panel bracket-corner p-4 sm:p-5">
              <div className="eyebrow mb-2">Reference</div>
              <h2 className="section-heading">{ui.referenceTitle}</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => setIsVideoOpen(true)} className="border border-[hsl(var(--border))] p-3 text-left">
                  <BookOpen size={18} className="text-[hsl(var(--primary))]" />
                  <div className="mt-2 font-bold">{ui.visualLibrary}</div>
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Controlled online concept resources; written learning stays offline.</div>
                </button>
                <button type="button" onClick={() => openSection('ask')} className="border border-[hsl(var(--border))] p-3 text-left">
                  <Languages size={18} className="text-[hsl(var(--primary))]" />
                  <div className="mt-2 font-bold">{ui.terminology}</div>
                  <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Open the existing local terminology search under Ask.</div>
                </button>
              </div>
            </section>
            <section className="mt-4"><SafetyPanel language={language} /></section>
          </>
        ) : (
          <>
            <section className="panel bracket-corner p-4 sm:p-5">
              <div className="eyebrow mb-2">Check</div>
              <h2 className="section-heading">{ui.checkTitle}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                Existing learning checks remain inside their verified modules. Progress is stored locally on this browser/device; no learner account is required.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="border border-[hsl(var(--border))] p-3 text-center">
                  <div className="text-xl font-bold text-[hsl(var(--primary))]">{startedCount(knowledgeModules)}/8</div>
                  <div className="mt-1 text-[.62rem] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">KM started</div>
                </div>
                <div className="border border-[hsl(var(--border))] p-3 text-center">
                  <div className="text-xl font-bold text-[hsl(var(--primary))]">{startedCount(practicalModules as typeof knowledgeModules)}/18</div>
                  <div className="mt-1 text-[.62rem] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">PM started</div>
                </div>
                <div className="border border-[hsl(var(--border))] p-3 text-center">
                  <div className="text-xl font-bold text-[hsl(var(--primary))]">{startedCount(workplaceModules as typeof knowledgeModules)}/14</div>
                  <div className="mt-1 text-[.62rem] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">WM started</div>
                </div>
              </div>
              <div className="mt-4 border border-[hsl(var(--border))] p-3 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                <strong className="text-[hsl(var(--foreground))]">Continue:</strong> {lastStarted.code} · {lastStarted.title}. {progressFor(lastStarted.code) > 0 ? `${progressFor(lastStarted.code)} item(s) already marked.` : 'No local progress marked yet.'}
              </div>
              <button type="button" onClick={() => { setSection('learn'); setLearnGroup(lastStarted.code.startsWith('KM') ? 'knowledge' : lastStarted.code.startsWith('PM') ? 'practical' : 'workplace'); setActiveModule(lastStarted.code); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-3 w-full border border-[hsl(var(--primary))] px-4 py-3 text-sm font-bold uppercase tracking-[.08em] text-[hsl(var(--primary))]">
                Open current learning check
              </button>
              <div className="mt-3 text-[.65rem] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Modules started on this device: {completedModules}/40</div>
            </section>
          </>
        )}

        <footer className="mt-8 border-t border-[hsl(var(--border))] pt-4 text-[.65rem] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
          Diesel Mechanic · SAQA 117237 · {ui.footer}
        </footer>
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