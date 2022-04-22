(function () {

  function sendRequest(axios, endpoint, headerValue, success, failure) {
    axios.request({
      method: 'get',
      url: endpoint,
      headers: {
        'Authorization': headerValue
      }
    })
    .then(success)
    .catch(function (error) {
      if (error.response) {
        success(error.response);
      } else {
        failure(error);

      }
    });
  }
  
  var aFunction = function () {
    var ntlmUtil = require('@ewsjs/ntlm-client');
    let vars = this.variables;
    let axios = this.methods.axios;
    
    return new Promise(function (resolve, reject) {
      if(vars.ntlmHeader){
        resolve(null);
        return;
      }
      let domain = vars.domain || '',
        workstation = vars.workstation || '',
        username = vars.username || '',
        password = vars.password || '',
        endpoint = vars.securedEndpoint || '',
        parsedParameters;
      
      // Create a type 1 message to send to the server
      let negotiateMessage = ntlmUtil.createType1Message(workstation, domain);
      
      sendRequest(axios, endpoint, negotiateMessage, function (response) {
        // there can be multiple headers present with key `www-authenticate`.
        // iterate to get the one which has the NTLM hash. if multiple
        // headers have the NTLM hash, use the first one.
        let ntlmType2Header = "";
        
        for (let header in response.headers) {
          if (header.toLowerCase() === "www-authenticate" &&
            response.headers[header].valueOf().startsWith('NTLM ')) {
            ntlmType2Header = response.headers[header];
            break;
          }
        }
        
        if (!ntlmType2Header) {
          reject(new Error('ntlm: server did not send NTLM type 2 message'));
        }
        
        let challengeMessage = ntlmUtil.decodeType2Message(ntlmType2Header);
        console.log(challengeMessage);
        
        if (!challengeMessage) {
          reject(new Error('ntlm: server did not correctly process authentication request'));
        }
        
        let authenticateMessage = ntlmUtil.createType3Message(challengeMessage, username, password, workstation, domain);
        vars['ntlmHeader'] = authenticateMessage;
        resolve(authenticateMessage);
      }, function (error) {
        console.error(error);
        reject(error);
      });
    });
  };
  
  return aFunction;
})();