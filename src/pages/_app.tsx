import React from "react";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@/styles/globals.css";
import "@aws-amplify/ui-react/styles.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";

Amplify.configure(config, {
  ssr: true,
});

function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <Authenticator.Provider>
        <Head>
          <title>RCJ Driver</title>
          <meta name="description" content="Find docs for the RCJ's chassis" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </Authenticator.Provider>
    </ThemeProvider>
  );
}
export default appWithTranslation(App);
