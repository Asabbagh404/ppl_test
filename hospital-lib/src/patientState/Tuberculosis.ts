import { PatientState } from "../types"
import { Healthy } from "./Healthy";

export class Tuberculosis implements PatientState {
  public get patientStateString(): string {
    return "T";
  }

  public applyDrugs(drugs: Set<string>): PatientState {
    if (drugs.has("An")) return new Healthy();
    return this;
  }
}
