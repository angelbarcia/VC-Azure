const msal = require("@azure/msal-node")
const clientId = "c4e5e745-006b-40af-9828-9c3398edb775";
const clientSecret = "00000";
const tenantId = "827cfa74-3589-40e8-b6f4-2f35aab2e201";

const msalConfig = {
    auth: {
      clientId: clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret: clientSecret,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Error,
      },
    },
  };
const cca = new msal.ConfidentialClientApplication(msalConfig);
const msalClientCredentialRequest = {
    scopes: ["3db474b9-6a0c-4840-96ac-1fceb342124f/.default"],
    skipCache: false,
  };

async function getAccessToken() {
  try {
    const response = await cca.acquireTokenByClientCredential(msalClientCredentialRequest);
    console.log("Access Token:", response.accessToken)
    return response.accessToken;
  } catch (error) {
    console.error("Error to obtain the token", error);
    throw error;
  }
}

module.exports = { getAccessToken };
