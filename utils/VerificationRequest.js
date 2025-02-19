const clientId = "c4e5e745-006b-40af-9828-9c3398edb775";
const clientSecret = "0";
const tenantId = "827cfa74-3589-40e8-b6f4-2f35aab2e201";
const { getAccessToken } = require("./Authentication-MSAL");
import { saveCredential } from '../repository/mongo-repository-vc';
const didAuthority = "did:web:did.deepcloudlabs.com";
const verifyApiUrl =
    "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createPresentationRequest";

async function verifyRequest (credentialData){
    const token = await getAccessToken();
    const payload = {
        "authority": didAuthority,
        "callback": {
        "url": "https://a1bf-79-117-95-157.ngrok-free.app",
            "state": "pending",
            "headers": {
            "api-key": "OPTIONAL API-KEY for CALLBACK EVENTS"
        }
    },
        "registration": {
        "clientName": "Veritable Credential Expert Verifier"
    },
        "includeReceipt": true,
        "requestedCredentials": [
        {
            "type": credentialData.credentialType,
            "purpose": "To verify a credential",
            "acceptedIssuers": [
                didAuthority
            ],
            "configuration": {
                "validation": {
                    "allowRevoked": true,
                    "validateLinkedDomain": true
                }
            }
        }
    ]
    }
    try {
        const response = await fetch(verifyApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log("Response:", data);
        //TODO: CHECK THE ID AND IF IT EXISTS, CHANGE THE VERIFY INTO TRUE, IF IT DOESNT EXIST, INCLUDE THE WHOLE CERTIFICATE
        if (data) {
            const savedCredential = await saveCredential({
                verified: true
            });
            return { data, savedCredential };
        }}
    catch (error) {
        console.error("Error:", error);
    }
}


module.exports = { verifyRequest }