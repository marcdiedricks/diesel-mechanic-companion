import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Gauge,
  Ruler,
  X,
} from 'lucide-react';
import {
  calculateBoostPressureRatio,
  calculateBrakePower,
  calculateDieselCompression,
  calculateHydraulicThrust,
  type CalculationResult,
} from '@/engines/calculations/dieselMechanic';

type CalculatorId = 'compression' | 'brake-power' | 'hydraulic' | 'boost';

type FieldConfig = {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
  step: string;
  min: string;
};

type CalculatorConfig = {
  id: CalculatorId;
  number: string;
  label: string;
  description: string;
  fields: FieldConfig[];
};

type InputValues = Record<CalculatorId, Record<string, string>>;

const calculatorConfigs: CalculatorConfig[] = [
  {
    id: 'compression',
    number: '01',
    label: 'Diesel Compression Ratio',
    description:
      'Estimate the static compression ratio for a heavy direct-injection diesel engine.',
    fields: [
      {
        key: 'sweptVolumeCc',
        label: 'Swept Volume',
        unit: 'cc',
        placeholder: '1000',
        step: '1',
        min: '0',
      },
      {
        key: 'clearanceVolumeCc',
        label: 'Clearance Volume',
        unit: 'cc',
        placeholder: '60',
        step: '1',
        min: '0',
      },
    ],
  },
  {
    id: 'brake-power',
    number: '02',
    label: 'Brake Power Output (kW)',
    description:
      'Convert measured engine speed and torque into brake power at the crankshaft.',
    fields: [
      {
        key: 'rpm',
        label: 'Engine RPM',
        unit: 'RPM',
        placeholder: '1500',
        step: '1',
        min: '0',
      },
      {
        key: 'torqueNm',
        label: 'Torque',
        unit: 'N.m',
        placeholder: '1000',
        step: '1',
        min: '0',
      },
    ],
  },
  {
    id: 'hydraulic',
    number: '03',
    label: 'Hydraulic Ram Thrust (kN)',
    description:
      'Calculate piston thrust and the direct vertical lifting capacity of a hydraulic ram.',
    fields: [
      {
        key: 'pressureBar',
        label: 'Hydraulic Pressure',
        unit: 'bar',
        placeholder: '250',
        step: '1',
        min: '0',
      },
      {
        key: 'pistonBoreMm',
        label: 'Piston Bore',
        unit: 'mm',
        placeholder: '100',
        step: '1',
        min: '0',
      },
    ],
  },
  {
    id: 'boost',
    number: '04',
    label: 'Turbo Boost Pressure Ratio',
    description:
      'Convert gauge boost to absolute manifold pressure and compressor pressure ratio.',
    fields: [
      {
        key: 'boostGaugeBar',
        label: 'Gauge Boost',
        unit: 'bar',
        placeholder: '1.5',
        step: '0.01',
        min: '0',
      },
      {
        key: 'atmosphericPressureBar',
        label: 'Atmospheric Pressure',
        unit: 'bar',
        placeholder: '1.013',
        step: '0.001',
        min: '0',
      },
    ],
  },
];

const defaultValues: InputValues = {
  compression: {
    sweptVolumeCc: '1000',
    clearanceVolumeCc: '60',
  },
  'brake-power': {
    rpm: '1500',
    torqueNm: '1000',
  },
  hydraulic: {
    pressureBar: '250',
    pistonBoreMm: '100',
  },
  boost: {
    boostGaugeBar: '1.5',
    atmosphericPressureBar: '1.013',
  },
};

function getCalculation(
  calculatorId: CalculatorId,
  values: Record<string, string>,
): CalculationResult | null {
  const numericValues = Object.values(values).map(Number);
  if (
    numericValues.some((value) => !Number.isFinite(value)) ||
    Object.values(values).some((value) => value.trim() === '')
  ) {
    return null;
  }

  switch (calculatorId) {
    case 'compression':
      return calculateDieselCompression(
        Number(values.sweptVolumeCc),
        Number(values.clearanceVolumeCc),
      );
    case 'brake-power':
      return calculateBrakePower(Number(values.rpm), Number(values.torqueNm));
    case 'hydraulic':
      return calculateHydraulicThrust(
        Number(values.pressureBar),
        Number(values.pistonBoreMm),
      );
    case 'boost':
      return calculateBoostPressureRatio(
        Number(values.boostGaugeBar),
        Number(values.atmosphericPressureBar),
      );
  }
}

function getInputError(
  calculatorId: CalculatorId,
  values: Record<string, string>,
): string | undefined {
  const numbers = Object.values(values).map(Number);
  if (Object.values(values).some((value) => value.trim() === '')) {
    return 'Enter all measurements to calculate.';
  }
  if (numbers.some((value) => !Number.isFinite(value))) {
    return 'Use numeric measurements only.';
  }
  if (calculatorId === 'boost' && Number(values.boostGaugeBar) < 0) {
    return 'Gauge boost cannot be below zero.';
  }
  if (
    calculatorId !== 'boost' &&
    numbers.some((value) => value <= 0)
  ) {
    return 'All measurements must be greater than zero.';
  }
  if (calculatorId === 'boost' && Number(values.atmosphericPressureBar) <= 0) {
    return 'Atmospheric pressure must be greater than zero.';
  }
  return undefined;
}

function ResultPanel({
  result,
  error,
}: {
  result: CalculationResult | null;
  error?: string;
}) {
  if (error || !result) {
    return (
      <div
        className="flex min-h-40 flex-col items-center justify-center border border-dashed border-[hsl(var(--border))] bg-[rgba(0,0,0,.12)] p-5 text-center"
        data-testid="calculator-result-empty"
      >
        <Calculator
          size={23}
          className="mb-3 text-[hsl(var(--muted-foreground))]"
        />
        <p className="max-w-sm text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          {error ?? 'Enter measurements to calculate a workshop result.'}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[rgba(233,184,54,.35)] bg-[rgba(233,184,54,.06)] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">calculated result</div>
          <div
            className="metric-value text-[hsl(var(--primary))]"
            data-testid="calculator-result-value"
          >
            {result.value} {result.unit}
          </div>
        </div>
        <CheckCircle2
          size={23}
          className="mt-1 text-[hsl(var(--chart-3))]"
        />
      </div>
      <div className="border-t border-[rgba(233,184,54,.18)] pt-4">
        <div className="mono-font mb-2 text-[.63rem] font-semibold uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">
          working out
        </div>
        <ol className="space-y-2">
          {result.steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 text-xs leading-relaxed text-[hsl(var(--foreground))]"
              data-testid={`calculator-step-${index + 1}`}
            >
              <span className="mono-font shrink-0 text-[hsl(var(--primary))]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      {result.warning && (
        <div
          className="mt-4 flex gap-3 border-l-2 border-[hsl(var(--destructive))] bg-[rgba(234,96,83,.1)] p-3 text-xs leading-relaxed text-[hsl(var(--foreground))]"
          role="alert"
          data-testid="calculator-safety-warning"
        >
          <AlertTriangle
            size={17}
            className="mt-0.5 shrink-0 text-[hsl(var(--destructive))]"
          />
          <span>{result.warning}</span>
        </div>
      )}
    </div>
  );
}

export function TradeCalculators({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<CalculatorId>('compression');
  const [values, setValues] = useState<InputValues>(defaultValues);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const activeConfig =
    calculatorConfigs.find((config) => config.id === selected) ??
    calculatorConfigs[0];
  const activeValues = values[selected];
  const error = useMemo(
    () => getInputError(selected, activeValues),
    [activeValues, selected],
  );
  const result = useMemo(
    () => (error ? null : getCalculation(selected, activeValues)),
    [activeValues, error, selected],
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal-card panel bracket-corner bg-[hsl(var(--card))] p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-calculators-heading"
        data-testid="modal-trade-calculators"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow mb-2 flex items-center gap-2">
              <Calculator size={14} /> field calculations / local only
            </div>
            <h2 id="trade-calculators-heading" className="section-heading">
              Workshop calculators
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
              Use measured values from the vehicle or test bench. Results are
              educational references—confirm OEM specifications before service.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] transition hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
            aria-label="Close workshop calculators"
            data-testid="button-close-trade-calculators"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="mb-5 flex gap-1 overflow-x-auto border-b border-[hsl(var(--border))] pb-1 scrollbar-thin"
          role="tablist"
          aria-label="Workshop calculator types"
        >
          {calculatorConfigs.map((config) => (
            <button
              type="button"
              key={config.id}
              onClick={() => setSelected(config.id)}
              className={`flex min-w-max items-center gap-2 border-b-2 px-3 py-3 text-left text-[.68rem] font-bold uppercase tracking-[.08em] transition ${
                selected === config.id
                  ? 'border-[hsl(var(--primary))] bg-[rgba(233,184,54,.1)] text-[hsl(var(--primary))]'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:bg-[rgba(255,255,255,.04)] hover:text-[hsl(var(--foreground))]'
              }`}
              role="tab"
              aria-selected={selected === config.id}
              aria-controls={`calculator-panel-${config.id}`}
              data-testid={`tab-calculator-${config.id}`}
            >
              <span className="mono-font text-[.62rem]">{config.number}</span>
              <span className="sm:hidden">
                {config.id === 'compression'
                  ? 'Compression'
                  : config.id === 'brake-power'
                    ? 'Brake power'
                    : config.id === 'hydraulic'
                      ? 'Hydraulic'
                      : 'Turbo boost'}
              </span>
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          ))}
        </div>

        <div
          id={`calculator-panel-${activeConfig.id}`}
          role="tabpanel"
          aria-labelledby={`tab-calculator-${activeConfig.id}`}
        >
          <div className="mb-5 flex items-start gap-3">
            {activeConfig.id === 'compression' ? (
              <Ruler
                size={22}
                className="mt-0.5 shrink-0 text-[hsl(var(--primary))]"
              />
            ) : (
              <Gauge
                size={22}
                className="mt-0.5 shrink-0 text-[hsl(var(--accent))]"
              />
            )}
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[hsl(var(--foreground))]">
                {activeConfig.label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
                {activeConfig.description}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,.86fr)_minmax(0,1.14fr)]">
            <div className="space-y-3">
              <div className="eyebrow mb-3">enter measurements</div>
              {activeConfig.fields.map((field) => (
                <label
                  className="block"
                  htmlFor={`calculator-${activeConfig.id}-${field.key}`}
                  key={field.key}
                >
                  <span className="mb-1.5 flex items-center justify-between gap-3 text-[.68rem] font-bold uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">
                    <span>{field.label}</span>
                    <span className="mono-font font-normal normal-case tracking-normal text-[hsl(var(--primary))]">
                      {field.unit}
                    </span>
                  </span>
                  <input
                    id={`calculator-${activeConfig.id}-${field.key}`}
                    className="input-field"
                    type="number"
                    inputMode="decimal"
                    min={field.min}
                    step={field.step}
                    value={activeValues[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [selected]: {
                          ...current[selected],
                          [field.key]: event.target.value,
                        },
                      }))
                    }
                    aria-label={`${field.label} in ${field.unit}`}
                    data-testid={`input-calculator-${field.key}`}
                  />
                </label>
              ))}
              {selected === 'boost' && (
                <p className="flex gap-2 pt-1 text-[.68rem] leading-relaxed text-[hsl(var(--muted-foreground))]">
                  <Gauge size={14} className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" />
                  Default sea-level atmospheric pressure is 1.013 bar.
                </p>
              )}
            </div>
            <ResultPanel result={result} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
}