const mongoose = require("mongoose");

const CredentialSchema = new mongoose.Schema({
  credentialId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  issuer: { type: String, required: true },
  issuedDate: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
  revokedDate: { type: Date },
  credentialData: { type: Object, required: true },
});

module.exports = mongoose.model("Credential", CredentialSchema);
