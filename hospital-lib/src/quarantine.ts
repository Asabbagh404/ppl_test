import { PatientsRegister } from "./patientsRegister";
import { PatientStateStrategy } from "./patientState/PatientStateStrategy";

export class Quarantine {
  private drugs = new Set<string>();
  private patients: PatientsRegister;

  constructor(patients: PatientsRegister) {
    this.patients = patients;
  }

  public setDrugs(drugs: Array<string>): void {
    this.drugs = new Set<string>(drugs);
  }

  public wait40Days(): Quarantine {
    let diseasesReport: Record<string, number> = Object.keys(this.patients).reduce(
      (acc: Record<string, number>, key) => {
        acc[key] = 0;
        return acc;
      },
      {}
    );
    for (const patientDisease in this.patients) {
      const numberOfPatients = this.patients[patientDisease];
      const patientStateStrategy = new PatientStateStrategy(patientDisease);
      const newPatients = patientStateStrategy.applyDrugs(this.drugs);
      diseasesReport[newPatients.patientStateString] += numberOfPatients;
    }
    this.patients = diseasesReport;
    return this;
  }

  public report(): PatientsRegister {
    return this.patients;
  }
}
