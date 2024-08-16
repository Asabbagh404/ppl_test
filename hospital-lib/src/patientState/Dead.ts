import { PatientState } from "../types"

export class Dead implements PatientState {
  public get patientStateString(): string {
    return "X";
  }

  public applyDrugs(drugs: Set<string>): PatientState {
    return this;
  }
}
