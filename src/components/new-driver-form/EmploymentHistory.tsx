import { US_STATES } from "@/constants/usStates";
import { EmploymentHistory, NewDriverForm } from "@/types/newDriverForm";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { MuiTelInput } from "mui-tel-input";
import { ExpiredWarningIcon } from "../icons/ExpiredWarningIcon";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";
import { PlusIcon } from "../icons/PlusIcon";
import { DeleteIcon } from "../icons/DeleteIcon";

interface EmploymentHistoryProps {
  formData: NewDriverForm;
  setFormData: React.Dispatch<React.SetStateAction<NewDriverForm>>;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (field: string) => void;
  handleEmploymentHistoryChange: (
    index: number,
    field: keyof EmploymentHistory,
    value: string | boolean
  ) => void;
  addEmploymentHistory: () => void;
  removeEmploymentHistory: (index: number) => void;
}
const EmploymentHistoryForm = ({
  formData,
  setFormData,
  errors,
  handleBlur,
  handleEmploymentHistoryChange,
  addEmploymentHistory,
  removeEmploymentHistory,
}: EmploymentHistoryProps) => {
  const { t } = useTranslation("common");

  const canAddHistory = useMemo(() => {
    // if empty, we want the “Begin” button
    if (formData.employmentHistory.length === 0) return false;

    const last =
      formData.employmentHistory[formData.employmentHistory.length - 1];
    const requiredTextFields = [
      last.companyName,
      last.contactPerson,
      last.phone,
      last.street,
      last.city,
      last.state,
      last.zip,
      last.position,
    ].every((v) => v && v.trim() !== "");

    // date fields must parse and “from <= to”
    const from = dayjs(last.from, "L");
    const to = dayjs(last.to, "L");
    const validDates = from.isValid() && to.isValid() && !to.isBefore(from);

    // the two checkboxes are always boolean, so we don’t gate on them

    return requiredTextFields && validDates;
  }, [formData.employmentHistory]);

  const hasTenYears = useMemo(() => {
    const endDates = formData.employmentHistory
      .map((eh) => dayjs(eh.from, "L"))
      .filter((d) => d.isValid());
    if (endDates.length === 0) return false;
    // find the oldest (earliest) end date
    const oldestEnd = endDates.reduce(
      (min, d) => (d.isBefore(min) ? d : min),
      endDates[0]
    );
    // compare against today minus 10 years
    return oldestEnd.isBefore(dayjs().subtract(10, "year"));
  }, [formData.employmentHistory]);

  // 2) detect any gaps ≥ 3 months between sorted employments
  const gaps: Record<string, string> = {};
  if (formData.employmentHistory.length >= 2) {
    for (let i = 0; i < formData.employmentHistory.length - 1; i++) {
      const current = formData.employmentHistory[i];
      const prev = formData.employmentHistory[i + 1];
      const to = dayjs(prev.to, "L");
      const from = dayjs(current.from, "L");
      if (to.isValid() && from.isValid()) {
        const monthsGap = from.diff(to, "month");
        if (monthsGap >= 3) {
          const key = `${dayjs(to)?.format("L")} - ${dayjs(from)?.format("L")}`;
          gaps[key] = formData.employmentGapExplanations?.[key] || "";
        }
      }
    }
  }

  const gapKeys = Object.keys(gaps);

  // whenever the set of gaps changes, prune stale explanations
  useEffect(() => {
    setFormData((fd) => {
      const cleaned = Object.fromEntries(
        gapKeys.map((k) => [k, fd.employmentGapExplanations[k] || ""])
      );
      // only update if something actually changed
      if (
        JSON.stringify(cleaned) !== JSON.stringify(fd.employmentGapExplanations)
      ) {
        return { ...fd, employmentGapExplanations: cleaned };
      }
      return fd;
    });
  }, [gapKeys.join("|") /* or gapKeys.length + gapKeys.join() */]);

  return (
    <>
      {/* Employment History */}
      <section className="flex flex-col gap-8 min-h-[400px]">
        <h2 className="font-semibold  dark:text-white">{t("emplHistory")}</h2>
        <div className="dark:text-indigo-400 text-indigo-500 mb-4 flex flex-row gap-2">
          <ExpiredWarningIcon stroke="#6366f1" className=" shrink-0" />
          <p className="text-sm">
            {t("emplInfo1")}{" "}
            <Tooltip title={<span className="s">{t("emplInfoHint")}</span>}>
              <span className="underline cursor-help inline-block">
                {t("emplInfo2")}
              </span>
            </Tooltip>
            {t("emplInfo3")}
          </p>
        </div>

        {formData.employmentHistory.map((ref, index) => (
          <div
            key={index}
            className=" flex flex-col gap-4 dark:border-gray-500 border-gray-800 rounded-md border p-4 ">
            <TextField
              label={t("companyName")}
              value={ref.companyName}
              onChange={(e) =>
                handleEmploymentHistoryChange(
                  index,
                  "companyName",
                  e.target.value
                )
              }
              onBlur={() =>
                handleBlur(`employmentHistory.${index}.companyName`)
              }
              className="w-full p-2 border rounded mb-2"
              error={
                errors[`employmentHistory.${index}.companyName`] !==
                  undefined &&
                errors[`employmentHistory.${index}.companyName`].length > 0
              }
              helperText={errors[`employmentHistory.${index}.companyName`]}
            />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  label={t("contactPerson")}
                  value={ref.contactPerson}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "contactPerson",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur(`employmentHistory.${index}.contactPerson`)
                  }
                  className="w-full p-2 border rounded"
                  error={
                    errors[`employmentHistory.${index}.contactPerson`] !==
                      undefined &&
                    errors[`employmentHistory.${index}.contactPerson`].length >
                      0
                  }
                  helperText={
                    errors[`employmentHistory.${index}.contactPerson`]
                  }
                />
                <MuiTelInput
                  label="Phone"
                  name={t("phone")}
                  value={ref.phone}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(index, "phone", e)
                  }
                  color="primary"
                  defaultCountry="US"
                  onBlur={() => handleBlur(`employmentHistory.${index}.phone`)}
                  error={
                    errors[`employmentHistory.${index}.phone`] !== undefined &&
                    errors[`employmentHistory.${index}.phone`].length > 0
                  }
                  helperText={errors[`employmentHistory.${index}.phone`]}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <TextField
                    label={t("street")}
                    value={ref.street}
                    onChange={(e) =>
                      handleEmploymentHistoryChange(
                        index,
                        "street",
                        e.target.value
                      )
                    }
                    onBlur={() =>
                      handleBlur(`employmentHistory.${index}.street`)
                    }
                    className="w-full p-2 border rounded"
                    error={
                      errors[`employmentHistory.${index}.street`] !==
                        undefined &&
                      errors[`employmentHistory.${index}.street`].length > 0
                    }
                    helperText={errors[`employmentHistory.${index}.street`]}
                  />
                  <TextField
                    label={t("city")}
                    value={ref.city}
                    onChange={(e) =>
                      handleEmploymentHistoryChange(
                        index,
                        "city",
                        e.target.value
                      )
                    }
                    onBlur={() => handleBlur(`employmentHistory.${index}.city`)}
                    className="w-full p-2 border rounded"
                    error={
                      errors[`employmentHistory.${index}.city`] !== undefined &&
                      errors[`employmentHistory.${index}.city`].length > 0
                    }
                    helperText={errors[`employmentHistory.${index}.city`]}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormControl
                    className="w-full"
                    error={
                      errors[`employmentHistory.${index}.state`] !==
                        undefined &&
                      errors[`employmentHistory.${index}.state`].length > 0
                    }>
                    <InputLabel id={`employmentHistory.${index}-state-label`}>
                      State
                    </InputLabel>
                    <Select
                      labelId={`employmentHistory.${index}-state-label`}
                      id={`employmentHistory.${index}-state-select`}
                      label={t("state")}
                      name="state"
                      onChange={(e) =>
                        handleEmploymentHistoryChange(
                          index,
                          "state",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleBlur(`employmentHistory.${index}.state`)
                      }
                      value={ref.state}
                      error={
                        errors[`employmentHistory.${index}.state`] !==
                          undefined &&
                        errors[`employmentHistory.${index}.state`].length > 0
                      }>
                      <MenuItem value="">
                        <em>Select state</em>
                      </MenuItem>
                      {US_STATES.map((state) => (
                        <MenuItem key={state.value} value={state.value}>
                          {state.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors[`employmentHistory.${index}.state`]}
                    </FormHelperText>
                  </FormControl>

                  <TextField
                    label={t("zip")}
                    value={ref.zip}
                    onChange={(e) =>
                      handleEmploymentHistoryChange(
                        index,
                        "zip",
                        e.target.value
                      )
                    }
                    onBlur={() => handleBlur(`employmentHistory.${index}.zip`)}
                    className="w-full p-2 border rounded"
                    error={
                      errors[`employmentHistory.${index}.zip`] !== undefined &&
                      errors[`employmentHistory.${index}.zip`].length > 0
                    }
                    helperText={errors[`employmentHistory.${index}.zip`]}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 ">
                <TextField
                  label={t("position")}
                  value={ref.position}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "position",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur(`employmentHistory.${index}.position`)
                  }
                  className="w-full p-2 border rounded"
                  error={
                    errors[`employmentHistory.${index}.position`] !==
                      undefined &&
                    errors[`employmentHistory.${index}.position`].length > 0
                  }
                  helperText={errors[`employmentHistory.${index}.position`]}
                />
                <FormControl
                  className="w-full sm:max-w-44"
                  error={
                    errors[`employmentHistory.${index}.from`] !== undefined &&
                    errors[`employmentHistory.${index}.from`].length > 0
                  }>
                  <DatePicker
                    value={dayjs(formData.employmentHistory[index].from)}
                    label={t("from")}
                    onChange={(value) =>
                      handleEmploymentHistoryChange(
                        index,
                        "from",
                        dayjs(value)?.format("L") ?? ""
                      )
                    }
                    className="w-full sm:max-w-44 bg-transparent [&>div]:dark:bg-transparent [&>div]:dark:hover:bg-slate-900 [&>div]:dark:focus-within:hover:bg-transparent [&>div>div>div>div[role='spinbutton']]:dark:text-white [&>div>span]:dark:text-white"
                    slotProps={{
                      textField: {
                        helperText: errors[`employmentHistory.${index}.from`],
                      },
                    }}
                  />
                </FormControl>
                <FormControl
                  className="w-full sm:max-w-44"
                  error={
                    errors[`employmentHistory.${index}.to`] !== undefined &&
                    errors[`employmentHistory.${index}.to`].length > 0
                  }>
                  <DatePicker
                    value={dayjs(formData.employmentHistory[index].to)}
                    label={t("to")}
                    onChange={(value) =>
                      handleEmploymentHistoryChange(
                        index,
                        "to",
                        dayjs(value)?.format("L") ?? ""
                      )
                    }
                    className="w-full sm:max-w-44 bg-transparent [&>div]:dark:bg-transparent [&>div]:dark:hover:bg-slate-900 [&>div]:dark:focus-within:hover:bg-transparent [&>div>div>div>div[role='spinbutton']]:dark:text-white [&>div>span]:dark:text-white"
                    slotProps={{
                      textField: {
                        helperText: errors[`employmentHistory.${index}.to`],
                      },
                    }}
                  />
                </FormControl>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <TextField
                  label={t("reasonLeave")}
                  value={ref.leaveReason}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "leaveReason",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur(`employmentHistory.${index}.leaveReason`)
                  }
                  className="w-full p-2 border rounded"
                  error={
                    errors[`employmentHistory.${index}.leaveReason`] !==
                      undefined &&
                    errors[`employmentHistory.${index}.leaveReason`].length > 0
                  }
                  helperText={errors[`employmentHistory.${index}.leaveReason`]}
                />
                <TextField
                  label={t("trailerType")}
                  value={ref.trailerType}
                  onChange={(e) =>
                    handleEmploymentHistoryChange(
                      index,
                      "trailerType",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur(`employmentHistory.${index}.trailerType`)
                  }
                  className="w-full p-2 border rounded"
                  error={
                    errors[`employmentHistory.${index}.trailerType`] !==
                      undefined &&
                    errors[`employmentHistory.${index}.trailerType`].length > 0
                  }
                  helperText={errors[`employmentHistory.${index}.trailerType`]}
                />
              </div>

              <FormControlLabel
                className="dark:text-white !w-full [&>span:nth-child(2)]:w-full !ml-0"
                control={<Checkbox />}
                label={
                  <div className="flex flex-row gap-1 items-center">
                    <span>{t("subjectFMCSR")}</span>
                    <Tooltip
                      title={
                        <div className="flex flex-row gap-2 m-auto">
                          <span className="text-sm">
                            {t("subjectFMCSRInfo")}
                          </span>
                        </div>
                      }>
                      <div>
                        <ExpiredWarningIcon
                          stroke="#6366f1"
                          className=" shrink-0 cursor-help"
                        />
                      </div>
                    </Tooltip>
                  </div>
                }
                labelPlacement="start"
                name="fmcsrSubject"
                checked={ref.fmcsrSubject}
                onChange={(e) =>
                  handleEmploymentHistoryChange(
                    index,
                    "fmcsrSubject",
                    (e.target as HTMLInputElement).checked
                  )
                }
                onBlur={() =>
                  handleBlur(`employmentHistory.${index}.fmcsrSubject`)
                }
              />

              <FormControlLabel
                className="dark:text-white !w-full !ml-0 "
                control={<Checkbox />}
                label={
                  <div className="flex flex-row gap-1 items-center">
                    <span>{t("dotRegulated")}</span>
                  </div>
                }
                labelPlacement="start"
                name="dotDrugTestRegulated"
                checked={ref.dotDrugTestRegulated}
                onChange={(e) =>
                  handleEmploymentHistoryChange(
                    index,
                    "dotDrugTestRegulated",
                    (e.target as HTMLInputElement).checked
                  )
                }
                onBlur={() =>
                  handleBlur(`employmentHistory.${index}.dotDrugTestRegulated`)
                }
              />
            </div>

            <Button
              className="w-fit self-end"
              title="Delete"
              key={`employmentHistory.${index}-delete-button`}
              color="error"
              variant="outlined"
              onClick={() => removeEmploymentHistory(index)}>
              <DeleteIcon />
            </Button>
          </div>
        ))}

        {!hasTenYears && canAddHistory && (
          <div className="flex flex-row gap-4 justify-between">
            <Typography color="error" variant="body2">
              You must cover at least 10 years of history (oldest “from” date on
              or before {dayjs().subtract(10, "year").format("MM/DD/YYYY")})
            </Typography>
            <Button
              className="max-w-44 self-end"
              color="secondary"
              variant="contained"
              onClick={addEmploymentHistory}>
              <PlusIcon />
              <span>{t("addMore")}</span>
            </Button>
          </div>
        )}

        <>
          {Object.keys(gaps).length > 0 && (
            <>
              <Typography className="dark:text-white">
                {"Please explain any gaps > 3 months (optional)"}
              </Typography>
              <TableContainer component={Paper} className="mb-6">
                <Table size="small">
                  <TableHead>
                    <TableRow className="dark:text-white">
                      <TableCell>Gap</TableCell>
                      <TableCell>Explanation (optional)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(gaps).map(([gapKey, explanation]) => (
                      <TableRow key={gapKey}>
                        <TableCell className="w-[188px]">{gapKey}</TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={explanation}
                            onChange={(e) => {
                              const newMap = {
                                ...formData.employmentGapExplanations,
                                [gapKey]: e.target.value,
                              };
                              setFormData((fd) => ({
                                ...fd,
                                employmentGapExplanations: newMap,
                              }));
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
        {errors.employmentHistory && errors.employmentHistory.length > 0 && (
          <Typography variant="caption" color="error" fontSize={14}>
            {errors.employmentHistory}
          </Typography>
        )}
        {!formData.employmentHistory.length && (
          <Button
            className="max-w-44 self-center"
            color="secondary"
            variant="contained"
            onClick={addEmploymentHistory}>
            <span>{t("begin")}</span>
          </Button>
        )}
      </section>
    </>
  );
};

export default EmploymentHistoryForm;
