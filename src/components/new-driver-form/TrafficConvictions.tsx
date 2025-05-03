import { NewDriverForm, TrafficConvictions } from "@/types/newDriverForm";
import { Button, FormControl, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ExpiredWarningIcon } from "../icons/ExpiredWarningIcon";
import { useTranslation } from "react-i18next";
import { DeleteIcon } from "../icons/DeleteIcon";
import { PlusIcon } from "../icons/PlusIcon";

interface TrafficConvictionProps {
  formData: NewDriverForm;
  errors: Record<string, string>;
  handleBlur: (field: string) => void;
  handleTrafficConvictionChange: (
    index: number,
    field: keyof TrafficConvictions,
    value: string | Dayjs
  ) => void;
  addTrafficConviction: () => void;
  removeTrafficConviction: (index: number) => void;
}
const TrafficConvictionsForm = ({
  formData,
  errors,
  handleBlur,
  handleTrafficConvictionChange,
  addTrafficConviction,
  removeTrafficConviction,
}: TrafficConvictionProps) => {
  const { t } = useTranslation("common");
  return (
    <>
      {/* Driving Experience */}
      <section className="flex flex-col gap-2 min-h-[400px]">
        <h2 className="font-semibold mb-2 dark:text-white">
          {t("trafficConv")}
        </h2>
        {formData.trafficConvictions.length === 0 ? (
          <div className="dark:text-indigo-400 text-indigo-500 mb-8 flex flex-row gap-2 items-center">
            <ExpiredWarningIcon stroke="#6366f1" />
            <span>{t("skip")}</span>
          </div>
        ) : (
          <>
            {" "}
            {formData.trafficConvictions.map((ref, index) => (
              <div
                key={index}
                className=" flex flex-col gap-4 dark:border-gray-500 border-gray-800 rounded-md border p-4 ">
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormControl
                    className="w-full max-w-44"
                    error={
                      errors[`trafficConvictions.${index}.convictionDate`] !==
                        undefined &&
                      errors[`trafficConvictions.${index}.convictionDate`]
                        .length > 0
                    }>
                    <DatePicker
                      value={dayjs(
                        formData.trafficConvictions[index].convictionDate
                      )}
                      label={t("date")}
                      onChange={(value) =>
                        handleTrafficConvictionChange(
                          index,
                          "convictionDate",
                          dayjs(value)?.format("L") ?? ""
                        )
                      }
                      className="w-full max-w-44 bg-transparent [&>div]:dark:bg-transparent [&>div]:dark:hover:bg-slate-900 [&>div]:dark:focus-within:hover:bg-transparent [&>div>div>div>div[role='spinbutton']]:dark:text-white [&>div>span]:dark:text-white"
                      slotProps={{
                        textField: {
                          helperText:
                            errors[
                              `trafficConvictions.${index}.convictionDate`
                            ],
                        },
                      }}
                    />
                  </FormControl>
                  <TextField
                    label={t("location")}
                    value={ref.location}
                    onChange={(e) =>
                      handleTrafficConvictionChange(
                        index,
                        "location",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`trafficConvictions.${index}.location`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`trafficConvictions.${index}.location`] !==
                        undefined &&
                      errors[`trafficConvictions.${index}.location`].length > 0
                    }
                    helperText={errors[`trafficConvictions.${index}.location`]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <TextField
                    label={t("charge")}
                    value={ref.charge}
                    onChange={(e) =>
                      handleTrafficConvictionChange(
                        index,
                        "charge",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`trafficConvictions.${index}.charge`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`trafficConvictions.${index}.charge`] !==
                        undefined &&
                      errors[`trafficConvictions.${index}.charge`].length > 0
                    }
                    helperText={errors[`trafficConvictions.${index}.charge`]}
                  />
                </div>
                <Button
                  className="w-fit self-end"
                  title="Delete"
                  key={`trafficConvictions.${index}-delete-button`}
                  color="error"
                  variant="outlined"
                  onClick={() => removeTrafficConviction(index)}>
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </>
        )}
        <Button
          className={`max-w-44 ${
            !formData.trafficConvictions.length ? "self-center" : "self-end"
          }`}
          color="secondary"
          variant="outlined"
          onClick={addTrafficConviction}>
          <PlusIcon />
          <span>
            {!formData.trafficConvictions.length ? t("begin") : t("addMore")}
          </span>
        </Button>
      </section>
    </>
  );
};

export default TrafficConvictionsForm;
