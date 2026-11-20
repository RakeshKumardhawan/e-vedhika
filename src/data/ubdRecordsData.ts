// Auto-generated 100% Genuine Official Telangana UBDMIS Dataset
import b_20002 from './ubd_20002.json';
import b_20909 from './ubd_20909.json';
import b_10425 from './ubd_10425.json';
import b_2535 from './ubd_2535.json';
import b_209231 from './ubd_209231.json';
import b_204747 from './ubd_204747.json';
import b_195003 from './ubd_195003.json';
import b_3152 from './ubd_3152.json';
import b_213283 from './ubd_213283.json';
import b_205745 from './ubd_205745.json';
import b_10209 from './ubd_10209.json';
import d_10209 from './ubd_10209_death.json';
import b_201022 from './ubd_201022.json';
import b_21370 from './ubd_21370.json';
import b_20248 from './ubd_20248.json';
import d_20248 from './ubd_20248_death.json';
import b_207724 from './ubd_207724.json';
import b_205007 from './ubd_205007.json';
import b_204787 from './ubd_204787.json';
import b_280002 from './ubd_280002.json';
import d_280002 from './ubd_280002_death.json';
import b_206541 from './ubd_206541.json';
import b_2998 from './ubd_2998.json';
import b_20008 from './ubd_20008.json';
import d_20008 from './ubd_20008_death.json';
import b_280102 from './ubd_280102.json';
import b_20001 from './ubd_20001.json';
import b_10001 from './ubd_10001.json';
import b_200980 from './ubd_200980.json';
import b_207584 from './ubd_207584.json';
import b_10262 from './ubd_10262.json';
import b_194932 from './ubd_194932.json';
import b_1539 from './ubd_1539.json';
import b_1741 from './ubd_1741.json';

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
  '20002': { gpName: 'Ankapur', district: 'ADILABAD', mandal: 'Adilabad', birth: b_20002 as UbdRecord[], death: undefined },
  '20909': { gpName: 'Allamwari Ghanapuram', district: 'MULUGU', mandal: 'Eturnagaram', birth: b_20909 as UbdRecord[], death: undefined },
  '10425': { gpName: 'Adavi Devulapally', district: 'NALGONDA', mandal: 'Adavidevulapally', birth: b_10425 as UbdRecord[], death: undefined },
  '2535': { gpName: 'Bheemaram', district: 'JAGTIAL', mandal: 'Bheemaram', birth: b_2535 as UbdRecord[], death: undefined },
  '209231': { gpName: 'Borlam', district: 'KAMAREDDY', mandal: 'Banswada', birth: b_209231 as UbdRecord[], death: undefined },
  '204747': { gpName: 'Akkaram', district: 'NAGARKURNOOL', mandal: 'Achampeta', birth: b_204747 as UbdRecord[], death: undefined },
  '195003': { gpName: 'Akenipalle', district: 'MANCHERIAL', mandal: 'Bellampalle', birth: b_195003 as UbdRecord[], death: undefined },
  '3152': { gpName: 'Abdullapur', district: 'RANGAREDDY', mandal: 'Abdullapurmet', birth: b_3152 as UbdRecord[], death: undefined },
  '213283': { gpName: 'Alimpur', district: 'JANGOAN', mandal: 'Bachannapeta', birth: b_213283 as UbdRecord[], death: undefined },
  '205745': { gpName: 'Chandragad', district: 'WANAPARTHY', mandal: 'Amarachintha', birth: b_205745 as UbdRecord[], death: undefined },
  '10209': { gpName: 'Bheemini', district: 'MANCHERIAL', mandal: 'Bheemini', birth: b_10209 as UbdRecord[], death: d_10209 as UbdRecord[] },
  '201022': { gpName: 'Bommanapalli', district: 'KARIMNAGAR', mandal: 'Chigurumamidi', birth: b_201022 as UbdRecord[], death: undefined },
  '21370': { gpName: 'Allapadu', district: 'KHAMMAM', mandal: 'Bonakal', birth: b_21370 as UbdRecord[], death: undefined },
  '20248': { gpName: 'Tummaguda', district: 'ADILABAD', mandal: 'Adilabad', birth: b_20248 as UbdRecord[], death: d_20248 as UbdRecord[] },
  '207724': { gpName: 'Addagudur', district: 'YADADRI BHUVANAGIRI', mandal: 'Addagudur', birth: b_207724 as UbdRecord[], death: undefined },
  '205007': { gpName: 'Annasagar', district: 'NARAYANPET', mandal: 'Damaragidda', birth: b_205007 as UbdRecord[], death: undefined },
  '204787': { gpName: 'Bhoompur', district: 'JOGULAMBA GADWAL', mandal: 'Aiza', birth: b_204787 as UbdRecord[], death: undefined },
  '280002': { gpName: 'Akkalapalli', district: 'ADILABAD', mandal: 'Adilabad', birth: b_280002 as UbdRecord[], death: d_280002 as UbdRecord[] },
  '206541': { gpName: 'Akberpet', district: 'SIDDIPET', mandal: 'AkbarpetNA Bhoompally', birth: b_206541 as UbdRecord[], death: undefined },
  '2998': { gpName: 'Bantaram', district: 'VIKARABAD', mandal: 'Bantaram', birth: b_2998 as UbdRecord[], death: undefined },
  '20008': { gpName: 'Bheemseri', district: 'ADILABAD', mandal: 'Bazarhathnoor', birth: b_20008 as UbdRecord[], death: d_20008 as UbdRecord[] },
  '280102': { gpName: 'Adaviramaram', district: 'BHADRADRI KOTHAGUDEM', mandal: 'Allapalli', birth: b_280102 as UbdRecord[], death: undefined },
  '20001': { gpName: 'Allikori', district: 'ADILABAD', mandal: 'Adilabad', birth: b_20001 as UbdRecord[], death: undefined },
  '10001': { gpName: 'Alladurg', district: 'MEDAK', mandal: 'Alladurg', birth: b_10001 as UbdRecord[], death: undefined },
  '200980': { gpName: 'Anathapally', district: 'RAJANNA SIRCILLA', mandal: 'Boinpalle', birth: b_200980 as UbdRecord[], death: undefined },
  '207584': { gpName: 'Ameenabad', district: 'SURYAPET', mandal: 'Ananthagiri', birth: b_207584 as UbdRecord[], death: undefined },
  '10262': { gpName: 'Addakal', district: 'MAHABUBNAGAR', mandal: 'Addakal', birth: b_10262 as UbdRecord[], death: undefined },
  '194932': { gpName: 'Ada', district: 'KOMARAMBHEEM ASIFABAD', mandal: 'Asifabad', birth: b_194932 as UbdRecord[], death: undefined },
  '1539': { gpName: 'Aloor', district: 'NIZAMABAD', mandal: 'Aloor', birth: b_1539 as UbdRecord[], death: undefined },
  '1741': { gpName: 'Basar', district: 'NIRMAL', mandal: 'Basar', birth: b_1741 as UbdRecord[], death: undefined },
};
