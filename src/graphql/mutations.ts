/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createTrailerRCJ = /* GraphQL */ `mutation CreateTrailerRCJ(
  $input: CreateTrailerRCJInput!
  $condition: ModelTrailerRCJConditionInput
) {
  createTrailerRCJ(input: $input, condition: $condition) {
    id
    chassisNumber
    vinNumber
    plateNumber
    inspectionExpiresAt
    inspectionFile
    registrationExpiresAt
    registrationFile
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTrailerRCJMutationVariables,
  APITypes.CreateTrailerRCJMutation
>;
export const updateTrailerRCJ = /* GraphQL */ `mutation UpdateTrailerRCJ(
  $input: UpdateTrailerRCJInput!
  $condition: ModelTrailerRCJConditionInput
) {
  updateTrailerRCJ(input: $input, condition: $condition) {
    id
    chassisNumber
    vinNumber
    plateNumber
    inspectionExpiresAt
    inspectionFile
    registrationExpiresAt
    registrationFile
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTrailerRCJMutationVariables,
  APITypes.UpdateTrailerRCJMutation
>;
export const deleteTrailerRCJ = /* GraphQL */ `mutation DeleteTrailerRCJ(
  $input: DeleteTrailerRCJInput!
  $condition: ModelTrailerRCJConditionInput
) {
  deleteTrailerRCJ(input: $input, condition: $condition) {
    id
    chassisNumber
    vinNumber
    plateNumber
    inspectionExpiresAt
    inspectionFile
    registrationExpiresAt
    registrationFile
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTrailerRCJMutationVariables,
  APITypes.DeleteTrailerRCJMutation
>;
