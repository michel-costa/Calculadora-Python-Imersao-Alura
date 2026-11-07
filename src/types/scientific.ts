export type ScientificCategory = 'trigonometria' | 'potencias_raizes' | 'logaritmos' | 'teoria_numeros' | 'fisica_ondas';

export type Model3DType = 'onda' | 'torus' | 'vetor' | 'calculadora';

export interface ScientificOperation {
  id: string;
  name: string;
  symbol: string;
  category: ScientificCategory;
  description: string;
  formula: string;
  paramNames: string[];
  paramDefaults: number[];
  paramUnits?: string[];
  paramDescriptions: string[];
  domainRules: string[];
  compute: (params: number[]) => {
    result: number | string;
    steps: string[];
    gccdValidation: {
      governancePassed: boolean;
      governanceNotes: string;
      verificationPassed: boolean;
      verificationNotes: string;
      scientificConfidence: string;
    };
    model3DParams: {
      amplitude: number;
      frequency: number;
      phase: number;
      radialScale: number;
      colorHint: string;
    };
  };
  pythonEquivalent: string;
}

export interface GccdStep {
  letter: 'G' | 'C1' | 'C2' | 'D';
  name: string;
  title: string;
  description: string;
  actionSummary: string;
  pythonHook: string;
  status: 'pending' | 'success' | 'warning' | 'error';
}
