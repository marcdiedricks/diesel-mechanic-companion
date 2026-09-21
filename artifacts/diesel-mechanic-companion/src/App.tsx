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