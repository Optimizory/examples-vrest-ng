(function(){

	return async function aFunction(issueId){
    
		let axios = this.methods.axios;
    
    let response = await axios.request({
      method: "get",
      url: this.variables.jiraBaseURL + '/rest/api/2/issue/' + issueId + '?fields=status',
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.methods.getJiraAuthHeader.call(this),
      },
      responseType: 'json'
    });
    response = JSON.parse(response.data);
		return response.fields.status.name;
	}
})();