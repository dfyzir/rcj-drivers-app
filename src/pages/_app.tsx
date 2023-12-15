import React from "react";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";

import "@/styles/globals.css";
import "@aws-amplify/ui-react/styles.css";

import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";

Amplify.configure(config, {
  ssr: true,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <NextUIProvider>
        <Head>
          {/* Add other global metadata tags here */}
          <title>RCJ Driver</title>
          <meta name="description" content="Find docs for the RCJ's chassis" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </NextUIProvider>
    </Authenticator.Provider>
  );
}
export default App;
