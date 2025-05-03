import { AccidentRecord, NewDriverForm } from "@/types/newDriverForm";
import { Button, FormControl, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ExpiredWarningIcon } from "../icons/ExpiredWarningIcon";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "../icons/PlusIcon";
import { DeleteIcon } from "../icons/DeleteIcon";

interface AccidentRecordProps {
  formData: NewDriverForm;
  errors: Record<string, string>;
  handleBlur: (field: string) => void;
  handleAccidentRecordChange: (
    index: number,
    field: keyof AccidentRecord,
    value: string | Dayjs
  ) => void;
  addAccidentRecord: () => void;
  removeAccidentRecord: (index: number) => void;
}
const AccidentRecordForm = ({
  formData,
  errors,
  handleBlur,
  handleAccidentRecordChange,
  addAccidentRecord,
  removeAccidentRecord,
}: AccidentRecordProps) => {
  const { t } = useTranslation("common");
  return (
    <>
      {/* Driving Experience */}
      <section className="flex flex-col gap-2 h-full flex-1 min-h-[400px]">
        <h2 className="font-semibold mb-2 dark:text-white">
          {t("accidentrecord")}
        </h2>
        {formData.accidentRecord.length === 0 ? (
          <div className="dark:text-indigo-400 text-indigo-500 mb-8 flex flex-row gap-2 items-center">
            <ExpiredWarningIcon stroke="#6366f1" />
            <span>{t("skip")}</span>
          </div>
        ) : (
          <>
            {formData.accidentRecord.map((ref, index) => (
              <div
                key={index}
                className=" flex flex-col gap-4 dark:border-gray-500 border-gray-800 rounded-md border p-4 ">
                <div className="flex flex-col sm:flex-row gap-2">
                  <FormControl
                    className="w-full max-w-44"
                    error={
                      errors[`accidentRecord.${index}.accidentDate`] !==
                        undefined &&
                      errors[`accidentRecord.${index}.accidentDate`].length > 0
                    }>
                    <DatePicker
                      value={dayjs(formData.accidentRecord[index].accidentDate)}
                      label={t("accidentDate")}
                      onChange={(value) =>
                        handleAccidentRecordChange(
                          index,
                          "accidentDate",
                          dayjs(value)?.format("L") ?? ""
                        )
                      }
                      className="w-full max-w-44 bg-transparent [&>div]:dark:bg-transparent [&>div]:dark:hover:bg-slate-900 [&>div]:dark:focus-within:hover:bg-transparent [&>div>div>div>div[role='spinbutton']]:dark:text-white [&>div>span]:dark:text-white"
                      slotProps={{
                        textField: {
                          helperText:
                            errors[`accidentRecord.${index}.accidentDate`],
                        },
                      }}
                    />
                  </FormControl>
                  <TextField
                    label={t("accidentType")}
                    value={ref.accidentType}
                    onChange={(e) =>
                      handleAccidentRecordChange(
                        index,
                        "accidentType",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`accidentRecord.${index}.accidentType`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`accidentRecord.${index}.accidentType`] !==
                        undefined &&
                      errors[`accidentRecord.${index}.accidentType`].length > 0
                    }
                    helperText={errors[`accidentRecord.${index}.accidentType`]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <TextField
                    label={t("fatalities")}
                    value={ref.fatalities}
                    onChange={(e) =>
                      handleAccidentRecordChange(
                        index,
                        "fatalities",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`accidentRecord.${index}.fatalities`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`accidentRecord.${index}.fatalities`] !==
                        undefined &&
                      errors[`accidentRecord.${index}.fatalities`].length > 0
                    }
                    helperText={errors[`accidentRecord.${index}.fatalities`]}
                  />
                  <TextField
                    label={t("injuries")}
                    value={ref.injuries}
                    onChange={(e) =>
                      handleAccidentRecordChange(
                        index,
                        "injuries",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`accidentRecord.${index}.injuries`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`accidentRecord.${index}.injuries`] !==
                        undefined &&
                      errors[`accidentRecord.${index}.injuries`].length > 0
                    }
                    helperText={errors[`accidentRecord.${index}.injuries`]}
                  />
                </div>
                <Button
                  className="w-fit self-end"
                  title="Delete"
                  key={`accidentRecord.${index}-delete-button`}
                  color="error"
                  variant="outlined"
                  onClick={() => removeAccidentRecord(index)}>
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </>
        )}
        <Button
          className={`max-w-44 ${
            !formData.accidentRecord.length ? "self-center" : "self-end"
          }`}
          color="secondary"
          variant="outlined"
          onClick={addAccidentRecord}>
          <PlusIcon />
          <span>
            {!formData.accidentRecord.length ? t("begin") : t("addMore")}
          </span>
        </Button>
      </section>
    </>
  );
};

export default AccidentRecordForm;
