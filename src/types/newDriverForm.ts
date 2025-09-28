export type ApplicationType = "ownerOperator" | "companyDriver";
export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  from: string;
  to: string;
};

export type TradeReference = {
  companyName: string;
  city: string;
  state: string;
  zip: string;
  contact: string;
  phone: string;
  email: string;
};
export type EmploymentHistory = {
  companyName: string;
  contactPerson: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  position: string;
  from: string;
  to: string;
  leaveReason: string;
  trailerType: string;
  fmcsrSubject: boolean;
  dotDrugTestRegulated: boolean;
};
export type DrivingExperience = {
  equipmentType: string;
  yearsOfExperience: string;
  milesDriven: string;
};
export type AccidentRecord = {
  accidentDate: string | undefined;
  accidentType: string;
  fatalities: string;
  injuries: string;
};
export type TrafficConvictions = {
  location: string;
  convictionDate: string | undefined;
  charge: string;
};
export type LicenseAndCriminalBackground = {
  deniedLicense: boolean;
  suspendedRevokedLicense: boolean;
  descriptionForDeniedOrRevokedLicense: string;
  arrested: boolean;
  descriptionForArrested: string;
};
export type EmergencyContact = {
  name: string;
  phone: string;
  relationship: string;
};

export type DriversLicense = {
  number: string;
  state: string;
  class: string;
  expDate: string;
};
export type NewDriverForm = {
  applicationType: ApplicationType;
  firstName: string;
  lastName: string;
  socialSecurity: string;
  driversLicense: DriversLicense;
  dateOfBirth: string;
  physicalAddress: Address[];
  phone: string;
  altPhone: string;
  drivingExperience: DrivingExperience[];
  accidentRecord: AccidentRecord[];
  trafficConvictions: TrafficConvictions[];
  licenseAndCriminalBackground: LicenseAndCriminalBackground;
  emergencyContact: EmergencyContact;
  employmentHistory: EmploymentHistory[];
  printedName: string;
  date: string;
  signature: string;
  termsAgreed: boolean;
  deniedLicense: boolean;
  suspendedOrRevoked: boolean;
  deniedOrRevokedExplanation: string;
  isConvicted: boolean;
  convictedExplanation: string;
  employmentGapExplanations: Record<string, string>;
};
