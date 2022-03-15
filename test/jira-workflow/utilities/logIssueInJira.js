(function(){

	async function aFunction(){
    let axios = this.methods.axios;
    
    let response = await axios.request({
      method: "post",
      url: this.variables.jiraBaseURL + '/rest/api/2/issue',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.methods.getJiraAuthHeader.call(this),
      },
      data: {
        "fields": {
          "project": {
            "key": this.variables.jiraProjectKey
          },
          "issuetype": {
            "name": "Bug"
          },
          "summary": "Test Case Failed - " + this.variables.$tc.details.summary,
          "description": this.methods.getJiraIssueDescriptionForTestFailure.call(this),
          "assignee": {
            "name": this.variables.jiraAssigneeName
          }
        }
      }
    });
    response = JSON.parse(response.data);
    this.methods.updateExternalId.call(this, response.key);
		return response.key;
	}

	return aFunction;
})();