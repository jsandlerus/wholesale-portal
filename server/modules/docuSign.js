async function sendEnvelopeController (req, res) {
    const qp = req.query;
    console.log("qp:", qp);
  
    const accessToken = qp.ACCESS_TOKEN;
    const accountId = qp.ACCOUNT_ID; 
    const signerName = qp.USER_FULLNAME;
    const signerEmail = qp.USER_EMAIL;
    
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