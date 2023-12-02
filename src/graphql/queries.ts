/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getTrailerRCJ = /* GraphQL */ `query GetTrailerRCJ($id: ID!) {
  getTrailerRCJ(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTrailerRCJQueryVariables,
  APITypes.GetTrailerRCJQuery
>;
export const listTrailerRCJS = /* GraphQL */ `query ListTrailerRCJS(
  $filter: ModelTrailerRCJFilterInput
  $limit: Int
  $nextToken: String
) {
  listTrailerRCJS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTrailerRCJSQueryVariables,
  APITypes.ListTrailerRCJSQuery
>;
