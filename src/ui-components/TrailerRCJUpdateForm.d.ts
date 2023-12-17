/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { StorageManagerProps } from "@aws-amplify/ui-react-storage";
import { TrailerRCJ } from "../API.ts";
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
export declare type TrailerRCJUpdateFormInputValues = {
    chassisNumber?: string;
    vinNumber?: string;
    plateNumber?: string;
    inspectionExpiresAt?: string;
    inspectionFile?: string;
    registrationExpiresAt?: string;
    registrationFile?: string;
};
export declare type TrailerRCJUpdateFormValidationValues = {
    chassisNumber?: ValidationFunction<string>;
    vinNumber?: ValidationFunction<string>;
    plateNumber?: ValidationFunction<string>;
    inspectionExpiresAt?: ValidationFunction<string>;
    inspectionFile?: ValidationFunction<string>;
    registrationExpiresAt?: ValidationFunction<string>;
    registrationFile?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TrailerRCJUpdateFormOverridesProps = {
    TrailerRCJUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    chassisNumber?: PrimitiveOverrideProps<TextFieldProps>;
    vinNumber?: PrimitiveOverrideProps<TextFieldProps>;
    plateNumber?: PrimitiveOverrideProps<TextFieldProps>;
    inspectionExpiresAt?: PrimitiveOverrideProps<TextFieldProps>;
    inspectionFile?: PrimitiveOverrideProps<StorageManagerProps>;
    registrationExpiresAt?: PrimitiveOverrideProps<TextFieldProps>;
    registrationFile?: PrimitiveOverrideProps<StorageManagerProps>;
} & EscapeHatchProps;
export declare type TrailerRCJUpdateFormProps = React.PropsWithChildren<{
    overrides?: TrailerRCJUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    trailerRCJ?: TrailerRCJ;
    onSubmit?: (fields: TrailerRCJUpdateFormInputValues) => TrailerRCJUpdateFormInputValues;
    onSuccess?: (fields: TrailerRCJUpdateFormInputValues) => void;
    onError?: (fields: TrailerRCJUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: TrailerRCJUpdateFormInputValues) => TrailerRCJUpdateFormInputValues;
    onValidate?: TrailerRCJUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TrailerRCJUpdateForm(props: TrailerRCJUpdateFormProps): React.ReactElement;
