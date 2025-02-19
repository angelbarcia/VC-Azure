const express = require("express");
const api = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const { createIssuanceRequest } = require("../utils/IssuanceRequest");
const { getCredentialById } = require("../repository/mongo-repository-vc");
const { verifyRequest } = require("../utils/VerificationRequest");
const { getAllCredentials }  = require("../repository/mongo-repository-vc");
const createApi = (callbackFun) => {
  api.use(bodyParser.json({ limit: "5mb" }));
  api.use(logger("dev"));
  api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "HEAD,OPTIONS,POST,PUT,PATCH,DELETE,GET"
    );
    next();
  });

  api.get("/vc-issuer/api/v1/health", (req, res) => {
    res.set("Content-Type", "application/json");
    res.status(200).send({ status: "OK" });
  });

  api.get("vc-issuer/api/v1/credential/${id}", async (req, res) =>{
    try {
      const credential = await getCredentialById(req.params.id);
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }
      res.status(200).json(credential);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  api.get("vc-issuer/api/v1/credentials", async (req, res) => {
    try {
      const credentials = await getAllCredentials();
      res.json(credentials);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

  api.post("/vc-issuer/api/v1/issue-credential", async (req, res) => {
    try {
      const credentialData = req.body;
      const issuedCredential = await createIssuanceRequest(credentialData)
      res.status(201).json(issuedCredential);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

  api.post("/vc-issuer/api/v1/verify-credential", async (req, res) => {
    try {
      const credentialData = req.body;
      const verifiedCredential = await verifyRequest(credentialData)
      res.status(200).json({ message: "Credential verified successfully", verifiedCredential });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const server = api.listen(process.env.API_PORT || 8100, callbackFun);
}; // createApi

exports.getApi = () => {
  return api;
};

exports.createApi = createApi;
