async function sendEnvelopeController (req, res) {
    const qp =req.query;
    console.log('qp:',qp);
    // Fill in these constants or use query parameters of ACCESS_TOKEN, ACCOUNT_ID, USER_FULLNAME, USER_EMAIL
    // or environment variables.
  
    // Obtain an OAuth token from https://developers.docusign.com/oauth-token-generator
    const accessToken = envir.ACCESS_TOKEN || qp.ACCESS_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU5NDg1MTQwNywiZXhwIjoxNTk0ODgwMjA3LCJVc2VySWQiOiI5ZDRkYWE1NC05N2VmLTQ3NTAtOWFhZS00YmEzNDIyZmYwMGEiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiOWQ0ZGFhNTQtOTdlZi00NzUwLTlhYWUtNGJhMzQyMmZmMDBhIiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU5NDg1MTQwNSwicHdpZCI6IjU5NTk3YWQ0LWU2ZWItNDYzNi1hZjdmLTYyZTZhYmQxMzU0ZSJ9.LAFCi8SZVxxMjgjagkFLBiRyMPU7iRjd2p9qtEWxfvQcb3C02W0XBdBZb9a8IDrAu8VrJVE_VvU6O_SPBmwMFwfOe9twFS875o0R2STp957HciScmVlfMSllBj0xFt3dzGawqRod5J2mUVWbfUPKQlIRnMX-Otpumv5RDlh8zXG4gXHe5q0HdabJ0mmJZybBkVAEoCISyKaWfwspWwBkUZFvruT3leEtt1f-orEyV498D1-s6qNNnLJoimpnNU_cIrDqHob8BzfbR43uQrIOi82hM9450_uTqwKWYhSo7iAmul9K3o9ULNRwadjh56rxIF46i_TI7VrqwQ9N9AgzkQ";
    // Obtain your accountId from demo.docusign.com -- the account id is shown in the drop down on the
    // upper right corner of the screen by your picture or the default picture. 
    const accountId = envir.ACCOUNT_ID || qp.ACCOUNT_ID || "2b2855d4-d642-4325-8cc0-9fe35d5cb650"; 
  
    // Recipient Information:
    const signerName = envir.USER_FULLNAME || qp.USER_FULLNAME || "John Travolta :D";
    const signerEmail = envir.USER_EMAIL || qp.USER_EMAIL || "jsandler.aol@gmail.com";
  
    // The document you wish to send. Path is relative to the root directory of this repo.
    const fileName = 'demo_documents/World_Wide_Corp_lorem.pdf';
   /**
     *  The envelope is sent to the provided email address. 
     *  One signHere tab is added.
     *  The document path supplied is relative to the working directory 
     */
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(basePath);
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    // Set the DocuSign SDK components to use the apiClient object
    docusign.Configuration.default.setDefaultApiClient(apiClient);
  
    // Create the envelope request
    // Start with the request object
    const envDef = new docusign.EnvelopeDefinition();
    //Set the Email Subject line and email message
    envDef.emailSubject = 'Example form DocuSign Subject';
    envDef.emailBlurb = 'Example form DocuSign Blurb'
  
    // Read the file from the document and convert it to a Base64String
    const pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName))
        , pdfBase64 = pdfBytes.toString('base64');
    
    // Create the document request object
    const doc = docusign.Document.constructFromObject({documentBase64: pdfBase64,
          fileExtension: 'pdf',  // You can send other types of documents too.
          name: 'Sample document', documentId: '1'});
  
    // Create a documents object array for the envelope definition and add the doc object
    envDef.documents = [doc];
  
    // Create the signer object with the previously provided name / email address
    const signer = docusign.Signer.constructFromObject({name: signerName,
          email: signerEmail, routingOrder: '1', recipientId: '1'});
  
    // Create the signHere tab to be placed on the envelope
    const signHere = docusign.SignHere.constructFromObject({documentId: '1',
          pageNumber: '1', recipientId: '1', tabLabel: 'SignHereTab',
          xPosition: '195', yPosition: '147'});
  
    // Create the overall tabs object for the signer and add the signHere tabs array
    // Note that tabs are relative to receipients/signers.
    signer.tabs = docusign.Tabs.constructFromObject({signHereTabs: [signHere]});
  
    // Add the recipients object to the envelope definition.
    // It includes an array of the signer objects. 
    envDef.recipients = docusign.Recipients.constructFromObject({signers: [signer]});
    // Set the Envelope status. For drafts, use 'created' To send the envelope right away, use 'sent'
    envDef.status = 'sent';
    // Send the envelope
    // The SDK operations are asynchronous, and take callback functions.
    // However we'd pefer to use promises.
    // So we create a promise version of the SDK's createEnvelope method.
    let envelopesApi = new docusign.EnvelopesApi()
        // createEnvelopePromise returns a promise with the results:
      , createEnvelopePromise = promisify(envelopesApi.createEnvelope).bind(envelopesApi)
      , results
      ;
  
    try {
      results = await createEnvelopePromise(accountId, {'envelopeDefinition': envDef})
    } catch  (e) {
      let body = e.response && e.response.body;
      if (body) {
        // DocuSign API exception
        res.send (`<html lang="en"><body>
                    <h3>API problem</h3><p>Status code ${e.response.status}</p>
                    <p>Error message:</p><p><pre><code>${JSON.stringify(body, null, 4)}</code></pre></p>`);
      } else {
        // Not a DocuSign exception
        throw e;
      }
    }
    // Envelope has been created:
    if (results) {
      res.send (`<html lang="en"><body>
                  <h3>Envelope Created!</h3>
                  <p>Signer: ${signerName} &lt;${signerEmail}&gt;</p>
                  <p>Results</p><p><pre><code>${JSON.stringify(results, null, 4)}</code></pre></p>`);
    }
  };

module.exports = sendEnvelopeController;