import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
    credentialType: { type: String, required: true },
    issuer: { type: String, required: true },
    issuanceDate: { type: Date, default: Date.now },
    expirationDate: { type: Date },
    credentialPin : { type: Object, required: true },
    credentialSubject: { type: Object, required: true },
    proof: { type: Object, required: true },
    verified: { type: Boolean, required: true}
});

export default mongoose.model('Credential', credentialSchema);