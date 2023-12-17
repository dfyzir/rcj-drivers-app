/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ChassisLocation } from "../API.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ChassisLocationUpdateFormInputValues = {
    chassisNumber?: string;
    location?: string;
    container?: string;
};
export declare type ChassisLocationUpdateFormValidationValues = {
    chassisNumber?: ValidationFunction<string>;
    location?: ValidationFunction<string>;
    container?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChassisLocationUpdateFormOverridesProps = {
    ChassisLocationUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    chassisNumber?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<AutocompleteProps>;
    container?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ChassisLocationUpdateFormProps = React.PropsWithChildren<{
    overrides?: ChassisLocationUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    chassisLocation?: ChassisLocation;
    onSubmit?: (fields: ChassisLocationUpdateFormInputValues) => ChassisLocationUpdateFormInputValues;
    onSuccess?: (fields: ChassisLocationUpdateFormInputValues) => void;
    onError?: (fields: ChassisLocationUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChassisLocationUpdateFormInputValues) => ChassisLocationUpdateFormInputValues;
    onValidate?: ChassisLocationUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ChassisLocationUpdateForm(props: ChassisLocationUpdateFormProps): React.ReactElement;
