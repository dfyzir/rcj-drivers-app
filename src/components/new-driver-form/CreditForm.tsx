import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import { uploadData } from "aws-amplify/storage";
import { format } from "date-fns";
import { generatePDF } from "@/utils/generatePDF";
import {
  NewDriverForm,
  Address,
  DrivingExperience,
  AccidentRecord,
  TrafficConvictions,
  DriversLicense,
  EmploymentHistory,
} from "@/types/newDriverForm";

import { Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { keysByStep, steps } from "@/constants/steps";
import Image from "next/image";
import rcj_transport from "../../../public/rcj_transport.png";
import { driverFormSchema } from "@/schema/driverSchema";
import FinalStep from "./FinalStep";
import DrivingExpereince from "./DrivingExperience";
import AccidentRecordForm from "./AccidentRecord";
import TrafficConvictionsForm from "./TrafficConvictions";
import { Dayjs } from "dayjs";
import PersonalInformation from "./PersonalInformation";
import EmploymentHistoryForm from "./EmploymentHistory";
import CriminalBackground from "./CriminalBackground";
import { useTranslation } from "react-i18next";
import { Router } from "next/router";
import LocaleSwitcher from "../buttons/LocaleSwitcher";

const LOCAL_STORAGE_KEY = "NewDriverFormData";

const CreditApplicationForm: React.FC = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewDriverForm>({
    authorized: false,
    firstName: "",
    lastName: "",
    socialSecurity: "",
    dateOfBirth: "",
    driversLicense: {
      number: "",
      state: "",
      class: "",
      expDate: "",
    },
    physicalAddress: [
      { street: "", city: "", state: "", zip: "", from: "", to: "" },
    ],
    phone: "",
    altPhone: "",
    drivingExperience: [],
    accidentRecord: [],
    trafficConvictions: [],
    licenseAndCriminalBackground: {
      deniedLicense: false,
      suspendedRevokedLicense: false,
      descriptionForDeniedOrRevokedLicense: "",
      arrested: false,
      descriptionForArrested: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    employmentHistory: [],
    printedName: "",
    date: format(new Date(), "MM/dd/yyyy"),
    signature: "",
    termsAgreed: false,
    creditDisclosure: false,
    deniedLicense: false,
    suspendedOrRevoked: false,
    deniedOrRevokedExplanation: "",
    isConvicted: false,
    convictedExplanation: "",
    employmentGapExplanations: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setFormData(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing stored form data", error);
      }
    }
  }, []);

  // Update localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const validateField = (field: string, updatedData: NewDriverForm) => {
    const { error } = driverFormSchema.validate(updatedData, {
      abortEarly: false,
    });
    if (error) {
      const fieldError = error.details.find((d) => d.path.join(".") === field);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError.message : "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Generic change handler for fields.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    // Convert only numeric fields (except phone/fax fields, which are now strings)

    const newValue = type === "checkbox" ? checked : value;
    const updated = { ...formData, [name]: newValue };
    setFormData(updated);
    validateField(name, updated);
  };

  // Change handler for nested address fields.
  const handleDriversLicenseChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    driversLicense: keyof Pick<NewDriverForm, "driversLicense">
  ) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [driversLicense]: {
        ...(formData[driversLicense] as DriversLicense),
        [name]: value,
      },
    };
    setFormData(updated);
    validateField(`${driversLicense}.${name}`, updated);
  };

  const handleDrivingExperinceChange = (
    index: number,
    field: keyof DrivingExperience,
    value: string
  ) => {
    const updatedRefs = formData.drivingExperience.map((ref, i) =>
      i === index ? { ...ref, [field]: value } : ref
    );
    const updated = { ...formData, drivingExperience: updatedRefs };
    setFormData(updated);
    validateField(`drivingExperience.${index}.${field}`, updated);
  };
  const handleAccidentRecordChange = (
    index: number,
    field: keyof AccidentRecord,
    value: string | Dayjs
  ) => {
    const updatedRefs = formData.accidentRecord.map((ref, i) =>
      i === index ? { ...ref, [field]: value } : ref
    );
    const updated = { ...formData, accidentRecord: updatedRefs };
    setFormData(updated);
    validateField(`accidentRecord.${index}.${field}`, updated);
  };
  const handleTrafficConvictionsChange = (
    index: number,
    field: keyof TrafficConvictions,
    value: string | Dayjs
  ) => {
    const updatedRefs = formData.trafficConvictions.map((ref, i) =>
      i === index ? { ...ref, [field]: value } : ref
    );
    const updated = { ...formData, trafficConvictions: updatedRefs };
    setFormData(updated);
    validateField(`trafficConvictions.${index}.${field}`, updated);
  };
  const handleEmploymentHistoryChange = (
    index: number,
    field: keyof EmploymentHistory,
    value: string | boolean
  ) => {
    const updatedRefs = formData.employmentHistory.map((ref, i) =>
      i === index ? { ...ref, [field]: value } : ref
    );
    const updated = { ...formData, employmentHistory: updatedRefs };
    setFormData(updated);
    // 1) re-validate the individual field
    validateField(`employmentHistory.${index}.${field}`, updated);

    // 2) then re-validate the array as a whole
    validateField("employmentHistory", updated);
  };
  const handleHomeAddressChange = (
    index: number,
    field: keyof Address,
    value: string | boolean
  ) => {
    const updatedRefs = formData.physicalAddress.map((ref, i) =>
      i === index ? { ...ref, [field]: value } : ref
    );
    const updated = { ...formData, physicalAddress: updatedRefs };
    setFormData(updated);
    // 1) re-validate the individual field
    validateField(`physicalAddress.${index}.${field}`, updated);

    // 2) then re-validate the array as a whole
    validateField("physicalAddress", updated);
  };

  const addEmploymentHistory = () => {
    setFormData({
      ...formData,
      employmentHistory: [
        ...formData.employmentHistory,
        {
          companyName: "",
          contactPerson: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          position: "",
          from: "",
          to: "",
          leaveReason: "",
          trailerType: "",
          fmcsrSubject: false,
          dotDrugTestRegulated: false,
        },
      ],
    });
  };
  const addHomeAddress = () => {
    setFormData({
      ...formData,
      physicalAddress: [
        ...formData.physicalAddress,
        {
          street: "",
          city: "",
          state: "",
          zip: "",
          from: "",
          to: "",
        },
      ],
    });
  };
  const addDrivingExperience = () => {
    setFormData({
      ...formData,
      drivingExperience: [
        ...formData.drivingExperience,
        {
          equipmentType: "",
          yearsOfExperience: "",
          milesDriven: "",
        },
      ],
    });
  };
  const addAccidentRecord = () => {
    setFormData({
      ...formData,
      accidentRecord: [
        ...formData.accidentRecord,
        {
          accidentDate: "",
          accidentType: "",
          fatalities: "",
          injuries: "",
        },
      ],
    });
  };
  const addTrafficConviction = () => {
    setFormData({
      ...formData,
      trafficConvictions: [
        ...formData.trafficConvictions,
        {
          location: "",
          convictionDate: "",
          charge: "",
        },
      ],
    });
  };
  const removeEmploymentHistory = (index: number) => {
    const updatedHistory = formData.employmentHistory.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, employmentHistory: updatedHistory });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`employmentHistory.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const removeHomeAddress = (index: number) => {
    const updatedHistory = formData.physicalAddress.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, physicalAddress: updatedHistory });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`physicalAddress`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };
  const removeDrivingExperience = (index: number) => {
    const updatedExp = formData.drivingExperience.filter((_, i) => i !== index);
    setFormData({ ...formData, drivingExperience: updatedExp });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`drivingExperience.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };
  const removeAccidentRecord = (index: number) => {
    const updatedRecords = formData.accidentRecord.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, accidentRecord: updatedRecords });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`accidentRecord.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };
  const removeTrafficConviction = (index: number) => {
    const updatedConvictions = formData.trafficConvictions.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, trafficConvictions: updatedConvictions });
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`trafficConvictions.`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  // Field-level onBlur handler: validate entire form and then set error for given field.
  const handleBlur = (field: string) => {
    const { error } = driverFormSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const fieldError = error.details.find((d) => d.path.join(".") === field);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError.message : "",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = driverFormSchema.validate(formData, {
      abortEarly: false,
    });
    if (error) {
      const fieldErrors: Record<string, string> = {};
      error.details.forEach((err) => {
        const key = err.path.join(".");
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }
    try {
      const pdfBytes = await generatePDF({ formData, sigCanvas });
      const fileName = `applications/drivers/${formData.firstName}_${formData.lastName}_RCJ_Driver_Application_${formData.firstName}_${formData.lastName}.pdf`;
      await uploadData({
        path: fileName,
        data: pdfBytes,
        options: {
          contentType: "application/pdf",
          metadata: {
            appliedAt: formData.date,
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        },
      }).result;
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      // Optionally, you could store this in a new state to display a download button.
      setDownloadUrl(url);
      window.open(url, "_blank");
      // Reset form data.
      setFormData({
        authorized: false,
        firstName: "",
        lastName: "",
        physicalAddress: [
          { street: "", city: "", state: "", zip: "", from: "", to: "" },
        ],
        socialSecurity: "",
        dateOfBirth: "",
        driversLicense: {
          number: "",
          state: "",
          class: "",
          expDate: "",
        },
        phone: "",
        altPhone: "",
        drivingExperience: [],
        accidentRecord: [],
        trafficConvictions: [],
        licenseAndCriminalBackground: {
          deniedLicense: false,
          suspendedRevokedLicense: false,
          descriptionForDeniedOrRevokedLicense: "",
          arrested: false,
          descriptionForArrested: "",
        },
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
        employmentHistory: [],
        printedName: "",
        date: format(new Date(), "yyyy-MM-dd"),
        signature: "",
        termsAgreed: false,
        creditDisclosure: false,
        deniedLicense: false,
        suspendedOrRevoked: false,
        deniedOrRevokedExplanation: "",
        isConvicted: false,
        convictedExplanation: "",
        employmentGapExplanations: {},
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating/uploading PDF:", err);
      setIsLoading(false);
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  // Step-level validation: check errors only for fields in the current step.
  const validateStep = (step: number) => {
    const { error } = driverFormSchema.validate(formData, {
      abortEarly: false,
    });
    if (!error) return [];
    // special‑case: skip these if the array is empty (they’re optional)
    if (
      (step === 1 && formData.drivingExperience.length === 0) ||
      (step === 2 && formData.accidentRecord.length === 0) ||
      (step === 3 && formData.trafficConvictions.length === 0)
    ) {
      return [];
    }
    const keys: string[] = keysByStep[step] ?? [];

    return error.details.filter((err) =>
      keys.some((key) => {
        const path = err.path.join(".");
        return path === key || path.startsWith(key + ".");
      })
    );
  };

  // Check if a given step has any errors.
  const isStepFailed = (step: number) => {
    if (
      (step === 1 && formData.drivingExperience.length === 0) ||
      (step === 2 && formData.accidentRecord.length === 0) ||
      (step === 3 && formData.trafficConvictions.length === 0)
    ) {
      return false;
    }
    const keys: string[] = keysByStep[step] ?? [];
    return Object.entries(errors).some(
      ([field, msg]) =>
        msg.trim() !== "" &&
        keys.some((key) => field === key || field.startsWith(key + "."))
    );
  };

  // Handle Next button: validate current step; if no errors, move to next step.
  const handleNext = () => {
    const stepErrors = validateStep(activeStep);
    if (stepErrors.length > 0) {
      const newErrors: Record<string, string> = { ...errors };
      stepErrors.forEach((err) => {
        const key = err.path.join(".");
        newErrors[key] = err.message;
      });
      setErrors(newErrors);
      // Optionally, prevent navigation if errors exist:
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    const stepErrors = validateStep(activeStep);
    if (activeStep === 6) {
      sigCanvas.current?.clear();
      setFormData({ ...formData, signature: "" });
    }
    if (stepErrors.length > 0) {
      const newErrors: Record<string, string> = { ...errors };
      stepErrors.forEach((err) => {
        const key = err.path.join(".");
        newErrors[key] = err.message;
      });
      setErrors(newErrors);
      // Optionally, prevent navigation if errors exist:
    }
    setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = useCallback(
    (idx: number) => {
      const stepErrors = validateStep(activeStep);
      if (activeStep === 6) {
        sigCanvas.current?.clear();
        setFormData({ ...formData, signature: "" });
      }
      if (stepErrors.length > 0) {
        const newErrors: Record<string, string> = { ...errors };
        stepErrors.forEach((err) => {
          const key = err.path.join(".");
          newErrors[key] = err.message;
        });
        setErrors(newErrors);
        // Optionally, prevent navigation if errors exist:
      }
      setActiveStep(idx);
    },
    [activeStep, errors, formData, validateStep]
  );
  const failedSteps = useMemo(
    () =>
      steps.map((_, idx) => {
        // skip optional arrays
        if (idx === 1 && formData.drivingExperience.length === 0) return false;
        if (idx === 2 && formData.accidentRecord.length === 0) return false;
        if (idx === 3 && formData.trafficConvictions.length === 0) return false;
        return isStepFailed(idx);
      }),
    [
      formData.drivingExperience.length,
      formData.accidentRecord.length,
      formData.trafficConvictions.length,
      errors, // isStepFailed reads from `errors`
    ]
  );
  const stepperBar = useMemo(
    () => (
      <Stepper activeStep={activeStep} alternativeLabel className="flex-wrap">
        {steps.map((label, idx) => {
          const failed = failedSteps[idx];
          return (
            <Step key={label}>
              <StepLabel
                error={failed}
                slotProps={{
                  stepIcon: {
                    error: failed,
                    className: `${
                      activeStep === idx
                        ? "shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:shadow-[0_0_10px_rgba(255,255,255,0.8)] "
                        : "hover:shadow-[0_0_8px_rgba(0,0,0,0.3)] hover:dark:shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    } rounded-xl`,
                    onClick: () => handleStepClick(idx),
                  },
                }}
                optional={
                  failed ? (
                    <Typography variant="caption" color="error">
                      {t("missingInformation")}
                    </Typography>
                  ) : undefined
                }>
                {t(label)}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    ),
    [activeStep, failedSteps, t, handleStepClick]
  );

  if (downloadUrl) {
    return (
      <div className="flex flex-col items-center gap-6 justify-center min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
        <div className=" text-center">
          <Typography variant="h5">
            Your application has been submitted successfully!
          </Typography>
        </div>
        <Button variant="contained" color="primary" href="/">
          Start over
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col p-8 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Stepper */}
      <div>{stepperBar}</div>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow-md ">
        <div className="flex flex-row gap-4 items-center justify-between  ">
          <h1 className="text-xl font-bold mb-4 dark:text-white">
            {t("appTitle")}
          </h1>
          <LocaleSwitcher />
          <Image
            src={rcj_transport.src}
            alt="Logo"
            width={0}
            height={0}
            sizes="100vw"
            className=" mb-2  w-[150px]   aspect-video"
          />
        </div>

        {/* Business Information */}
        {activeStep === 0 && (
          <PersonalInformation
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            handleChange={handleChange}
            handleDriversLicenseChange={handleDriversLicenseChange}
            handleBlur={handleBlur}
            handleHomeAddressChange={handleHomeAddressChange}
            removeHomeAddress={removeHomeAddress}
            addHomeAddress={addHomeAddress}
            validateField={validateField}
          />
        )}

        {activeStep === 1 && (
          <DrivingExpereince
            formData={formData}
            errors={errors}
            handleBlur={handleBlur}
            handleDrivingExperienceChange={handleDrivingExperinceChange}
            addDrivingExperience={addDrivingExperience}
            removeDrivingExperience={removeDrivingExperience}
          />
        )}

        {/* Signature & Final Details */}
        {activeStep === 2 && (
          <AccidentRecordForm
            formData={formData}
            errors={errors}
            handleBlur={handleBlur}
            handleAccidentRecordChange={handleAccidentRecordChange}
            addAccidentRecord={addAccidentRecord}
            removeAccidentRecord={removeAccidentRecord}
          />
        )}
        {activeStep === 3 && (
          <TrafficConvictionsForm
            formData={formData}
            errors={errors}
            handleBlur={handleBlur}
            handleTrafficConvictionChange={handleTrafficConvictionsChange}
            addTrafficConviction={addTrafficConviction}
            removeTrafficConviction={removeTrafficConviction}
          />
        )}
        {activeStep === 4 && (
          <EmploymentHistoryForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleEmploymentHistoryChange={handleEmploymentHistoryChange}
            addEmploymentHistory={addEmploymentHistory}
            removeEmploymentHistory={removeEmploymentHistory}
          />
        )}
        {activeStep === 5 && (
          <CriminalBackground
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            validateField={validateField}
          />
        )}
        {activeStep === 6 && (
          <FinalStep
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            sigCanvas={sigCanvas}
            validateField={validateField}
          />
        )}
        <div className="w-full  justify-end flex ">
          <div className="w-full mt-5">
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                {t("back")}
              </Button>
            )}
          </div>
          <div className="w-full mt-5 flex justify-end">
            {activeStep < steps.length - 1 ? (
              <Button onClick={handleNext} variant="contained">
                {t("next")}
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    driverFormSchema.validate(formData, { abortEarly: false })
                      .error !== undefined && sigCanvas.current !== null
                  }
                  loading={isLoading}>
                  {t("submit")}
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreditApplicationForm;
