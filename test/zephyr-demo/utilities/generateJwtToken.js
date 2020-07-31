(function(){
  
  var aFunction = function(){
    let jwt = require('atlassian-jwt');
    let moment = require('moment');
    const now = moment().utc();
    const req = jwt.fromMethodAndUrl(this.request.method, this.request.urlWithQuery);
    const tokenData = {
      "sub": this.variables.jiraAccountId,
      "iss": this.variables.zapiAccessKey,
      "iat": now.unix(),                    // The time the token is generated
      "exp": now.add(5, 'minutes').unix(),  // Token expiry time (recommend 3 minutes after issuing)
      "qsh": jwt.createQueryStringHash(req, false, this.variables.zephyrBaseURL) // [Query String Hash](https://developer.atlassian.com/cloud/jira/platform/understanding-jwt/#a-name-qsh-a-creating-a-query-string-hash)
    };
    let result = jwt.encode(tokenData, this.variables.zapiSecretKey);
    return 'JWT ' + result;
  };
  return aFunction;
})();