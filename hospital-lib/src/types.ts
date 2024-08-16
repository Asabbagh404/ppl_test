
export abstract class PatientState {
  public abstract get patientStateString(): string;
  public abstract applyDrugs(drugs: Set<string>): PatientState;
}