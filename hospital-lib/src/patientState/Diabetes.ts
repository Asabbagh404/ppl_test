import { PatientState } from "../types"
import { Dead } from "./Dead"

export class Diabetes implements PatientState {
  public get patientStateString(): string {
    return "D";
  }

  public applyDrugs(drugs: Set<string>): PatientState {
    if (!drugs.has("I")) return new Dead();
    return this;
  }
}
