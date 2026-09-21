export interface CalculationResult {
  value: number;
  unit: string;
  steps: string[];
}

/**
 * Classroom theory formula only.
 * Compression ratio = (swept volume + clearance volume) / clearance volume.
 * This is not an OEM specification, diagnostic limit or repair instruction.
 */
export function calculateDieselCompression(
  sweptVolumeCc: number,
  clearanceVolumeCc: number,
): CalculationResult {
  if (sweptVolumeCc <= 0 || clearanceVolumeCc <= 0) {
    throw new Error('Swept and clearance volumes must be greater than zero.');
  }

  const ratio = (sweptVolumeCc + clearanceVolumeCc) / clearanceVolumeCc;

  return {
    value: Number(ratio.toFixed(2)),
    unit: ': 1',
    steps: [
      'Classroom formula: (swept volume + clearance volume) ÷ clearance volume',
      'Use only for theory and calculation practice.',
      'Do not use this result as a workshop limit, diagnostic decision or repair specification.',
    ],
  };
}

/**
 * Classroom theory formula only.
 * Brake power (kW) = (2 × pi × RPM × torque) / 60000.
 * This is not a test procedure or return-to-service criterion.
 */
export function calculateBrakePower(
  rpm: number,
  torqueNm: number,
): CalculationResult {
  if (rpm <= 0 || torqueNm <= 0) {
    throw new Error('RPM and torque must be greater than zero.');
  }

  const powerKw = (2 * Math.PI * rpm * torqueNm) / 60000;

  return {
    value: Number(powerKw.toFixed(1)),
    unit: 'kW',
    steps: [
      'Classroom formula: (2 × pi × RPM × torque) ÷ 60000',
      'Use only for theory and calculation practice.',
      'Do not use this result as a workshop test instruction or vehicle approval criterion.',
    ],
  };
}
