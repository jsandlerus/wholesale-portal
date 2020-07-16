const docuSign = require('docusign-esign');

const privateKeyFilename = "private.key";
const oAuthBasePath = "account-d.docusign.com";
const clientId = "961c2672-828d-489f-980f-008ff6b37c60";
const userId = "9d4daa54-97ef-4750-9aae-4ba3422ff00a";
const expiresIn = 320000;

function makeCall() {
  docuSign.configureJWTAuthorizationFlow(privateKeyFilename, oAuthBasePath, clientId, userId, expiresIn, callback)
}

module.exports = makeCall;