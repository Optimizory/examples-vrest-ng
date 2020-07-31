(function(){

	var aFunction = function(tc, jiraAccountId, zapiAccessKey, zapiSecret, zephyrBaseURL, method, url){
		let jwt = require('atlassian-jwt');
    let moment = require('moment');
    const now = moment().utc();
    const req = jwt.fromMethodAndUrl(method, url);
    const tokenData = {
      "sub": jiraAccountId,
      "iss": zapiAccessKey,
      "iat": now.unix(),                    // The time the token is generated
      "exp": now.add(5, 'minutes').unix(),  // Token expiry time (recommend 3 minutes after issuing)
      "qsh": jwt.createQueryStringHash(req, false, zephyrBaseURL) // [Query String Hash](https://developer.atlassian.com/cloud/jira/platform/understanding-jwt/#a-name-qsh-a-creating-a-query-string-hash)
    };
    
    return jwt.encode(tokenData, zapiSecret);
	};

	return aFunction;
})();