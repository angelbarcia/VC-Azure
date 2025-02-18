const axios = require("axios");
const callbackModel = require("../models/callback-schema");
const { getAccessToken } = require("./Auth-MSAL");
const clientId = "c4e5e745-006b-40af-9828-9c3398edb775";
const clientSecret = "0";
const tenantId = "827cfa74-3589-40e8-b6f4-2f35aab2e201";
const issueApiUrl =
  "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest";
const verifyApiUrl =
  "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createPresentationRequest";
const didAuthority = "did:web:did.deepcloudlabs.com";

async function createIssuanceRequest() {
  const token = await getAccessToken();
  const payload = {
    authority: didAuthority,
    callback: {
      url: "https://a1bf-79-117-95-157.ngrok-free.app",
      state: "pending",
      headers: {
        "api-key": "OPTIONAL API-KEY for CALLBACK EVENTS",
      },
    },
    registration: {
      clientName: "Verifiable Credential Expert Sample",
    },
    type: "VerifiedCredentialExpert",
    manifest: "https://verifiedid.did.msidentity.com/v1.0/tenants/827cfa74-3589-40e8-b6f4-2f35aab2e201/verifiableCredentials/contracts/70ccf935-4342-2124-48a7-76b7832166da/manifest.json",
    pin: {
      value: "3539",
      length: 4,
    },
    claims: {
      given_name: "Megan",
      family_name: "Bowen",
    },
    expirationDate: "2024-12-31T23:59:59.000Z",
  };

  try {
    const response = await fetch(issueApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
  return data;
}

module.exports = { createIssuanceRequest };
