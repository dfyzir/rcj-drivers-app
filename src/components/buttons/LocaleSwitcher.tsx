import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

export default function LocaleSwitcher() {
  const { i18n } = useTranslation();

  return (
    <Button
      onClick={() => i18n.changeLanguage(i18n.language === "en" ? "es" : "en")}
      variant="outlined">
      {i18n.language === "en" ? "Español" : "English"}
    </Button>
  );
}
