const docusign = require('docusign-esign')
const fs = require('fs')
const privateKeyFilename = fs.readFileSync('./.safeDocSign');


let expiresIn = 6000
let scopes = "signature impersonation"
let userId = 'bd08505b-3515-48e7-9318-2f9e3bff605a'
let clientId = 'bcdf5aa2-ce00-41fd-aa29-310460785082'

let authorized = false
let dsApi = new docusign.ApiClient();

dsApi.setOAuthBasePath('account-d.docusign.com');

dsApi.requestJWTUserToken(clientId, userId, scopes, privateKeyFilename, expiresIn, (error, results) => {
  if (error) {
    console.log(error);
    return
  }
  dsApi.addDefaultHeader('Authorization', 'Bearer ' + results.body.access_token);
  authorized = true;
  sendSignRequest()
})


async function sendSignRequest() {
  if (!authorized) {
    return
  }
  dsApi.listTemplates(userId, (result) => {
    console.log(result.data);
    
  })

  
}


const Docusign = { sendSignRequest }

module.exports = Docusign

// let envelope = new docusign.EnvelopeDefinition();
//   env.templateId = args.templateId;

//   // Create template role elements to connect the signer and cc recipients
//   // to the template
//   // We're setting the parameters via the object creation
//   let signer1 = docusign.TemplateRole.constructFromObject({
//       email: args.signerEmail,
//       name: args.signerName,
//       roleName: 'signer'});

//   // Create a cc template role.
//   // We're setting the parameters via setters
//   let cc1 = new docusign.TemplateRole();
//   cc1.email = args.ccEmail;
//   cc1.name = args.ccName;
//   cc1.roleName = 'cc';

//   // Add the TemplateRole objects to the envelope object
//   env.templateRoles = [signer1, cc1];
//   env.status = "sent"; // We want the envelope to be sent

//   return env;