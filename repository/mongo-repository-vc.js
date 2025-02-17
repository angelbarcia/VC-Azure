const axios = require("axios");
const callbackModel = require("../models/callback-schema");
const {getAccessToken} = require("../utils/Microsoft-functions");

const issueVc = async (postData) => {
  postData = new callbackModel;
  const apiUrl = "https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest";
  try {
    await getAccessToken()
    const response = await axios.post(apiUrl, postData);
    if (response.status >= 200 && response.status < 300) {
      console.log('API Response:', response.data);
      const signedVC = response.data.vc;
      const newCredential = new callbackModel
      ({
        callback: postData.callback,
        authority: postData.authority,
        registration: postData.registration,
        type: postData.type,
        manifest: postData.manifest,
        signedVC: signedVC
      });
      await newCredential.save();
      console.log('Verified Credential saved to MongoDB:', newCredential);
    } else {
      throw new Error(`API returned status code ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};



exports.issueVc = issueVc;
