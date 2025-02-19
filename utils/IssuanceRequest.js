const { getAccessToken } = require("./Authentication-MSAL");
import { saveCredential } from '../repository/mongo-repository-vc';
const issueApiUrl =
  "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest";
const didAuthority = "did:web:did.deepcloudlabs.com";
const credentialManifest =  "https://verifiedid.did.msidentity.com/v1.0/tenants/827cfa74-3589-40e8-b6f4-2f35aab2e201/verifiableCredentials/contracts/70ccf935-4342-2124-48a7-76b7832166da/manifest";

async function createIssuanceRequest(credentialData) {
  const token = await getAccessToken();
  const payload = {
    authority: didAuthority,
    includeQRCode: true,
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
    type: credentialData.credentialType,
    manifest: credentialManifest,
    pin: credentialData.credentialPin,
    claims: credentialData.credentialSubject,
    expirationDate: credentialData.expirationDate
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
    if (data) {
      const savedCredential = await saveCredential({
        credentialType: credentialData.credentialType,
        issuer: "DEEPCLOUDLABS",
        credentialSubject: credentialData.credentialSubject,
        proof: data,
        verified: true
      });
      return { data, savedCredential };
  }}
  catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { createIssuanceRequest };
