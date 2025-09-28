import * as React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRouter } from "next/router";

export default function LocaleSwitcher() {
  const router = useRouter();
  const { locale = "en", pathname, asPath, query } = router;

  const handleChange = (
    _: React.SyntheticEvent,
    newLocale: "en" | "es" | null
  ) => {
    if (!newLocale || newLocale === locale) return;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={locale}
      onChange={handleChange}
      aria-label="Language"
      color="primary"
      sx={{
        borderRadius: 20,
        "& .MuiToggleButton-root": {
          textTransform: "none",
          px: 1.5,
          transition: (t) =>
            t.transitions.create(["background-color", "color", "transform"], {
              duration: 180,
            }),
          "&.Mui-selected": {
            transform: "scale(1.02)",
            boxShadow: 1,
          },
        },
      }}>
      <ToggleButton value="en" aria-label="English">
        EN
      </ToggleButton>
      <ToggleButton value="es" aria-label="Español">
        ES
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
