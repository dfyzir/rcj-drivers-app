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

import {
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

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
import LocaleSwitcher from "../buttons/LocaleSwitcher";
import merge from "lodash.merge";
const LOCAL_STORAGE_KEY = "NewDriverFormData";

const STORAGE_KEY = "NewDriverFormData";
const STORAGE_VERSION = 1;

const todayISO = format(new Date(), "yyyy-MM-dd");

const DEFAULT_FORM: NewDriverForm = {
  applicationType: "" as NewDriverForm["applicationType"],
  firstName: "",
  lastName: "",
  socialSecurity: "",
  dateOfBirth: "",
  driversLicense: { number: "", state: "", class: "", expDate: "" },
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
  emergencyContact: { name: "", phone: "", relationship: "" },
  employmentHistory: [],
  printedName: "",
  date: todayISO,
  signature: "",
  termsAgreed: false,
  deniedLicense: false,
  suspendedOrRevoked: false,
  deniedOrRevokedExplanation: "",
  isConvicted: false,
  convictedExplanation: "",
  employmentGapExplanations: {},
};

const STEP_KEY = "NewDriverFormActiveStep";

const CreditApplicationForm: React.FC = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewDriverForm>(() => {
    if (typeof window === "undefined") return DEFAULT_FORM;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_FORM;
      const parsed = JSON.parse(raw);
      const data = parsed?.v ? parsed.data : parsed;

      // deep-merge with defaults, so new fields get default values
      const merged = merge(structuredClone(DEFAULT_FORM), data);
      merged.signature = "";

      // validate and strip unknown keys
      const { value } = driverFormSchema.validate(merged, {
        abortEarly: false,
        stripUnknown: true,
      });

      return value as NewDriverForm;
    } catch (e) {
      console.warn("Failed to read stored form — using defaults", e);
      return DEFAULT_FORM;
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [missingOpen, setMissingOpen] = useState(false);
  const [missingSteps, setMissingSteps] = useState<
    { stepIdx: number; stepKey: string; count: number }[]
  >([]);

  const [activeStep, setActiveStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(STEP_KEY);
    return raw ? Number(raw) || 0 : 0;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STEP_KEY, String(activeStep));
  }, [activeStep]);

  // Map a Joi path to a step index
  const stepForPath = (path: string): number => {
    for (let i = 0; i < steps.length; i++) {
      const keys = keysByStep[i] ?? [];
      if (keys.some((k) => path === k || path.startsWith(k + "."))) return i;
    }
    return steps.length - 1; // fallback to last step
  };

  // avoid saving on very first commit of default/hydrated state
  const didHydrateRef = useRef(false);
  useEffect(() => {
    didHydrateRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !didHydrateRef.current) return;

    // optional: light debounce to reduce writes
    const { signature, ...persistable } = formData;
    const id = setTimeout(() => {
      const payload = { v: STORAGE_VERSION, data: persistable };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }, 150);

    return () => clearTimeout(id);
  }, [formData]);

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
      // keep per-field messages for inline helpers
      const fieldErrors: Record<string, string> = {};
      error.details.forEach((err) => {
        const key = err.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);

      // group by section only
      const stepCount = new Map<number, number>();
      error.details.forEach((err) => {
        const path = err.path.join(".");
        const idx = stepForPath(path);
        stepCount.set(idx, (stepCount.get(idx) ?? 0) + 1);
      });
      const grouped = Array.from(stepCount.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([stepIdx, count]) => ({
          stepIdx,
          stepKey: steps[stepIdx],
          count,
        }));

      setMissingSteps(grouped);
      setMissingOpen(true);
      setIsLoading(false);
      return; // stop submission
    }
    try {
      const pdfBytes = await generatePDF({ formData, sigCanvas });
      const timestamp = new Date().getTime();
      const fileName = `applications/drivers/${formData.firstName}_${formData.lastName}_RCJ_Driver_Application_${timestamp}.pdf`;
      await uploadData({
        path: fileName,
        data: pdfBytes,
        options: {
          contentType: "application/pdf",
          metadata: {
            appliedAt: formData.date,
            firstName: formData.firstName,
            lastName: formData.lastName,
            applicationType: formData.applicationType,
          },
        },
      }).result;
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      window.open(url, "_blank");
      // Reset form data.
      setFormData({
        ...DEFAULT_FORM,
        date: todayISO,
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating/uploading PDF:", err);
      setIsLoading(false);
    }
  };

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
          <Typography variant="h5">{t("submissionSuccessTitle")}</Typography>
        </div>
        <Button variant="contained" color="primary" href="/">
          {t("startOver")}
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
        <div className="flex flex-row gap-4 items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 dark:border-slate-400">
          <div className="flex flex-col sm:flex-row w-full justify-between">
            <h1 className="text-xl font-bold mb-4 dark:text-white">
              {t("appTitle")}
            </h1>
            <LocaleSwitcher />
          </div>
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
              <Button type="button" onClick={handleBack} variant="outlined">
                {t("back")}
              </Button>
            )}
          </div>
          <div className="w-full mt-5 flex justify-end">
            {activeStep < steps.length - 1 && (
              <Button type="button" onClick={handleNext} variant="contained">
                {t("next")}
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  loading={isLoading}>
                  {t("submit")}
                </Button>
              </>
            )}
          </div>
        </div>
        <Dialog
          open={missingOpen}
          onClose={() => setMissingOpen(false)}
          maxWidth="xs"
          fullWidth>
          <DialogTitle>{t("missingInformation")}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t("pleaseReviewTopNav")}
            </Typography>

            <List dense>
              {missingSteps.map((ms) => (
                <ListItemButton
                  key={ms.stepIdx}
                  onClick={() => {
                    setActiveStep(ms.stepIdx);
                    setMissingOpen(false);
                  }}>
                  <ListItemText
                    primary={t(ms.stepKey)}
                    secondary={t("issuesCount", {
                      defaultValue: "{{count}} item(s) to complete",
                      count: ms.count,
                    })}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setMissingOpen(false)}>
              {t("cancel")}
            </Button>
            {missingSteps.length > 0 && (
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setActiveStep(missingSteps[0].stepIdx);
                  setMissingOpen(false);
                }}>
                {t("begin")}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default CreditApplicationForm;
