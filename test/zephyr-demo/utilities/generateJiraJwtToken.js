(function(){
  
  var aFunction = function(){
    let jwt = require('atlassian-jwt');
    let moment = require('moment');
    let vars = this.variables;
    const now = moment().utc();
    const req = jwt.fromMethodAndUrl(this.request.method, this.request.urlWithQuery);
    const tokenData = {
      "sub": vars.jiraAccountId,
      "iss": vars.zapiAccessKey,
      "iat": now.unix(),                    // The time the token is generated
      "exp": now.add(5, 'minutes').unix(),  // Token expiry time (recommend 3 minutes after issuing)
      "qsh": jwt.createQueryStringHash(req, false, vars.zephyrBaseURL) // [Query String Hash](https://developer.atlassian.com/cloud/jira/platform/understanding-jwt/#a-name-qsh-a-creating-a-query-string-hash)
    };
    let result = jwt.encode(tokenData, vars.zapiSecretKey);
    return 'JWT ' + result;
  };
  return aFunction;
})();