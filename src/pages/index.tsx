import CreditApplicationForm from "@/components/new-driver-form/CreditForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import nextI18NextConfig from "../../next-i18next.config";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale ?? "en",
        ["common"],
        nextI18NextConfig
      )),
    },
  };
}

export default function Page() {
  const [render, setRender] = useState<boolean>(false);
  useEffect(() => setRender(true), []);
  if (!render) {
    return null;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CreditApplicationForm />
    </LocalizationProvider>
  );
}
