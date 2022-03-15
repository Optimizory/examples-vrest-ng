(function(){

	async function aFunction(issueId){
    const FormData = require('form-data');
    var fs = require("fs");
    var path = require("path");
    
    let filePath = this.variables.$projectDir + path.sep + this.methods.getRandom() + ".json";
    let response = this.variables.$tc.execution.response;
    
    let data = {
      statusCode: response.statusCode,
      headers: response.headers,
      executionTime: response.executionTime,
      type: response.type,
      content: response.content
    };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    const form = new FormData();
    let filename = path.basename(filePath);
    form.append('file', fs.readFileSync(filePath), {
      filename: filename,
      contentType: "application/json"
    });
    
    let headers = form.getHeaders();
    headers["Authorization"] = this.methods.getJiraAuthHeader.call(this);
    headers["X-Atlassian-Token"] = "no-check";
    
    let axios = this.methods.axios;
    let jiraResponse = await axios.request({
      method: "post",
      url: this.variables.jiraBaseURL + '/rest/api/2/issue/' + issueId + '/attachments',
      headers: headers,
      data: form
    });
    
    //remove the temporary file
    fs.unlink(filePath, function(err){
      if(!err) console.log("file removed.");
    });
    
		return filename;
	}

	return aFunction;
})();