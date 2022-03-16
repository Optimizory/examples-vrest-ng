(function(){
  
  // main function
  // This function will either raise an issue or log comment in exising issue
  async function promiseFunc(resolve, reject){
    try {
      let tc = this.variables.$tc;
      let externalId = tc.details.externalId;
      let issueId;
      
      if(externalId){ //Verify if test case has linked with External ID
        //check the external ID mapped statuses in JIRA
        issueId = await this.methods.findIssueIdNotClosed.call(this, externalId);
        console.log("issueId: ", issueId);
        if(issueId){ //if any one of the external ID ( issue ) status in JIRA is NOt closed( intake, open etc ) , then add comment , dont raise new Jira
          await this.methods.logCommentInJira.call(this, issueId);
        } else {
          //if all are closed, then raise new JIRA
          issueId = await this.methods.logIssueInJira.call(this);
        }
      } else { // if external id not set then log a new issue
        issueId = await this.methods.logIssueInJira.call(this);
      } 
      
      await this.methods.addResponseAttachmentInJira.call(this, issueId);
      resolve(false);  
    } catch(err){
      reject(err); 
    }
  }
  
	var aFunction = function(){
	  //modify the condition as per your needs
	  if(this.variables.$tc.result.isExecuted && !this.variables.$tc.result.isPassed && 
	    this.variables.$tr.details.environment === this.variables.jiraHookEnv) {
	      
	    console.log("Running hook logIssueOrComment...");
	    let self = this;
      return new Promise(function(resolve, reject){
        return promiseFunc.call(self, resolve, reject);
      });  
	  } else {
	    console.log("Hook condition failed.");
	    return false;
	  }
	};

	return aFunction;
})();