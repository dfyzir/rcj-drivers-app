import { NewDriverForm } from "@/types/newDriverForm";
import SignatureCanvas from "react-signature-canvas";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface FinalStepProps {
  formData: NewDriverForm;
  setFormData: React.Dispatch<React.SetStateAction<NewDriverForm>>;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  handleBlur: (field: string) => void;

  sigCanvas: React.RefObject<SignatureCanvas>;
  validateField: (field: string, updatedData: NewDriverForm) => void;
}
const FinalStep = ({
  formData,
  setFormData,
  errors,
  handleChange,
  handleBlur,
  sigCanvas,
  validateField,
}: FinalStepProps) => {
  const { t } = useTranslation();

  const handleSignatureSave = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      const updated = { ...formData, signature: dataURL };
      setFormData(updated);
      validateField("signature", updated);
    }
  };

  return (
    <>
      <section className="mb-6">
        <h2 className="font-semibold mb-4 dark:text-white">
          {t("signSubmit")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            type="text"
            name="printedName"
            value={formData.printedName}
            label={t("printName")}
            onChange={handleChange}
            onBlur={() => handleBlur("printedName")}
            error={
              errors.printedName !== undefined && errors.printedName.length > 0
            }
            helperText={errors.printedName}
          />
        </div>
        <div className="mt-4 w-full dark:text-white">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.termsAgreed}
                onChange={(e) => {
                  const updated = {
                    ...formData,
                    termsAgreed: e.target.checked,
                  };
                  setFormData(updated);
                  validateField("termsAgreed", updated);
                }}
                onBlur={() => handleBlur("termsAgreed")}
              />
            }
            labelPlacement="start"
            label={
              <Typography variant="body2">{t("applicationCertify")}</Typography>
            }
          />
          {errors.termsAgreed && (
            <Typography variant="caption" color="error">
              {errors.termsAgreed}
            </Typography>
          )}
        </div>
        <div className="mt-4 w-full dark:text-white">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.creditDisclosure}
                onChange={(e) => {
                  const updated = {
                    ...formData,
                    creditDisclosure: e.target.checked,
                  };
                  setFormData(updated);
                  validateField("creditDisclosure", updated);
                }}
                onBlur={() => handleBlur("creditDisclosure")}
              />
            }
            labelPlacement="start"
            label={
              <Typography variant="body2">{t("bgCheckAgreement")}</Typography>
            }
          />
          {errors.creditDisclosure && (
            <Typography variant="caption" color="error">
              {errors.creditDisclosure}
            </Typography>
          )}
        </div>
        <div className="mt-4 w-full dark:text-white">
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.authorized}
                onChange={(e) => {
                  const updated = {
                    ...formData,
                    authorized: e.target.checked,
                  };
                  setFormData(updated);
                  validateField("authorized", updated);
                }}
                onBlur={() => handleBlur("authorized")}
              />
            }
            labelPlacement="start"
            label={<Typography variant="body2">{t("authorize")}</Typography>}
          />
          {errors.authorized && (
            <Typography variant="caption" color="error">
              {errors.authorized}
            </Typography>
          )}
        </div>
        <div className="mt-4 w-full">
          <h3 className="font-semibold mb-2 sm:mx-auto dark:text-white">
            {t("signature")}
          </h3>
          {formData.signature && (
            <div className="w-auto">
              <Button
                onClick={() => {
                  sigCanvas.current?.clear();
                  setFormData({ ...formData, signature: "" });
                }}
                variant="outlined"
                color="error">
                {t("clear")}
              </Button>
            </div>
          )}

          <SignatureCanvas
            ref={sigCanvas}
            penColor={"blue"}
            clearOnResize={false}
            canvasProps={{
              className:
                "border dark:border-slate-600 rounded mb-2 sm:w-3/4 sm:h-3/4 w-full h-full sm:mx-auto aspect-video dark:bg-gray-600",
            }}
            onEnd={handleSignatureSave}
          />
        </div>
      </section>
    </>
  );
};

export default FinalStep;
