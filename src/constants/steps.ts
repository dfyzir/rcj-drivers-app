import { useTranslation, UseTranslation } from "next-i18next";
export const step0Keys = [
  "firstName",
  "lastName",
  "socialSecurity",
  "dateOfBirth",
  "driversLicense.number",
  "driversLicense.state",
  "driversLicense.class",
  "driversLicense.expDate",
  "physicalAddress",
  "phone",
  "altPhone",
];
export const step1Keys = ["drivingExperience"];
export const step2Keys = ["accidentRecord"];
export const step3Keys = ["trafficConvictions"];
export const step4Keys = ["employmentHistory"];
export const step5Keys = [
  "deniedLicense, suspendedOrRevoked, deniedOrRevokedExplanation",
  "isConvicted",
  "convictedExplanation",
];
export const step6Keys = [
  "printedName",
  "title",
  "date",
  "signature",
  "termsAgreed",
  "creditDisclosure",
];

export const keysByStep = [
  step0Keys, // step index 0 → Personal Information
  step1Keys, // step index 1 → Driving Experience
  step2Keys, // step index 2 → Accident Record
  step3Keys, // step index 3 → Traffic Convictions
  step4Keys, // step index 4 → Employment History
  step5Keys, // step index 5 → Criminal Background
  step6Keys, // step index 6 → Signature & Final
];

export const steps = [
  "personalInformation",
  "drivingExp",
  "accidentRecord",
  "trafficConv",
  "emplHist",
  "criminalBg",
  "signSubmit",
];
