(function(){

  //this function logs a comment in existing Jira issue id
	async function aFunction(issueId){
    let axios = this.methods.axios;
    let comment = await this.methods.getJiraIssueDescriptionForTestFailure.call(this);
    
    let response = await axios.request({
      method: "post",
      url: this.variables.jiraBaseURL + '/rest/api/2/issue/' + issueId + '/comment',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.methods.getJiraAuthHeader.call(this),
      },
      data: {
        body: comment
      }
    });
		return response;
	}
	
	return aFunction;
})();