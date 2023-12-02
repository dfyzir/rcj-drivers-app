import React from "react";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";

import "@/styles/globals.css";
import "@aws-amplify/ui-react/styles.css";

import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";

Amplify.configure(config, {
  ssr: true,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </Authenticator.Provider>
  );
}
export default App;
