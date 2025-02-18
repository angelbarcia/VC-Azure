const request = require("supertest");
const mongoose = require("mongoose");
const { createApi, getApi } = require("./api/vc-api");
createApi(() => {});
api = getApi();
const { getAccessToken } = require("./utils/Auth-MSAL")
const callbackModel = require("./models/callback-schema");
const clientId = "c4e5e745-006b-40af-9828-9c3398edb775";
const clientSecret = "0";
const tenantId = "827cfa74-3589-40e8-b6f4-2f35aab2e201";
const issueApiUrl =
  "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest";
const verifyApiUrl =
  "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createPresentationRequest";
const didAuthority = "did:web:did.deepcloudlabs.com";
const credentialManifest =
  "https://verifiedid.did.msidentity.com/v1.0/tenants/827cfa74-3589-40e8-b6f4-2f35aab2e201/verifiableCredentials/contracts/70ccf935-4342-2124-48a7-76b7832166da/manifest.json";

test("GET /vc-issuer/api/v1/health", async () => {
  const response = await request(api).get("/vc-issuer/api/v1/health");
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ status: "OK" });
  expect(response.headers["content-type"]).toMatch(/json/);
});

describe("VC Routes", () => {
  test("POST /vc-issuer/api/v1/issue-credential", async () => {
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
      manifest: credentialManifest,
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
    const textToSend =`
    POST ${issueApiUrl}
    Content-Type: application/json
    Authorization: Bearer ${token}

    ${JSON.stringify(payload, null, 2)}
    `;

    const response = await request(api)
      .post("/vc-issuer/api/v1/issue-credential")
      .send(textToSend);
    console.log("Response status:", response.status);
    console.log("Response body:", response.body);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
  });

  /*test("POST /vc-issuer/api/v1/verify-credential", async () => {
    const jws =
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXUyJ9.eyJfaWQiOiI2N2ExZjdjOWEzNDYyOTQzMzNkZmYxYzciLCJAY29udGV4dCI6Imh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwidH\n" +
      "lwZSI6IlZlcmlmaWFibGVDcmVkZW50aWFsIiwiaXNzdWVyIjoiZGlkOmV4YW1wbGU6MTIzIiwiaXNzdWFuY2VEYXRlIjoiMjAyNS0wMi0wNFQxMjozNjozMi44NDdaIiwiY3JlZGVudGlhbFN1YmplY3QiOnsia\n" +
      "WQiOiJkaWQ6ZXhhbXBsZTo0NTYiLCJuYW1lIjoiSm9obiBEb2UifX0.C6niuTmaE_48uFo6qB8cxVL6TYPSYl2X8FwDhpjrnw6P6HYrQigWkfG6lV66jpwdDO2vZToAPhq-4XTBN_SeReN-RBWJYvwRsYm-hzTs\n" +
      "MukJLg9b4dzqdLD4qm6sYOS1QFOW3ypmZbUri864iRJp9Ioopb-_p2WABG6X4xyfGcH-ytEcoqAgiq2vapjS_L0hXWDNYqr_VuceEVeLxyp9KV6zgmZxev6e0WOxDODZPQtwT9MfImWA6KcTacjRR4rlOBPSyrljofnEdD99bwr8L3onh6_djHCPmwT44DYk8D-AzhUgU_4J8Dj2pe25ffpwivC5wr89009pPmSNKOs19A\n";

    const response = await request(api)
      .post("/vc-issuer/api/v1/verify-credential")
      .send(jws);
    console.log("Response status:", response.status);
    console.log("Response body:", response.body);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
  });
})*/
});
