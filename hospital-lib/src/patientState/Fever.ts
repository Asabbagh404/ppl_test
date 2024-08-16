import { PatientState } from "../types";
import { Dead } from "./Dead";
import { Healthy } from "./Healthy";

export class Fever implements PatientState {
  public get patientStateString(): string {
    return "F";
  }

  public applyDrugs(drugs: Set<string>): PatientState {
    if (drugs.has("As") && drugs.has("P")) return new Dead();
    if (drugs.has("P") || drugs.has("As")) return new Healthy();
    return this;
  }
}
