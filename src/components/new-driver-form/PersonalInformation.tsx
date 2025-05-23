import { US_STATES } from "@/constants/usStates";
import { Address, NewDriverForm } from "@/types/newDriverForm";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { MuiTelInput } from "mui-tel-input";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { PlusIcon } from "../icons/PlusIcon";

interface PersonalInformationProps {
  formData: NewDriverForm;
  setFormData: React.Dispatch<React.SetStateAction<NewDriverForm>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleDriversLicenseChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    driversLicense: keyof Pick<NewDriverForm, "driversLicense">
  ) => void;
  handleBlur: (field: string) => void;
  handleHomeAddressChange: (
    index: number,
    field: keyof Address,
    value: string | boolean
  ) => void;
  removeHomeAddress: (index: number) => void;
  addHomeAddress: () => void;
  validateField: (field: string, updatedData: NewDriverForm) => void;
}
const PersonalInformation = ({
  formData,
  setFormData,
  errors,
  setErrors,
  handleChange,
  handleDriversLicenseChange,
  handleBlur,
  handleHomeAddressChange,
  removeHomeAddress,
  addHomeAddress,
  validateField,
}: PersonalInformationProps) => {
  const { t } = useTranslation();

  const coversThreeYears = useMemo(() => {
    const cutoff = dayjs().subtract(3, "year");
    const now = dayjs().endOf("day");
    // Sum up only the months that lie within [cutoff … now]
    const coveredMonths = formData.physicalAddress
      .map(({ from, to }) => {
        const fromDate = dayjs(from, "L").startOf("day");
        const toDate = dayjs(to, "L").endOf("day");
        // if invalid or entirely before cutoff, ignore it
        if (
          !fromDate.isValid() ||
          !toDate.isValid() ||
          toDate.isBefore(cutoff)
        ) {
          return 0;
        }
        // clamp the range into [cutoff, now]
        const start = fromDate.isBefore(cutoff) ? cutoff : fromDate;
        const end = toDate.isAfter(now) ? now : toDate;
        return end.diff(start, "month", true);
      })
      .reduce((sum, m) => sum + m, 0);
    return coveredMonths >= 36;
  }, [formData.physicalAddress]);

  const canAddAddress = useMemo(() => {
    if (coversThreeYears) return false;

    return formData.physicalAddress.every((addr) => {
      // all required strings non-empty
      const hasText =
        addr.street.trim() !== "" &&
        addr.city.trim() !== "" &&
        addr.state.trim() !== "" &&
        addr.zip.trim() !== "";
      // valid dates and from ≤ to
      const from = dayjs(addr.from, "L");
      const to = dayjs(addr.to, "L");
      const validDates = from.isValid() && to.isValid() && !to.isBefore(from);
      return hasText && validDates;
    });
  }, [formData.physicalAddress, coversThreeYears]);

  useEffect(() => {
    if (!canAddAddress) {
      setErrors((prev: Record<string, string>) => {
        const { physicalAddress, ...rest } = prev;
        return rest;
      });
    }
  }, [canAddAddress]);

  return (
    <section className="mb-6">
      <h2 className="font-semibold mb-2 dark:text-white">
        {t("personalInformation")}
      </h2>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="flex flex-col sm:flex-row items-start w-full gap-4">
          <TextField
            size="medium"
            error={
              errors.firstName !== undefined && errors.firstName.length > 0
            }
            id="firstName-input"
            name="firstName"
            label={t("firstName")}
            value={formData.firstName}
            onChange={handleChange}
            onBlur={() => handleBlur("firstName")}
            helperText={errors.firstName}
            className="w-full"
          />
          <TextField
            size="medium"
            error={errors.lastName !== undefined && errors.lastName.length > 0}
            id="lastName-input"
            name="lastName"
            label={t("lastName")}
            value={formData.lastName}
            onChange={handleChange}
            onBlur={() => handleBlur("lastName")}
            helperText={errors.lastName}
            className="w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start w-full gap-4">
          <TextField
            value={formData.socialSecurity}
            name="socialSecurity"
            label="Social Security Number"
            onChange={handleChange}
            onBlur={() => handleBlur("socialSecurity")}
            className="w-full p-2 border rounded max-w-[416px]"
            error={
              errors.socialSecurity !== undefined &&
              errors.socialSecurity.length > 0
            }
            helperText={errors.socialSecurity}
          />
          <FormControl
            className="w-full max-w-44"
            error={
              errors.dateOfBirth !== undefined && errors.dateOfBirth.length > 0
            }>
            <DatePicker
              value={dayjs(formData.dateOfBirth)}
              name="dateOfBirth"
              label={t("dateOfBirth")}
              onChange={(value) => {
                const updatedForm = {
                  ...formData,
                  dateOfBirth: dayjs(value)?.format("L") ?? "",
                };
                setFormData(updatedForm);
                validateField("dateOfBirth", updatedForm);
              }}
              className="w-full max-w-44 bg-transparent [&>div]:dark:bg-transparent [&>div]:dark:hover:bg-slate-900 [&>div]:dark:focus-within:hover:bg-transparent [&>div>div>div>div[role='spinbutton']]:dark:text-white [&>div>span]:dark:text-white"
              disableFuture
              slotProps={{
                textField: {
                  helperText: errors.dateOfBirth,
                },
              }}
            />
          </FormControl>
        </div>
        <div className="flex flex-col sm:flex-row items-start w-full gap-4">
          <MuiTelInput
            label={t("phone")}
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e })}
            color="primary"
            defaultCountry="US"
            onBlur={() => handleBlur("phone")}
            error={errors.phone !== undefined && errors.phone.length > 0}
            helperText={errors.phone}
            className="w-full"
          />
          <MuiTelInput
            label={t("altPhone")}
            name="altPhone"
            value={formData.altPhone}
            onChange={(e) => setFormData({ ...formData, altPhone: e })}
            color="secondary"
            defaultCountry="US"
            onBlur={() => handleBlur("altPhone")}
            error={errors.altPhone !== undefined && errors.altPhone.length > 0}
            helperText={errors.fax}
            className="w-full"
          />
        </div>
      </div>
      {/* Drivers License */}
      <div className="mt-4">
        <h3 className="font-semibold dark:text-white">{t("driversLicense")}</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextField
            value={formData.driversLicense.number}
            label={t("dlNumber")}
            error={
              errors["driversLicense.number"] !== undefined &&
              errors["driversLicense.number"].length > 0
            }
            name="number"
            onChange={(e) => handleDriversLicenseChange(e, "driversLicense")}
            onBlur={() => handleBlur("driversLicense.number")}
            className="w-full p-2 border rounded"
            helperText={errors["driversLicense.number"]}
          />

          <FormControl
            error={
              errors["driversLicense.state"] !== undefined &&
              errors["driversLicense.state"].length > 0
            }>
            <InputLabel id="driversLicense-state-label">State</InputLabel>
            <Select
              labelId="driversLicense-state-label"
              id="driversLicense-state-select"
              label={t("state")}
              name="driversLicenseState"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  driversLicense: {
                    ...formData.driversLicense,
                    state: e.target.value,
                  },
                })
              }
              onBlur={() => handleBlur("driversLicense.state")}
              value={formData.driversLicense.state}
              error={
                errors["driversLicense.state"] !== undefined &&
                errors["driversLicense.state"].length > 0
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
            <FormHelperText>{errors["driversLicense.state"]}</FormHelperText>
          </FormControl>
          <TextField
            value={formData.driversLicense.class}
            name="class"
            label={t("class")}
            onChange={(e) => handleDriversLicenseChange(e, "driversLicense")}
            onBlur={() => handleBlur("driversLicense.class")}
            className="w-full p-2 border rounded"
            error={
              errors["driversLicense.class"] !== undefined &&
              errors["driversLicense.class"].length > 0
            }
            helperText={errors["driversLicense.class"]}
          />
          <FormControl
            className="w-full max-w-44"
            error={
              errors["driversLicense.expDate"] !== undefined &&
              errors["driversLicense.expDate"].length > 0
            }>
            <DatePicker
              value={dayjs(formData.driversLicense.expDate)}
              name="expDate"
              label={t("expDate")}
              onChange={(value) => {
                const updatedForm = {
                  ...formData,
                  driversLicense: {
                    ...formData.driversLicense,
                    expDate: dayjs(value)?.format("L") ?? "",
                  },
                };
                setFormData(updatedForm);
                validateField("driversLicense.expDate", updatedForm);
              }}
              className="w-full max-w-44 bg-transparent [&>div]:dark:bg-transparent [&>div]:dark:hover:bg-slate-900 [&>div]:dark:focus-within:hover:bg-transparent [&>div>div>div>div[role='spinbutton']]:dark:text-white [&>div>span]:dark:text-white"
              disablePast
              slotProps={{
                textField: {
                  helperText: errors["driversLicense.expDate"],
                },
              }}
            />
          </FormControl>
        </div>
      </div>

      {/*Home Address*/}
      <div className="mt-4 flex flex-col gap-3">
        <h3 className="font-semibold dark:text-white">{t("homeAddress")}</h3>
        {formData.physicalAddress.map((addr, idx) => (
          <div
            key={`physicalAddress-${idx}`}
            className="flex flex-col gap-2 w-full dark:border-gray-500 border-gray-800 rounded-md border p-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                value={addr.street}
                label={t("street")}
                error={
                  errors[`physicalAddress.${idx}.street`] !== undefined &&
                  errors[`physicalAddress.${idx}.street`].length > 0
                }
                name="street"
                onChange={(e) =>
                  handleHomeAddressChange(idx, "street", e.target.value)
                }
                onBlur={() => handleBlur(`physicalAddress.${idx}.street`)}
                className="w-full p-2 border rounded"
                helperText={errors[`physicalAddress.${idx}.street`]}
              />

              <TextField
                value={addr.city}
                name="city"
                label={t("city")}
                onChange={(e) =>
                  handleHomeAddressChange(idx, "city", e.target.value)
                }
                onBlur={() => handleBlur(`physicalAddress.${idx}.city`)}
                className="w-full p-2 border rounded"
                error={
                  errors[`physicalAddress.${idx}.city`] !== undefined &&
                  errors[`physicalAddress.${idx}.city`].length > 0
                }
                helperText={errors[`physicalAddress.${idx}.city`]}
              />
              <FormControl
                error={
                  errors[`physicalAddress.${idx}.state`] !== undefined &&
                  errors[`physicalAddress.${idx}.state`].length > 0
                }>
                <InputLabel id="physicalAddress-state-label">State</InputLabel>
                <Select
                  labelId="physicalAddress-state-label"
                  id="physicalAddress-state-select"
                  label={t("state")}
                  name="homeState"
                  onChange={(e) =>
                    handleHomeAddressChange(idx, "state", e.target.value)
                  }
                  onBlur={() => handleBlur(`physicalAddress.${idx}.state`)}
                  value={addr.state}
                  error={
                    errors[`physicalAddress.${idx}.state`] !== undefined &&
                    errors[`physicalAddress.${idx}.state`].length > 0
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
                  {errors[`physicalAddress.${idx}.state`]}
                </FormHelperText>
              </FormControl>
              <TextField
                value={addr.zip}
                name="zip"
                label={t("zip")}
                onChange={(e) =>
                  handleHomeAddressChange(idx, "zip", e.target.value)
                }
                onBlur={() => handleBlur(`physicalAddress.${idx}.zip`)}
                error={
                  errors[`physicalAddress.${idx}.zip`] !== undefined &&
                  errors[`physicalAddress.${idx}.zip`].length > 0
                }
                helperText={errors[`physicalAddress.${idx}.zip`]}
              />
              <FormControl className="w-full max-w-44">
                <DatePicker
                  label={t("from")}
                  value={dayjs(addr.from)}
                  maxDate={dayjs(formData.physicalAddress[idx].to)}
                  onChange={(value) => {
                    handleHomeAddressChange(
                      idx,
                      "from",
                      dayjs(value).format("L")
                    );
                  }}
                  slotProps={{
                    textField: {
                      helperText: errors[`physicalAddress.${idx}.from`],
                    },
                  }}
                />
              </FormControl>
              <FormControl className="w-full max-w-44">
                <DatePicker
                  label={t("to")}
                  minDate={dayjs(formData.physicalAddress[idx].from)}
                  value={dayjs(addr.to)}
                  onChange={(value) => {
                    handleHomeAddressChange(
                      idx,
                      "to",
                      dayjs(value).format("L")
                    );
                  }}
                  slotProps={{
                    textField: {
                      helperText: errors[`physicalAddress.${idx}.to`],
                    },
                  }}
                />
              </FormControl>
            </div>
            {formData.physicalAddress.length > 1 && (
              <Button
                key={`physicalAddres.${idx}-delete-button`}
                className="self-end w-fit "
                title="Delete"
                color="error"
                variant="outlined"
                onClick={() => removeHomeAddress(idx)}>
                <DeleteIcon />
              </Button>
            )}
          </div>
        ))}
        {canAddAddress && (
          <div className="flex flex-row justify-between">
            {!coversThreeYears && (
              <Typography color="error" variant="body2">
                {errors.physicalAddress}
              </Typography>
            )}
            <Button
              className="p-2"
              color="secondary"
              variant="contained"
              onClick={addHomeAddress}>
              <PlusIcon /> <span>{t("addMore")}</span>
            </Button>
          </div>
        )}
      </div>
      {/* Emergency Contact */}
      <div className="mt-4">
        <h3 className="font-semibold dark:text-white">
          {t("emergencyContact")}
        </h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TextField
            value={formData.emergencyContact.name}
            label={t("emergencyContact")}
            error={
              errors["emergencyContact.name"] !== undefined &&
              errors["emergencyContact.name"].length > 0
            }
            name="emergencyContact.name"
            onChange={(e) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  name: e.target.value,
                },
              })
            }
            onBlur={() => handleBlur("emergencyContact.name")}
            className="w-full p-2 border rounded"
            helperText={errors["emergencyContact.name"]}
          />
          <MuiTelInput
            label={t("phone")}
            name="emergencyContact.phone"
            value={formData.emergencyContact.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                emergencyContact: { ...formData.emergencyContact, phone: e },
              })
            }
            color="primary"
            defaultCountry="US"
            onBlur={() => handleBlur("emergencyContact.phone")}
            error={
              errors["emergencyContact.phone"] !== undefined &&
              errors["emergencyContact.phone"].length > 0
            }
            helperText={errors["emergencyContact.phone"]}
            className="w-full"
          />

          <TextField
            value={formData.emergencyContact.relationship}
            name="relationship"
            label={t("relationship")}
            onChange={(e) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  relationship: e.target.value,
                },
              })
            }
            onBlur={() => handleBlur("emergencyContact.relationship")}
            error={
              errors["emergencyContact.relationship"] !== undefined &&
              errors["emergencyContact.relationship"].length > 0
            }
            helperText={errors["emergencyContact.relationship"]}
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalInformation;
