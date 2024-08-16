export const patientStateSymbolMapper = {
  F: "Fever",
  X: "Dead",
  H: "Healthy",
  D: "Diabetes",
  T: "Tuberculosis"
};

export const drugsSymbolMapper = {
  As: "Aspirin",
  An: "Antibiotic",
  I: "Insulin",
  P: "Paracetamol"
};

export const allDrugs = Object.keys(drugsSymbolMapper);
