const axios = require("axios");
const callbackModel = require("../models/callback-schema");

const clientId = "c4e5e745-006b-40af-9828-9c3398edb775"
const clientSecret = "00";
const tenantId = "827cfa74-3589-40e8-b6f4-2f35aab2e201"

const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

const params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('client_id', clientId);
params.append('client_secret', clientSecret);
params.append('scope', 'api://f10aa88a-dd20-4b29-b145-155d2940301c/access_as_users/.default');

async function getAccessToken() {
    try {
        const response = await axios.post(authUrl, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data.access_token; // Retorna el token de acceso
        } else {
            throw new Error(`Error obtaining token: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

/*async function issueVcMicrosoft() {
  const accessToken = await getAccessToken();
  const response = await axios.post(
    "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest",
    credentialPayload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response;
}*/

async function verifyVCMicrosoft(jws) {
  const accessToken = await getAccessToken();
  const { credential } = jws;
  const response = await axios.post(
    "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/verify",
    { credential },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}
module.exports = { verifyVCMicrosoft, getAccessToken };
