import * as React from "react";
import { NewDriverForm } from "@/types/newDriverForm";
import SignatureCanvas from "react-signature-canvas";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
  Alert,
  Collapse,
  TextField,
  IconButton,
  DialogActions,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";

export type AgreementCfg = {
  id: string;
  i18nShortKey: string;
  i18nPlainKey: string;
  i18nBodyKey: string;
  version: string;
  required: boolean;
};

const useAgreements = (t: (k: string) => string): AgreementCfg[] =>
  useMemo(
    () => [
      {
        id: "applicationCertify",
        i18nShortKey: "applicationCertify.short",
        i18nPlainKey: "applicationCertify.plain",
        i18nBodyKey: "applicationCertify",
        version: "2025-09-01",
        required: true,
      },
      {
        id: "bgCheckAgreement",
        i18nShortKey: "bgCheckAgreement.short",
        i18nPlainKey: "bgCheckAgreement.plain",
        i18nBodyKey: "bgCheckAgreement",
        version: "2025-09-01",
        required: true,
      },
      {
        id: "authorize",
        i18nShortKey: "authorize.short",
        i18nPlainKey: "authorize.plain",
        i18nBodyKey: "authorize",
        version: "2025-09-01",
        required: true,
      },
      {
        id: "pspAgreement",
        i18nShortKey: "pspAgreement.short",
        i18nPlainKey: "pspAgreement.plain",
        i18nBodyKey: "pspAgreement.body",
        version: "2025-09-20",
        required: true,
      },
    ],
    [t]
  );

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

export default function FinalStep({
  formData,
  setFormData,
  errors,
  handleChange,
  handleBlur,
  sigCanvas,
  validateField,
}: FinalStepProps) {
  const { t, i18n } = useTranslation();
  const agreements = useAgreements(t);

  // UI state
  const [masterChecked, setMasterChecked] = useState<boolean>(
    Boolean((formData as any).agreementsAccepted?.length)
  );
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const toggleMaster = (checked: boolean) => {
    setMasterChecked(checked);
    const updated: any = { ...formData, termsAgreed: checked };
    setFormData(updated);
    validateField("termsAgreed", updated);
  };

  const handleSignatureSave = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      const updated: any = { ...formData, signature: dataURL };
      setFormData(updated);
      validateField("signature", updated);
    }
  };

  return (
    <section className="mb-6">
      <h2 className="font-semibold mb-4 dark:text-white">{t("signSubmit")}</h2>

      {/* Printed Name */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </Box>

      {/* Master Accept All */}
      <Box className="mt-4 dark:text-slate-50">
        <FormControlLabel
          control={
            <Checkbox
              checked={masterChecked}
              onChange={(e) => toggleMaster(e.target.checked)}
            />
          }
          label={
            <Typography variant="body1">
              {t("acceptAllTermsShort", {
                defaultValue: "I agree to the Terms & Conditions",
              })}
            </Typography>
          }
        />
        <Button
          size="small"
          variant="text"
          aria-expanded={showTerms}
          aria-controls="terms-section"
          onClick={() => setShowTerms((s) => !s)}>
          {showTerms
            ? t("hideTerms", { defaultValue: "Hide Terms" })
            : t("viewTerms", { defaultValue: "View full Terms & Conditions" })}
        </Button>
        <Box sx={{ mt: 1 }}>
          <Collapse in={!masterChecked} timeout={250} unmountOnExit>
            <Alert severity="info" aria-live="polite">
              {t("pleaseAcceptAll", {
                defaultValue:
                  "You must accept the Terms & Conditions to continue.",
              })}
            </Alert>
          </Collapse>
        </Box>
      </Box>

      {/* Agreements bundle (animated show/hide) */}
      <Collapse id="terms-section" in={showTerms} timeout={250} unmountOnExit>
        <Box className="mt-2">
          {agreements.map((a) => (
            <Accordion
              key={a.id}
              expanded={expanded === a.id}
              onChange={(_, isExp) => setExpanded(isExp ? a.id : false)}>
              <AccordionSummary expandIcon={<ChevronDownIcon />}>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {t(a.i18nShortKey)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    v{a.version} {a.required ? "• required" : ""}{" "}
                    {masterChecked
                      ? t("accepted", { defaultValue: "(accepted)" })
                      : ""}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {/* show plain, user-friendly summary (not the legal text) */}
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {t(a.i18nPlainKey)}
                </Typography>
                <Box className="mt-2">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setActiveDialog(a.id)}>
                    {t("viewFullText", { defaultValue: "View full text" })}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Collapse>

      {/* Full text dialog */}
      <Dialog
        open={!!activeDialog}
        onClose={() => setActiveDialog(null)}
        fullWidth
        maxWidth="md">
        <DialogTitle sx={{ pr: 7, position: "relative" }}>
          <Typography variant="h6" component="div">
            {activeDialog
              ? t(agreements.find((x) => x.id === activeDialog)!.i18nShortKey)
              : ""}
          </Typography>

          {i18n.resolvedLanguage?.startsWith("es") && (
            <Typography
              variant="caption"
              color="text.secondary"
              component="p" // <— block element, not inline
              sx={{ mt: 0.5 }} // <— add a little spacing under the title
            >
              {t("nonOfficialTranslationNotice")}
            </Typography>
          )}

          <IconButton
            aria-label={t("close", { defaultValue: "Close" })}
            onClick={() => setActiveDialog(null)}
            edge="end"
            disableRipple
            disableFocusRipple
            sx={(theme) => ({
              position: "absolute",
              marginRight: 0,
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
              borderRadius: 2,
              "&:hover": { backfaceVisibility: "gray", borderRadius: 2 },
            })}>
            <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>
              ×
            </span>
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {activeDialog
              ? t(agreements.find((x) => x.id === activeDialog)!.i18nBodyKey)
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setActiveDialog(null)}>
            {t("close", { defaultValue: "Close" })}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signature */}
      <Box className="mt-6 w-full">
        <h3 className="font-semibold mb-2 sm:mx-auto dark:text-white">
          {t("signature")}
        </h3>
        {(formData as any).signature && (
          <div className="w-auto mb-2">
            <Button
              onClick={() => {
                sigCanvas.current?.clear();
                const updated: any = { ...formData, signature: "" };
                setFormData(updated);
                validateField("signature", updated);
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
      </Box>
    </section>
  );
}
