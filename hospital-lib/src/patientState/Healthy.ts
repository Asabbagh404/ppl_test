import { PatientState } from "../types"
import { Fever } from "./Fever"

export class Healthy implements PatientState {
  public get patientStateString(): string {
    return "H";
  }

  public applyDrugs(drugs: Set<string>): PatientState {
    if (drugs.has("An") && drugs.has("I")) return new Fever();
    return this;
  }
}
