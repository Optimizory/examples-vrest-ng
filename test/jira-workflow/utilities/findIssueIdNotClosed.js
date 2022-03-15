(function(){

	async function aFunction(externalId){
	  let result = null;
	  if(externalId){
	    let ids = externalId.split(",");
	    for(let id of ids){
	      let status = await this.methods.findJiraIssueStatus.call(this, id);
	      if(status !== this.variables.jiraClosedStatusName){
	        return id;
	      }
	    }
	  }
    
		return result;
	}

	return aFunction;
})();