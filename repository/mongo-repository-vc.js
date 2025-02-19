import CredentialModel from '../models/Credential.js';

const saveCredential = async (credentialData) => {
    const credential = new CredentialModel(credentialData);
    return await credential.save();
};

const getCredentialById = (id) => {
    return CredentialModel.findById(id);
};

const getAllCredentials = () => {
    return CredentialModel.find();
};

module.exports = { saveCredential, getAllCredentials, getCredentialById }