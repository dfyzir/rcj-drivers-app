/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField, useTheme } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import {
  fetchByPath,
  getOverrideProps,
  processFile,
  validateField,
} from "./utils";
import { generateClient } from "aws-amplify/api";
import { createTrailerRCJ } from "../graphql/mutations";
import { Field } from "@aws-amplify/ui-react/internal";
const client = generateClient();
export default function TrailerRCJCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const { tokens } = useTheme();
  const initialValues = {
    chassisNumber: "",
    vinNumber: "",
    plateNumber: "",
    inspectionExpiresAt: "",
    inspectionFile: undefined,
    registrationExpiresAt: "",
    registrationFile: undefined,
  };
  const [chassisNumber, setChassisNumber] = React.useState(
    initialValues.chassisNumber
  );
  const [vinNumber, setVinNumber] = React.useState(initialValues.vinNumber);
  const [plateNumber, setPlateNumber] = React.useState(
    initialValues.plateNumber
  );
  const [inspectionExpiresAt, setInspectionExpiresAt] = React.useState(
    initialValues.inspectionExpiresAt
  );
  const [inspectionFile, setInspectionFile] = React.useState(
    initialValues.inspectionFile
  );
  const [registrationExpiresAt, setRegistrationExpiresAt] = React.useState(
    initialValues.registrationExpiresAt
  );
  const [registrationFile, setRegistrationFile] = React.useState(
    initialValues.registrationFile
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setChassisNumber(initialValues.chassisNumber);
    setVinNumber(initialValues.vinNumber);
    setPlateNumber(initialValues.plateNumber);
    setInspectionExpiresAt(initialValues.inspectionExpiresAt);
    setInspectionFile(initialValues.inspectionFile);
    setRegistrationExpiresAt(initialValues.registrationExpiresAt);
    setRegistrationFile(initialValues.registrationFile);
    setErrors({});
  };
  const validations = {
    chassisNumber: [
      { type: "Required" },
      {
        type: "GreaterThanChar",
        numValues: [9],
        validationMessage: "The value must be  10 characters",
      },
      {
        type: "LessThanChar",
        numValues: [11],
        validationMessage: "The value must be 10 characters ",
      },
    ],
    vinNumber: [
      { type: "Required" },
      {
        type: "GreaterThanChar",
        numValues: [16],
        validationMessage: "The value must be  17 characters",
      },
      {
        type: "LessThanChar",
        numValues: [18],
        validationMessage: "The value must be 17 characters ",
      },
    ],
    plateNumber: [],
    inspectionExpiresAt: [],
    inspectionFile: [],
    registrationExpiresAt: [],
    registrationFile: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap={tokens.space.xs.value}
      columnGap={tokens.space.xxxl.value}
      padding={tokens.space.medium.value}
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          chassisNumber,
          vinNumber,
          plateNumber,
          inspectionExpiresAt,
          inspectionFile,
          registrationExpiresAt,
          registrationFile,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createTrailerRCJ.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TrailerRCJCreateForm")}
      {...rest}
    >
      <TextField
        label="Chassis #"
        isRequired={true}
        isReadOnly={false}
        value={chassisNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              chassisNumber: value,
              vinNumber,
              plateNumber,
              inspectionExpiresAt,
              inspectionFile,
              registrationExpiresAt,
              registrationFile,
            };
            const result = onChange(modelFields);
            value = result?.chassisNumber ?? value;
          }
          if (errors.chassisNumber?.hasError) {
            runValidationTasks("chassisNumber", value);
          }
          setChassisNumber(value);
        }}
        onBlur={() => runValidationTasks("chassisNumber", chassisNumber)}
        errorMessage={errors.chassisNumber?.errorMessage}
        hasError={errors.chassisNumber?.hasError}
        {...getOverrideProps(overrides, "chassisNumber")}
      ></TextField>
      <TextField
        label="VIN"
        isRequired={true}
        isReadOnly={false}
        value={vinNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              chassisNumber,
              vinNumber: value,
              plateNumber,
              inspectionExpiresAt,
              inspectionFile,
              registrationExpiresAt,
              registrationFile,
            };
            const result = onChange(modelFields);
            value = result?.vinNumber ?? value;
          }
          if (errors.vinNumber?.hasError) {
            runValidationTasks("vinNumber", value);
          }
          setVinNumber(value);
        }}
        onBlur={() => runValidationTasks("vinNumber", vinNumber)}
        errorMessage={errors.vinNumber?.errorMessage}
        hasError={errors.vinNumber?.hasError}
        {...getOverrideProps(overrides, "vinNumber")}
      ></TextField>
      <TextField
        label="Plate #"
        isRequired={false}
        isReadOnly={false}
        value={plateNumber}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              chassisNumber,
              vinNumber,
              plateNumber: value,
              inspectionExpiresAt,
              inspectionFile,
              registrationExpiresAt,
              registrationFile,
            };
            const result = onChange(modelFields);
            value = result?.plateNumber ?? value;
          }
          if (errors.plateNumber?.hasError) {
            runValidationTasks("plateNumber", value);
          }
          setPlateNumber(value);
        }}
        onBlur={() => runValidationTasks("plateNumber", plateNumber)}
        errorMessage={errors.plateNumber?.errorMessage}
        hasError={errors.plateNumber?.hasError}
        {...getOverrideProps(overrides, "plateNumber")}
      ></TextField>
      <TextField
        label="Inspection expiration date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={inspectionExpiresAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              chassisNumber,
              vinNumber,
              plateNumber,
              inspectionExpiresAt: value,
              inspectionFile,
              registrationExpiresAt,
              registrationFile,
            };
            const result = onChange(modelFields);
            value = result?.inspectionExpiresAt ?? value;
          }
          if (errors.inspectionExpiresAt?.hasError) {
            runValidationTasks("inspectionExpiresAt", value);
          }
          setInspectionExpiresAt(value);
        }}
        onBlur={() =>
          runValidationTasks("inspectionExpiresAt", inspectionExpiresAt)
        }
        errorMessage={errors.inspectionExpiresAt?.errorMessage}
        hasError={errors.inspectionExpiresAt?.hasError}
        {...getOverrideProps(overrides, "inspectionExpiresAt")}
      ></TextField>
      <Field
        errorMessage={errors.inspectionFile?.errorMessage}
        hasError={errors.inspectionFile?.hasError}
        label={"Inspection File"}
        isRequired={false}
        isReadOnly={false}
      >
        <StorageManager
          onUploadSuccess={({ key }) => {
            setInspectionFile((prev) => {
              let value = key;
              if (onChange) {
                const modelFields = {
                  chassisNumber,
                  vinNumber,
                  plateNumber,
                  inspectionExpiresAt,
                  inspectionFile: value,
                  registrationExpiresAt,
                  registrationFile,
                };
                const result = onChange(modelFields);
                value = result?.inspectionFile ?? value;
              }
              return value;
            });
          }}
          onFileRemove={({ key }) => {
            setInspectionFile((prev) => {
              let value = initialValues?.inspectionFile;
              if (onChange) {
                const modelFields = {
                  chassisNumber,
                  vinNumber,
                  plateNumber,
                  inspectionExpiresAt,
                  inspectionFile: value,
                  registrationExpiresAt,
                  registrationFile,
                };
                const result = onChange(modelFields);
                value = result?.inspectionFile ?? value;
              }
              return value;
            });
          }}
          processFile={processFile}
          accessLevel={"public"}
          acceptedFileTypes={[".pdf"]}
          isResumable={false}
          showThumbnails={true}
          maxFileCount={1}
          {...getOverrideProps(overrides, "inspectionFile")}
        ></StorageManager>
      </Field>
      <TextField
        label="Registration expiration date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={registrationExpiresAt}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              chassisNumber,
              vinNumber,
              plateNumber,
              inspectionExpiresAt,
              inspectionFile,
              registrationExpiresAt: value,
              registrationFile,
            };
            const result = onChange(modelFields);
            value = result?.registrationExpiresAt ?? value;
          }
          if (errors.registrationExpiresAt?.hasError) {
            runValidationTasks("registrationExpiresAt", value);
          }
          setRegistrationExpiresAt(value);
        }}
        onBlur={() =>
          runValidationTasks("registrationExpiresAt", registrationExpiresAt)
        }
        errorMessage={errors.registrationExpiresAt?.errorMessage}
        hasError={errors.registrationExpiresAt?.hasError}
        {...getOverrideProps(overrides, "registrationExpiresAt")}
      ></TextField>
      <Field
        errorMessage={errors.registrationFile?.errorMessage}
        hasError={errors.registrationFile?.hasError}
        label={"Registration File"}
        isRequired={false}
        isReadOnly={false}
      >
        <StorageManager
          onUploadSuccess={({ key }) => {
            setRegistrationFile((prev) => {
              let value = key;
              if (onChange) {
                const modelFields = {
                  chassisNumber,
                  vinNumber,
                  plateNumber,
                  inspectionExpiresAt,
                  inspectionFile,
                  registrationExpiresAt,
                  registrationFile: value,
                };
                const result = onChange(modelFields);
                value = result?.registrationFile ?? value;
              }
              return value;
            });
          }}
          onFileRemove={({ key }) => {
            setRegistrationFile((prev) => {
              let value = initialValues?.registrationFile;
              if (onChange) {
                const modelFields = {
                  chassisNumber,
                  vinNumber,
                  plateNumber,
                  inspectionExpiresAt,
                  inspectionFile,
                  registrationExpiresAt,
                  registrationFile: value,
                };
                const result = onChange(modelFields);
                value = result?.registrationFile ?? value;
              }
              return value;
            });
          }}
          processFile={processFile}
          accessLevel={"public"}
          acceptedFileTypes={[".pdf"]}
          isResumable={false}
          showThumbnails={true}
          maxFileCount={1}
          {...getOverrideProps(overrides, "registrationFile")}
        ></StorageManager>
      </Field>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap={tokens.space.xxxl.value}
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Create"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
