/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ChassisLocationCreateFormInputValues = {
    chassisNumber?: string;
    location?: string;
    container?: string;
};
export declare type ChassisLocationCreateFormValidationValues = {
    chassisNumber?: ValidationFunction<string>;
    location?: ValidationFunction<string>;
    container?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ChassisLocationCreateFormOverridesProps = {
    ChassisLocationCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    chassisNumber?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<AutocompleteProps>;
    container?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ChassisLocationCreateFormProps = React.PropsWithChildren<{
    overrides?: ChassisLocationCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ChassisLocationCreateFormInputValues) => ChassisLocationCreateFormInputValues;
    onSuccess?: (fields: ChassisLocationCreateFormInputValues) => void;
    onError?: (fields: ChassisLocationCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ChassisLocationCreateFormInputValues) => ChassisLocationCreateFormInputValues;
    onValidate?: ChassisLocationCreateFormValidationValues;
} & React.CSSProperties>;
export default function ChassisLocationCreateForm(props: ChassisLocationCreateFormProps): React.ReactElement;
