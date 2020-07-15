async function sendEnvelopeController (req, res) {
    const qp = req.query;
    console.log('qp:',qp);
  
    const accessToken = envir.ACCESS_TOKEN || qp.ACCESS_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU5NDg1MTQwNywiZXhwIjoxNTk0ODgwMjA3LCJVc2VySWQiOiI5ZDRkYWE1NC05N2VmLTQ3NTAtOWFhZS00YmEzNDIyZmYwMGEiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiOWQ0ZGFhNTQtOTdlZi00NzUwLTlhYWUtNGJhMzQyMmZmMDBhIiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU5NDg1MTQwNSwicHdpZCI6IjU5NTk3YWQ0LWU2ZWItNDYzNi1hZjdmLTYyZTZhYmQxMzU0ZSJ9.LAFCi8SZVxxMjgjagkFLBiRyMPU7iRjd2p9qtEWxfvQcb3C02W0XBdBZb9a8IDrAu8VrJVE_VvU6O_SPBmwMFwfOe9twFS875o0R2STp957HciScmVlfMSllBj0xFt3dzGawqRod5J2mUVWbfUPKQlIRnMX-Otpumv5RDlh8zXG4gXHe5q0HdabJ0mmJZybBkVAEoCISyKaWfwspWwBkUZFvruT3leEtt1f-orEyV498D1-s6qNNnLJoimpnNU_cIrDqHob8BzfbR43uQrIOi82hM9450_uTqwKWYhSo7iAmul9K3o9ULNRwadjh56rxIF46i_TI7VrqwQ9N9AgzkQ";
    const accountId = envir.ACCOUNT_ID || qp.ACCOUNT_ID || "2b2855d4-d642-4325-8cc0-9fe35d5cb650"; 
    const signerName = envir.USER_FULLNAME || qp.USER_FULLNAME || "John Travolta :D";
    const signerEmail = envir.USER_EMAIL || qp.USER_EMAIL || "jsandler.aol@gmail.com";
  
    const fileName = 'demo_documents/World_Wide_Corp_lorem.pdf';

    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(basePath);
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    docusign.Configuration.default.setDefaultApiClient(apiClient);
  
    const envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = 'Example form DocuSign Subject';
    envDef.emailBlurb = 'Example form DocuSign Blurb'
  
    const pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName))
        , pdfBase64 = pdfBytes.toString('base64');
    
    const doc = docusign.Document.constructFromObject({documentBase64: pdfBase64,
          fileExtension: 'pdf',
          name: 'Sample document', documentId: '1'});
  
    envDef.documents = [doc];
  
    const signer = docusign.Signer.constructFromObject({name: signerName,
          email: signerEmail, routingOrder: '1', recipientId: '1'});
  
    const signHere = docusign.SignHere.constructFromObject({documentId: '1',
          pageNumber: '1', recipientId: '1', tabLabel: 'SignHereTab',
          xPosition: '195', yPosition: '147'});

    signer.tabs = docusign.Tabs.constructFromObject({signHereTabs: [signHere]});
  
    envDef.recipients = docusign.Recipients.constructFromObject({signers: [signer]});
    envDef.status = 'sent';
   
    let envelopesApi = new docusign.EnvelopesApi()
      , createEnvelopePromise = promisify(envelopesApi.createEnvelope).bind(envelopesApi)
      , results
      ;
  
    try {
      results = await createEnvelopePromise(accountId, {'envelopeDefinition': envDef})
    } catch  (e) {
      let body = e.response && e.response.body;
      if (body) {
        res.send (`<html lang="en"><body>
                    <h3>API problem</h3><p>Status code ${e.response.status}</p>
                    <p>Error message:</p><p><pre><code>${JSON.stringify(body, null, 4)}</code></pre></p>`);
      } else {
        throw e;
      }
    }
    if (results) {
      res.send (`<html lang="en"><body>
                  <h3>Envelope Created!</h3>
                  <p>Signer: ${signerName} &lt;${signerEmail}&gt;</p>
                  <p>Results</p><p><pre><code>${JSON.stringify(results, null, 4)}</code></pre></p>`);
    }
  };

module.exports = sendEnvelopeController;