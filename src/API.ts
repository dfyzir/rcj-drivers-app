/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateNewDriverPersonalInfoInput = {
  id?: string | null;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  datOfBirth: string;
  socialSecurityNumber: number;
  primaryPhoneNumber: string;
  altPhoneNumber?: string | null;
  licenseNumber: number;
  licenseCategory: string;
  licenseState: string;
  licenseExpirationDate: string;
  primaryAddress: string;
  primaryCity: string;
  primaryState: string;
  primaryZip: number;
  secondaryAddress?: string | null;
  secondaryCity?: string | null;
  secondaryState?: string | null;
  secondaryZip?: number | null;
  drivingExperience?: Array<string | null> | null;
  accidentHistory?: Array<string | null> | null;
  criminalHistory?: Array<string | null> | null;
  employmentHistory?: Array<string | null> | null;
  emergencyContact?: Array<string | null> | null;
};

export type ModelNewDriverPersonalInfoConditionInput = {
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  middleName?: ModelStringInput | null;
  datOfBirth?: ModelStringInput | null;
  socialSecurityNumber?: ModelIntInput | null;
  primaryPhoneNumber?: ModelStringInput | null;
  altPhoneNumber?: ModelStringInput | null;
  licenseNumber?: ModelIntInput | null;
  licenseCategory?: ModelStringInput | null;
  licenseState?: ModelStringInput | null;
  licenseExpirationDate?: ModelStringInput | null;
  primaryAddress?: ModelStringInput | null;
  primaryCity?: ModelStringInput | null;
  primaryState?: ModelStringInput | null;
  primaryZip?: ModelIntInput | null;
  secondaryAddress?: ModelStringInput | null;
  secondaryCity?: ModelStringInput | null;
  secondaryState?: ModelStringInput | null;
  secondaryZip?: ModelIntInput | null;
  drivingExperience?: ModelStringInput | null;
  accidentHistory?: ModelStringInput | null;
  criminalHistory?: ModelStringInput | null;
  employmentHistory?: ModelStringInput | null;
  emergencyContact?: ModelStringInput | null;
  and?: Array<ModelNewDriverPersonalInfoConditionInput | null> | null;
  or?: Array<ModelNewDriverPersonalInfoConditionInput | null> | null;
  not?: ModelNewDriverPersonalInfoConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type NewDriverPersonalInfo = {
  __typename: "NewDriverPersonalInfo";
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  datOfBirth: string;
  socialSecurityNumber: number;
  primaryPhoneNumber: string;
  altPhoneNumber?: string | null;
  licenseNumber: number;
  licenseCategory: string;
  licenseState: string;
  licenseExpirationDate: string;
  primaryAddress: string;
  primaryCity: string;
  primaryState: string;
  primaryZip: number;
  secondaryAddress?: string | null;
  secondaryCity?: string | null;
  secondaryState?: string | null;
  secondaryZip?: number | null;
  drivingExperience?: Array<string | null> | null;
  accidentHistory?: Array<string | null> | null;
  criminalHistory?: Array<string | null> | null;
  employmentHistory?: Array<string | null> | null;
  emergencyContact?: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateNewDriverPersonalInfoInput = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  datOfBirth?: string | null;
  socialSecurityNumber?: number | null;
  primaryPhoneNumber?: string | null;
  altPhoneNumber?: string | null;
  licenseNumber?: number | null;
  licenseCategory?: string | null;
  licenseState?: string | null;
  licenseExpirationDate?: string | null;
  primaryAddress?: string | null;
  primaryCity?: string | null;
  primaryState?: string | null;
  primaryZip?: number | null;
  secondaryAddress?: string | null;
  secondaryCity?: string | null;
  secondaryState?: string | null;
  secondaryZip?: number | null;
  drivingExperience?: Array<string | null> | null;
  accidentHistory?: Array<string | null> | null;
  criminalHistory?: Array<string | null> | null;
  employmentHistory?: Array<string | null> | null;
  emergencyContact?: Array<string | null> | null;
};

export type DeleteNewDriverPersonalInfoInput = {
  id: string;
};

export type CreateChassisLocationInput = {
  id?: string | null;
  chassisNumber: string;
  location?: string | null;
  container?: string | null;
};

export type ModelChassisLocationConditionInput = {
  chassisNumber?: ModelStringInput | null;
  location?: ModelStringInput | null;
  container?: ModelStringInput | null;
  and?: Array<ModelChassisLocationConditionInput | null> | null;
  or?: Array<ModelChassisLocationConditionInput | null> | null;
  not?: ModelChassisLocationConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type ChassisLocation = {
  __typename: "ChassisLocation";
  id: string;
  chassisNumber: string;
  location?: string | null;
  container?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateChassisLocationInput = {
  id: string;
  chassisNumber?: string | null;
  location?: string | null;
  container?: string | null;
};

export type DeleteChassisLocationInput = {
  id: string;
};

export type CreateTrailerRCJInput = {
  id?: string | null;
  chassisNumber?: string | null;
  vinNumber?: string | null;
  plateNumber?: string | null;
  inspectionExpiresAt?: string | null;
  inspectionFile?: string | null;
  registrationExpiresAt?: string | null;
  registrationFile?: string | null;
};

export type ModelTrailerRCJConditionInput = {
  chassisNumber?: ModelStringInput | null;
  vinNumber?: ModelStringInput | null;
  plateNumber?: ModelStringInput | null;
  inspectionExpiresAt?: ModelStringInput | null;
  inspectionFile?: ModelStringInput | null;
  registrationExpiresAt?: ModelStringInput | null;
  registrationFile?: ModelStringInput | null;
  and?: Array<ModelTrailerRCJConditionInput | null> | null;
  or?: Array<ModelTrailerRCJConditionInput | null> | null;
  not?: ModelTrailerRCJConditionInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
};

export type TrailerRCJ = {
  __typename: "TrailerRCJ";
  id: string;
  chassisNumber?: string | null;
  vinNumber?: string | null;
  plateNumber?: string | null;
  inspectionExpiresAt?: string | null;
  inspectionFile?: string | null;
  registrationExpiresAt?: string | null;
  registrationFile?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateTrailerRCJInput = {
  id: string;
  chassisNumber?: string | null;
  vinNumber?: string | null;
  plateNumber?: string | null;
  inspectionExpiresAt?: string | null;
  inspectionFile?: string | null;
  registrationExpiresAt?: string | null;
  registrationFile?: string | null;
};

export type DeleteTrailerRCJInput = {
  id: string;
};

export type ModelNewDriverPersonalInfoFilterInput = {
  id?: ModelIDInput | null;
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  middleName?: ModelStringInput | null;
  datOfBirth?: ModelStringInput | null;
  socialSecurityNumber?: ModelIntInput | null;
  primaryPhoneNumber?: ModelStringInput | null;
  altPhoneNumber?: ModelStringInput | null;
  licenseNumber?: ModelIntInput | null;
  licenseCategory?: ModelStringInput | null;
  licenseState?: ModelStringInput | null;
  licenseExpirationDate?: ModelStringInput | null;
  primaryAddress?: ModelStringInput | null;
  primaryCity?: ModelStringInput | null;
  primaryState?: ModelStringInput | null;
  primaryZip?: ModelIntInput | null;
  secondaryAddress?: ModelStringInput | null;
  secondaryCity?: ModelStringInput | null;
  secondaryState?: ModelStringInput | null;
  secondaryZip?: ModelIntInput | null;
  drivingExperience?: ModelStringInput | null;
  accidentHistory?: ModelStringInput | null;
  criminalHistory?: ModelStringInput | null;
  employmentHistory?: ModelStringInput | null;
  emergencyContact?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelNewDriverPersonalInfoFilterInput | null> | null;
  or?: Array<ModelNewDriverPersonalInfoFilterInput | null> | null;
  not?: ModelNewDriverPersonalInfoFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelNewDriverPersonalInfoConnection = {
  __typename: "ModelNewDriverPersonalInfoConnection";
  items: Array<NewDriverPersonalInfo | null>;
  nextToken?: string | null;
};

export type ModelChassisLocationFilterInput = {
  id?: ModelIDInput | null;
  chassisNumber?: ModelStringInput | null;
  location?: ModelStringInput | null;
  container?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelChassisLocationFilterInput | null> | null;
  or?: Array<ModelChassisLocationFilterInput | null> | null;
  not?: ModelChassisLocationFilterInput | null;
};

export type ModelChassisLocationConnection = {
  __typename: "ModelChassisLocationConnection";
  items: Array<ChassisLocation | null>;
  nextToken?: string | null;
};

export type ModelTrailerRCJFilterInput = {
  id?: ModelIDInput | null;
  chassisNumber?: ModelStringInput | null;
  vinNumber?: ModelStringInput | null;
  plateNumber?: ModelStringInput | null;
  inspectionExpiresAt?: ModelStringInput | null;
  inspectionFile?: ModelStringInput | null;
  registrationExpiresAt?: ModelStringInput | null;
  registrationFile?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTrailerRCJFilterInput | null> | null;
  or?: Array<ModelTrailerRCJFilterInput | null> | null;
  not?: ModelTrailerRCJFilterInput | null;
};

export type ModelTrailerRCJConnection = {
  __typename: "ModelTrailerRCJConnection";
  items: Array<TrailerRCJ | null>;
  nextToken?: string | null;
};

export type ModelSubscriptionNewDriverPersonalInfoFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  firstName?: ModelSubscriptionStringInput | null;
  lastName?: ModelSubscriptionStringInput | null;
  middleName?: ModelSubscriptionStringInput | null;
  datOfBirth?: ModelSubscriptionStringInput | null;
  socialSecurityNumber?: ModelSubscriptionIntInput | null;
  primaryPhoneNumber?: ModelSubscriptionStringInput | null;
  altPhoneNumber?: ModelSubscriptionStringInput | null;
  licenseNumber?: ModelSubscriptionIntInput | null;
  licenseCategory?: ModelSubscriptionStringInput | null;
  licenseState?: ModelSubscriptionStringInput | null;
  licenseExpirationDate?: ModelSubscriptionStringInput | null;
  primaryAddress?: ModelSubscriptionStringInput | null;
  primaryCity?: ModelSubscriptionStringInput | null;
  primaryState?: ModelSubscriptionStringInput | null;
  primaryZip?: ModelSubscriptionIntInput | null;
  secondaryAddress?: ModelSubscriptionStringInput | null;
  secondaryCity?: ModelSubscriptionStringInput | null;
  secondaryState?: ModelSubscriptionStringInput | null;
  secondaryZip?: ModelSubscriptionIntInput | null;
  drivingExperience?: ModelSubscriptionStringInput | null;
  accidentHistory?: ModelSubscriptionStringInput | null;
  criminalHistory?: ModelSubscriptionStringInput | null;
  employmentHistory?: ModelSubscriptionStringInput | null;
  emergencyContact?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionNewDriverPersonalInfoFilterInput | null> | null;
  or?: Array<ModelSubscriptionNewDriverPersonalInfoFilterInput | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  in?: Array<number | null> | null;
  notIn?: Array<number | null> | null;
};

export type ModelSubscriptionChassisLocationFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  chassisNumber?: ModelSubscriptionStringInput | null;
  location?: ModelSubscriptionStringInput | null;
  container?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionChassisLocationFilterInput | null> | null;
  or?: Array<ModelSubscriptionChassisLocationFilterInput | null> | null;
};

export type ModelSubscriptionTrailerRCJFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  chassisNumber?: ModelSubscriptionStringInput | null;
  vinNumber?: ModelSubscriptionStringInput | null;
  plateNumber?: ModelSubscriptionStringInput | null;
  inspectionExpiresAt?: ModelSubscriptionStringInput | null;
  inspectionFile?: ModelSubscriptionStringInput | null;
  registrationExpiresAt?: ModelSubscriptionStringInput | null;
  registrationFile?: ModelSubscriptionStringInput | null;
  createdAt?: ModelSubscriptionStringInput | null;
  updatedAt?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionTrailerRCJFilterInput | null> | null;
  or?: Array<ModelSubscriptionTrailerRCJFilterInput | null> | null;
};

export type CreateNewDriverPersonalInfoMutationVariables = {
  input: CreateNewDriverPersonalInfoInput;
  condition?: ModelNewDriverPersonalInfoConditionInput | null;
};

export type CreateNewDriverPersonalInfoMutation = {
  createNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateNewDriverPersonalInfoMutationVariables = {
  input: UpdateNewDriverPersonalInfoInput;
  condition?: ModelNewDriverPersonalInfoConditionInput | null;
};

export type UpdateNewDriverPersonalInfoMutation = {
  updateNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteNewDriverPersonalInfoMutationVariables = {
  input: DeleteNewDriverPersonalInfoInput;
  condition?: ModelNewDriverPersonalInfoConditionInput | null;
};

export type DeleteNewDriverPersonalInfoMutation = {
  deleteNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateChassisLocationMutationVariables = {
  input: CreateChassisLocationInput;
  condition?: ModelChassisLocationConditionInput | null;
};

export type CreateChassisLocationMutation = {
  createChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateChassisLocationMutationVariables = {
  input: UpdateChassisLocationInput;
  condition?: ModelChassisLocationConditionInput | null;
};

export type UpdateChassisLocationMutation = {
  updateChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteChassisLocationMutationVariables = {
  input: DeleteChassisLocationInput;
  condition?: ModelChassisLocationConditionInput | null;
};

export type DeleteChassisLocationMutation = {
  deleteChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateTrailerRCJMutationVariables = {
  input: CreateTrailerRCJInput;
  condition?: ModelTrailerRCJConditionInput | null;
};

export type CreateTrailerRCJMutation = {
  createTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateTrailerRCJMutationVariables = {
  input: UpdateTrailerRCJInput;
  condition?: ModelTrailerRCJConditionInput | null;
};

export type UpdateTrailerRCJMutation = {
  updateTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteTrailerRCJMutationVariables = {
  input: DeleteTrailerRCJInput;
  condition?: ModelTrailerRCJConditionInput | null;
};

export type DeleteTrailerRCJMutation = {
  deleteTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type GetNewDriverPersonalInfoQueryVariables = {
  id: string;
};

export type GetNewDriverPersonalInfoQuery = {
  getNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListNewDriverPersonalInfosQueryVariables = {
  filter?: ModelNewDriverPersonalInfoFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListNewDriverPersonalInfosQuery = {
  listNewDriverPersonalInfos?: {
    __typename: "ModelNewDriverPersonalInfoConnection";
    items: Array<{
      __typename: "NewDriverPersonalInfo";
      id: string;
      firstName: string;
      lastName: string;
      middleName?: string | null;
      datOfBirth: string;
      socialSecurityNumber: number;
      primaryPhoneNumber: string;
      altPhoneNumber?: string | null;
      licenseNumber: number;
      licenseCategory: string;
      licenseState: string;
      licenseExpirationDate: string;
      primaryAddress: string;
      primaryCity: string;
      primaryState: string;
      primaryZip: number;
      secondaryAddress?: string | null;
      secondaryCity?: string | null;
      secondaryState?: string | null;
      secondaryZip?: number | null;
      drivingExperience?: Array<string | null> | null;
      accidentHistory?: Array<string | null> | null;
      criminalHistory?: Array<string | null> | null;
      employmentHistory?: Array<string | null> | null;
      emergencyContact?: Array<string | null> | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetChassisLocationQueryVariables = {
  id: string;
};

export type GetChassisLocationQuery = {
  getChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListChassisLocationsQueryVariables = {
  filter?: ModelChassisLocationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListChassisLocationsQuery = {
  listChassisLocations?: {
    __typename: "ModelChassisLocationConnection";
    items: Array<{
      __typename: "ChassisLocation";
      id: string;
      chassisNumber: string;
      location?: string | null;
      container?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetTrailerRCJQueryVariables = {
  id: string;
};

export type GetTrailerRCJQuery = {
  getTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListTrailerRCJSQueryVariables = {
  filter?: ModelTrailerRCJFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTrailerRCJSQuery = {
  listTrailerRCJS?: {
    __typename: "ModelTrailerRCJConnection";
    items: Array<{
      __typename: "TrailerRCJ";
      id: string;
      chassisNumber?: string | null;
      vinNumber?: string | null;
      plateNumber?: string | null;
      inspectionExpiresAt?: string | null;
      inspectionFile?: string | null;
      registrationExpiresAt?: string | null;
      registrationFile?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OnCreateNewDriverPersonalInfoSubscriptionVariables = {
  filter?: ModelSubscriptionNewDriverPersonalInfoFilterInput | null;
};

export type OnCreateNewDriverPersonalInfoSubscription = {
  onCreateNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateNewDriverPersonalInfoSubscriptionVariables = {
  filter?: ModelSubscriptionNewDriverPersonalInfoFilterInput | null;
};

export type OnUpdateNewDriverPersonalInfoSubscription = {
  onUpdateNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteNewDriverPersonalInfoSubscriptionVariables = {
  filter?: ModelSubscriptionNewDriverPersonalInfoFilterInput | null;
};

export type OnDeleteNewDriverPersonalInfoSubscription = {
  onDeleteNewDriverPersonalInfo?: {
    __typename: "NewDriverPersonalInfo";
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    datOfBirth: string;
    socialSecurityNumber: number;
    primaryPhoneNumber: string;
    altPhoneNumber?: string | null;
    licenseNumber: number;
    licenseCategory: string;
    licenseState: string;
    licenseExpirationDate: string;
    primaryAddress: string;
    primaryCity: string;
    primaryState: string;
    primaryZip: number;
    secondaryAddress?: string | null;
    secondaryCity?: string | null;
    secondaryState?: string | null;
    secondaryZip?: number | null;
    drivingExperience?: Array<string | null> | null;
    accidentHistory?: Array<string | null> | null;
    criminalHistory?: Array<string | null> | null;
    employmentHistory?: Array<string | null> | null;
    emergencyContact?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnCreateChassisLocationSubscriptionVariables = {
  filter?: ModelSubscriptionChassisLocationFilterInput | null;
};

export type OnCreateChassisLocationSubscription = {
  onCreateChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateChassisLocationSubscriptionVariables = {
  filter?: ModelSubscriptionChassisLocationFilterInput | null;
};

export type OnUpdateChassisLocationSubscription = {
  onUpdateChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteChassisLocationSubscriptionVariables = {
  filter?: ModelSubscriptionChassisLocationFilterInput | null;
};

export type OnDeleteChassisLocationSubscription = {
  onDeleteChassisLocation?: {
    __typename: "ChassisLocation";
    id: string;
    chassisNumber: string;
    location?: string | null;
    container?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnCreateTrailerRCJSubscriptionVariables = {
  filter?: ModelSubscriptionTrailerRCJFilterInput | null;
};

export type OnCreateTrailerRCJSubscription = {
  onCreateTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateTrailerRCJSubscriptionVariables = {
  filter?: ModelSubscriptionTrailerRCJFilterInput | null;
};

export type OnUpdateTrailerRCJSubscription = {
  onUpdateTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteTrailerRCJSubscriptionVariables = {
  filter?: ModelSubscriptionTrailerRCJFilterInput | null;
};

export type OnDeleteTrailerRCJSubscription = {
  onDeleteTrailerRCJ?: {
    __typename: "TrailerRCJ";
    id: string;
    chassisNumber?: string | null;
    vinNumber?: string | null;
    plateNumber?: string | null;
    inspectionExpiresAt?: string | null;
    inspectionFile?: string | null;
    registrationExpiresAt?: string | null;
    registrationFile?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};
