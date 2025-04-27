import { NewDriverForm } from "@/types/newDriverForm";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface CriminalBackgroundProps {
  formData: NewDriverForm;
  setFormData: React.Dispatch<React.SetStateAction<NewDriverForm>>;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (field: string) => void;
  validateField: (field: string, updatedData: NewDriverForm) => void;
}
const CriminalBackground = ({
  formData,
  setFormData,
  errors,
  handleChange,
  handleBlur,
  validateField,
}: CriminalBackgroundProps) => {
  const { t } = useTranslation();
  return (
    <section className="mb-6 flex-col flex dark:text-white px-4">
      <h2 className="font-semibold mb-2 dark:text-white">{t("criminalBg")}</h2>
      <div className="flex flex-col gap-4 mt-4 items-start">
        <FormControl
          className="[&>label]:ml-0"
          error={
            errors.deniedLicense !== undefined &&
            errors.deniedLicense.length > 0
          }>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.deniedLicense}
                onChange={(e) => {
                  const updated = {
                    ...formData,
                    deniedLicense: e.target.checked,
                  };
                  setFormData(updated);
                  validateField("deniedLicense", updated);
                }}
                onBlur={() => handleBlur("deniedLicense")}
              />
            }
            labelPlacement="start"
            label={
              <Typography variant="body2" className="ml-0">
                {t("deniedLicenseLabel")}
              </Typography>
            }
          />
        </FormControl>
        <FormControl
          className="[&>label]:ml-0"
          error={
            errors.suspendedOrRevoked !== undefined &&
            errors.suspendedOrRevoked.length > 0
          }>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.suspendedOrRevoked}
                onChange={(e) => {
                  const updated = {
                    ...formData,
                    suspendedOrRevoked: e.target.checked,
                  };
                  setFormData(updated);
                  validateField("suspendedOrRevoked", updated);
                }}
                onBlur={() => handleBlur("suspendedOrRevoked")}
              />
            }
            labelPlacement="start"
            label={
              <Typography variant="body2">
                {t("suspendedOrRevokedLabel")}
              </Typography>
            }
          />
        </FormControl>
        {(formData.deniedLicense || formData.suspendedOrRevoked) && (
          <FormControl
            className="w-full max-w-[400px] [&>label]:!ml-0 [&>label]:!items-start"
            error={
              errors.deniedOrRevokedExplanation !== undefined &&
              errors.deniedOrRevokedExplanation.length > 0
            }>
            <FormControlLabel
              labelPlacement="top"
              label={
                <Typography variant="body2" className="pb-1">
                  {t("deniedOrSuspendedExplanationLabel")}
                </Typography>
              }
              control={
                <TextareaAutosize
                  id="deniedOrRevokedExplanation-input"
                  minRows={4}
                  name="deniedOrRevokedExplanation"
                  value={formData.deniedOrRevokedExplanation}
                  onChange={handleChange}
                  onBlur={() => handleBlur("deniedOrRevokedExplanation")}
                  className="w-full p-1  text-black dark:bg-gray-400"
                />
              }
            />
            {errors.deniedOrRevokedExplanation && (
              <Typography variant="caption" color="error">
                {errors.deniedOrRevokedExplanation}
              </Typography>
            )}
          </FormControl>
        )}
        <hr className="dark:bg-white w-full" />
        <FormControl
          className="[&>label]:ml-0 !border-t !border-blue-500 bor"
          error={
            errors.isConvicted !== undefined && errors.isConvicted.length > 0
          }>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isConvicted}
                onChange={(e) => {
                  const updated = {
                    ...formData,
                    isConvicted: e.target.checked,
                  };
                  setFormData(updated);
                  validateField("isConvicted", updated);
                }}
                onBlur={() => handleBlur("isConvicted")}
              />
            }
            labelPlacement="start"
            label={<Typography variant="body2">{t("felonyLabel")}</Typography>}
          />
        </FormControl>
        {formData.isConvicted && (
          <FormControl
            className="w-full max-w-[400px] [&>label]:ml-0 [&>label]:!items-start"
            error={
              errors.convictedExplanation !== undefined &&
              errors.convictedExplanation.length > 0
            }>
            <FormControlLabel
              labelPlacement="top"
              label={
                <Typography variant="body2" className="pb-1">
                  {t("felonyExplanationLabel")}
                </Typography>
              }
              control={
                <TextareaAutosize
                  minRows={4}
                  id="convictedExplanation-input"
                  name="convictedExplanation"
                  value={formData.convictedExplanation}
                  onChange={handleChange}
                  onBlur={() => handleBlur("convictedExplanation")}
                  className="w-full text-black dark:bg-gray-400"
                />
              }
            />
            {errors.convictedExplanation && (
              <Typography variant="caption" color="error">
                {errors.convictedExplanation}
              </Typography>
            )}
          </FormControl>
        )}
      </div>
    </section>
  );
};

export default CriminalBackground;
