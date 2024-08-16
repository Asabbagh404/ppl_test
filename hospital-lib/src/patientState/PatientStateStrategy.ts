import { PatientState } from "../types";
import { Dead } from "./Dead";
import { Diabetes } from "./Diabetes";
import { Fever } from "./Fever";
import { Healthy } from "./Healthy";
import { Tuberculosis } from "./Tuberculosis";

export class PatientStateStrategy {
  private stringToState: Record<string, new () => PatientState> = {
    H: Healthy,
    F: Fever,
    D: Diabetes,
    T: Tuberculosis,
    X: Dead
  };

  public currentState: PatientState;

  constructor(private stringState: string) {
    const StateClass = this.stringToState[stringState];
    if (StateClass) {
      this.currentState = new StateClass();
    } else {
      throw new Error(`Invalid state: ${stringState}`);
    }
  }

  public applyDrugs(drugs: Set<string>): PatientState {
    if (drugs.has("As") && drugs.has("P")) {
      return new Dead();
    }
    return this.currentState.applyDrugs(drugs);
  }
}
