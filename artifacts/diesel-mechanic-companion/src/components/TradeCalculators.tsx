import { useEffect, useMemo, useState } from 'react';
import { Calculator, X } from 'lucide-react';

type CalculatorId = 'compression' | 'brake-power';

type Values = {
  compression: { sweptVolumeCc: string; clearanceVolumeCc: string };
  'brake-power': { rpm: string; torqueNm: string };
};

const defaults: Values = {
  compression: { sweptVolumeCc: '1000', clearanceVolumeCc: '60' },
  'brake-power': { rpm: '1500', torqueNm: '1000' },
};

export function TradeCalculators({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<CalculatorId>('compression');
  const [values, setValues] = useState<Values>(defaults);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const result = useMemo(() => {
    if (selected === 'compression') {
      const swept = Number(values.compression.sweptVolumeCc);
      const clearance = Number(values.compression.clearanceVolumeCc);
      if (!(swept > 0) || !(clearance > 0)) return null;
      return { label: 'Compression ratio', value: ((swept + clearance) / clearance).toFixed(2) + ':1', formula: '(swept volume + clearance volume) ÷ clearance volume' };
    }
    const rpm = Number(values['brake-power'].rpm);
    const torque = Number(values['brake-power'].torqueNm);
    if (!(rpm > 0) || !(torque > 0)) return null;
    return { label: 'Theoretical brake power', value: ((2 * Math.PI * rpm * torque) / 60000).toFixed(1) + ' kW', formula: '2π × speed × torque ÷ 60,000' };
  }, [selected, values]);

  if (!isOpen) return null;

  const update = (key: string, value: string) => {
    setValues(current => ({
      ...current,
      [selected]: { ...current[selected], [key]: value },
    } as Values));
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-card panel bracket-corner bg-[hsl(var(--card))] p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="trade-calculators-heading">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow mb-2 flex items-center gap-2"><Calculator size={14}/> classroom theory / offline</div>
            <h2 id="trade-calculators-heading" className="section-heading">Theory calculations</h2>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Formula practice only. These calculations are not workshop specifications, diagnostic limits, lifting guidance, pressure guidance or permission to test or repair a vehicle.</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center border border-[hsl(var(--border))]" aria-label="Close theory calculations"><X size={18}/></button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setSelected('compression')} className={"border p-3 text-xs font-bold uppercase tracking-wide " + (selected === 'compression' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]')}>Compression-ratio formula</button>
          <button type="button" onClick={() => setSelected('brake-power')} className={"border p-3 text-xs font-bold uppercase tracking-wide " + (selected === 'brake-power' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]')}>Power formula</button>
        </div>

        {selected === 'compression' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">Swept volume (cc)<input className="input-field mt-1" type="number" min="0" value={values.compression.sweptVolumeCc} onChange={e => update('sweptVolumeCc', e.target.value)}/></label>
            <label className="text-xs">Clearance volume (cc)<input className="input-field mt-1" type="number" min="0" value={values.compression.clearanceVolumeCc} onChange={e => update('clearanceVolumeCc', e.target.value)}/></label>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">Engine speed (RPM)<input className="input-field mt-1" type="number" min="0" value={values['brake-power'].rpm} onChange={e => update('rpm', e.target.value)}/></label>
            <label className="text-xs">Torque (N·m)<input className="input-field mt-1" type="number" min="0" value={values['brake-power'].torqueNm} onChange={e => update('torqueNm', e.target.value)}/></label>
          </div>
        )}

        <div className="mt-5 border border-[hsl(var(--border))] p-4">
          <div className="mono-font text-[.65rem] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">{result?.label ?? 'Enter positive classroom values'}</div>
          <div className="metric-value mt-2 text-[hsl(var(--primary))]">{result?.value ?? '—'}</div>
          {result && <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">Formula: {result.formula}</p>}
        </div>
      </div>
    </div>
  );
}
