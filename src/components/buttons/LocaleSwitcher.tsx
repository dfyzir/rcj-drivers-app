import { useRouter } from "next/router";
import Button from "@mui/material/Button";

export default function LocaleSwitcher() {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  const nextLocale = locale === "en" ? "es" : "en";
  const handleClick = () => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };
  return (
    <Button onClick={handleClick} variant="outlined">
      {locale === "en" ? "Español" : "English"}
    </Button>
  );
}
