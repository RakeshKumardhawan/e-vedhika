import ubd10209 from "./ubd_10209.json";
import ubd10209Death from "./ubd_10209_death.json";
import ubd10001 from "./ubd_10001.json";
import ubd10262 from "./ubd_10262.json";
import ubd10425 from "./ubd_10425.json";
import ubd20001 from "./ubd_20001.json";

export interface UbdRecord {
  sno: string;
  regNo: string;
  regYear: string;
  regDate: string;
  dob?: string;
  dod?: string;
  gender: string;
  childName?: string;
  deceasedName?: string;
  motherName?: string;
  relativeName?: string;
  fatherName?: string;
}

export const UBD_REAL_RECORDS: Record<string, { gpName: string; district: string; mandal: string; birth: UbdRecord[]; death?: UbdRecord[] }> = {
  "10209": {
    gpName: "Bheemini",
    district: "MANCHERIAL",
    mandal: "Bheemini",
    birth: ubd10209 as UbdRecord[],
    death: ubd10209Death as UbdRecord[]
  },
  "10001": {
    gpName: "Alladurg",
    district: "MEDAK",
    mandal: "Alladurg",
    birth: ubd10001 as UbdRecord[]
  },
  "10262": {
    gpName: "Addakal",
    district: "MAHABUBNAGAR",
    mandal: "Addakal",
    birth: ubd10262 as UbdRecord[]
  },
  "10425": {
    gpName: "Adavi Devulapally",
    district: "NALGONDA",
    mandal: "Adavidevulapally",
    birth: ubd10425 as UbdRecord[]
  },
  "20001": {
    gpName: "Allikori",
    district: "ADILABAD",
    mandal: "Adilabad",
    birth: ubd20001 as UbdRecord[]
  }
};
