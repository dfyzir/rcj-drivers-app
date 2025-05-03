import { DrivingExperience, NewDriverForm } from "@/types/newDriverForm";

import { Button, TextField } from "@mui/material";
import { ExpiredWarningIcon } from "../icons/ExpiredWarningIcon";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "../icons/DeleteIcon";
import { PlusIcon } from "../icons/PlusIcon";

interface DrivingExperienceFormProps {
  formData: NewDriverForm;
  errors: Record<string, string>;
  handleBlur: (field: string) => void;
  handleDrivingExperienceChange: (
    index: number,
    field: keyof DrivingExperience,
    value: string
  ) => void;
  addDrivingExperience: () => void;
  removeDrivingExperience: (index: number) => void;
}
const DrivingExpereinceForm = ({
  formData,
  errors,
  handleBlur,
  handleDrivingExperienceChange,
  addDrivingExperience,
  removeDrivingExperience,
}: DrivingExperienceFormProps) => {
  const { t } = useTranslation("common");
  return (
    <>
      {/* Driving Experience */}
      <section className="flex flex-col gap-2 min-h-[400px]">
        <h2 className="font-semibold mb-2 dark:text-white">
          {t("drivingExp")}
        </h2>
        {formData.drivingExperience.length === 0 ? (
          <div className="dark:text-indigo-400 text-indigo-500 mb-8 items-center flex flex-row gap-2">
            <ExpiredWarningIcon stroke="#6366f1" />
            <span>{t("skip")}</span>
          </div>
        ) : (
          <>
            {formData.drivingExperience.map((ref, index) => (
              <div
                key={index}
                className=" flex flex-col gap-4 dark:border-gray-500 border-gray-800 rounded-md border p-4 ">
                <TextField
                  label={t("equipType")}
                  value={ref.equipmentType}
                  onChange={(e) =>
                    handleDrivingExperienceChange(
                      index,
                      "equipmentType",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur(`drivingExperience.${index}.equipmentType`)
                  }
                  className="w-full p-2 border rounded mb-2"
                  error={
                    errors[`drivingExperience.${index}.equipmentType`] !==
                      undefined &&
                    errors[`drivingExperience.${index}.equipmentType`].length >
                      0
                  }
                  helperText={
                    errors[`drivingExperience.${index}.equipmentType`]
                  }
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <TextField
                    label={t("expYears")}
                    value={ref.yearsOfExperience}
                    onChange={(e) =>
                      handleDrivingExperienceChange(
                        index,
                        "yearsOfExperience",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`drivingExperience.${index}.yearsOfExperience`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`drivingExperience.${index}.yearsOfExperience`] !==
                        undefined &&
                      errors[`drivingExperience.${index}.yearsOfExperience`]
                        .length > 0
                    }
                    helperText={
                      errors[`drivingExperience.${index}.yearsOfExperience`]
                    }
                  />

                  <TextField
                    label={t("miles")}
                    value={ref.milesDriven}
                    onChange={(e) =>
                      handleDrivingExperienceChange(
                        index,
                        "milesDriven",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`drivingExperience.${index}.milesDriven`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`drivingExperience.${index}.milesDriven`] !==
                        undefined &&
                      errors[`drivingExperience.${index}.milesDriven`].length >
                        0
                    }
                    helperText={
                      errors[`drivingExperience.${index}.milesDriven`]
                    }
                  />
                </div>
                <Button
                  className="w-fit self-end"
                  title="Delete"
                  key={`drivingExperience.${index}-delete-button`}
                  color="error"
                  variant="outlined"
                  onClick={() => removeDrivingExperience(index)}>
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </>
        )}

        <Button
          className={`max-w-44 ${
            !formData.drivingExperience.length ? "self-center" : "self-end"
          }`}
          color="secondary"
          variant="outlined"
          onClick={addDrivingExperience}>
          <PlusIcon />
          <span>
            {!formData.drivingExperience.length ? t("begin") : t("addMore")}
          </span>
        </Button>
      </section>
    </>
  );
};

export default DrivingExpereinceForm;
