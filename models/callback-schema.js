const mongoose = require('mongoose');

const callbackSchema = new mongoose.Schema({
    url: { type: String, required: true },
    state: { type: String, required: true },
    headers: {
        apiKey: { type: String, required: true }
    }
});

const registrationSchema = new mongoose.Schema({
    clientName: { type: String, required: true }
});

const verifiedCredentialSchema = new mongoose.Schema({
    callback: { type: callbackSchema, required: true },
    authority: { type: String, required: true },
    registration: { type: registrationSchema, required: true },
    type: { type: String, required: true },
    manifest: { type: String, required: true }
});

module.exports = mongoose.model('VerifiedCredential', verifiedCredentialSchema);