export interface CalculationResult {
  value: number;
  unit: string;
  steps: string[];
  warning?: string;
}

export const PNEUMATIC_AIR_BRAKE_GOVERNOR_PRESSURE_LIMITS = {
  cutIn: {
    minBar: 6.5,
    maxBar: 7.0,
    minKpa: 650,
    maxKpa: 700,
  },
  cutOut: {
    minBar: 8.1,
    maxBar: 8.5,
    minKpa: 810,
    maxKpa: 850,
  },
} as const;

export const HPCR_FUEL_INJECTION_TEST_WARNING =
  'HPCR SAFETY WARNING: Fuel under pressure above 1,600 bar is a fluid-injection hazard that can penetrate skin and cause fatal injury. Never use hands or cardboard to find leaks; isolate and depressurize before opening the system.';

export function getHpcrFuelInjectionTestWarning(
  testPressureBar: number,
): string | undefined {
  if (!Number.isFinite(testPressureBar) || testPressureBar < 0) {
    throw new Error('Fuel injection test pressure must be zero or greater.');
  }

  return testPressureBar > 1600
    ? `${HPCR_FUEL_INJECTION_TEST_WARNING} Test pressure: ${testPressureBar.toFixed(0)} bar.`
    : undefined;
}

/**
 * 1. Heavy Diesel Compression Ratio (CR)
 * Formula: CR = (Vs + Vc) / Vc
 * Standard: Heavy DI diesel engines operate between 16:1 and 22:1
 */
export function calculateDieselCompression(
  sweptVolumeCc: number,
  clearanceVolumeCc: number,
): CalculationResult {
  if (sweptVolumeCc <= 0 || clearanceVolumeCc <= 0) {
    throw new Error('Swept and clearance volumes must be greater than zero.');
  }

  const cr = (sweptVolumeCc + clearanceVolumeCc) / clearanceVolumeCc;

  const steps = [
    'Formula: CR = (Vs + Vc) / Vc',
    `Swept Volume (Vs) = ${sweptVolumeCc} cc, Clearance Volume (Vc) = ${clearanceVolumeCc} cc`,
    `Substitute values: (${sweptVolumeCc} + ${clearanceVolumeCc}) / ${clearanceVolumeCc}`,
    `Calculated Compression Ratio: ${cr.toFixed(2)} : 1`,
  ];

  let warning: string | undefined;
  if (cr < 15.0) {
    warning =
      'Diagnostic Alert: Compression ratio is below 15:1. High risk of poor cold start, white smoke, and incomplete combustion in direct-injection diesels. Inspect piston rings and valve seats.';
  } else if (cr > 23.0) {
    warning =
      'Extreme Peak Pressure Alert: Compression ratio exceeds 23:1. Check cylinder head skim limits and head gasket thickness selection.';
  }

  return {
    value: Number(cr.toFixed(2)),
    unit: ': 1',
    steps,
    warning,
  };
}

/**
 * 2. Brake Power Output (Pb)
 * Formula: Pb (kW) = (2 * pi * N * T) / 60000
 */
export function calculateBrakePower(
  rpm: number,
  torqueNm: number,
): CalculationResult {
  if (rpm <= 0 || torqueNm <= 0) {
    throw new Error('RPM and torque must be greater than zero.');
  }

  const powerKw = (2 * Math.PI * rpm * torqueNm) / 60000;
  const powerHp = powerKw * 1.34102;

  const steps = [
    'Formula: Pb (kW) = (2 * pi * N * Torque) / 60000',
    `Engine Speed (N) = ${rpm} RPM, Torque (T) = ${torqueNm} N.m`,
    `Substitute values: (2 * pi * ${rpm} * ${torqueNm}) / 60000`,
    `Brake Power Output: ${powerKw.toFixed(1)} kW (${powerHp.toFixed(1)} HP)`,
  ];

  return {
    value: Number(powerKw.toFixed(1)),
    unit: 'kW',
    steps,
  };
}

/**
 * 3. Hydraulic Cylinder / Ram Thrust Force (F)
 * Formula: F (kN) = (Pressure (bar) * Area (cm²)) / 100
 */
export function calculateHydraulicThrust(
  pressureBar: number,
  pistonBoreMm: number,
): CalculationResult {
  if (pressureBar <= 0 || pistonBoreMm <= 0) {
    throw new Error(
      'Hydraulic pressure and piston bore must be greater than zero.',
    );
  }

  const areaCm2 = (Math.PI * Math.pow(pistonBoreMm / 10, 2)) / 4;
  const forceKn = (pressureBar * areaCm2) / 100;
  const liftingTonnes = forceKn / 9.81;

  const steps = [
    'Formula: Force = Pressure * Effective Piston Area',
    `Pressure = ${pressureBar} bar, Piston Bore = ${pistonBoreMm} mm (Piston Area = ${areaCm2.toFixed(2)} cm²)`,
    `Calculated Thrust Force: ${forceKn.toFixed(2)} kN`,
    `Direct Vertical Lifting Capacity: ${liftingTonnes.toFixed(2)} Tonnes`,
  ];

  let warning: string | undefined;
  if (pressureBar > 350) {
    warning =
      'High Pressure Safety Gate: Circuit operating above 350 bar. Verify heavy hydraulic hose burst ratings and relief valve cracking pressure.';
  }

  return {
    value: Number(forceKn.toFixed(2)),
    unit: 'kN',
    steps,
    warning,
  };
}

/**
 * 4. Turbocharger Boost Pressure Absolute & Pressure Ratio (PR)
 * Formula: PR = (Gauge Boost + Atmospheric Pressure) / Atmospheric Pressure
 */
export function calculateBoostPressureRatio(
  boostGaugeBar: number,
  atmosphericPressureBar: number = 1.013,
): CalculationResult {
  if (boostGaugeBar < 0 || atmosphericPressureBar <= 0) {
    throw new Error('Boost pressure and atmospheric pressure must be positive.');
  }

  const absolutePressure = boostGaugeBar + atmosphericPressureBar;
  const pressureRatio = absolutePressure / atmosphericPressureBar;

  const steps = [
    'Formula: PR = (Gauge Boost + P_atm) / P_atm',
    `Gauge Boost = ${boostGaugeBar} bar, Ambient Atmospheric (P_atm) = ${atmosphericPressureBar} bar`,
    `Absolute Manifold Pressure (MAP): ${absolutePressure.toFixed(2)} bar`,
    `Turbo Compressor Pressure Ratio: ${pressureRatio.toFixed(2)} : 1`,
  ];

  return {
    value: Number(pressureRatio.toFixed(2)),
    unit: ': 1',
    steps,
  };
}