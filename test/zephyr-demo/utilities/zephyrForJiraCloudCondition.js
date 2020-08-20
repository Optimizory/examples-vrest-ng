(function(){

	var aFunction = function(){
	  let vars = this.variables;
	  let externalId = vars.$tc.details.externalId;
	  let environment = vars.$tr.details.environment;
	  
	  //Change the condition as per your context 
	  //Change the global variable `zephyrForJiraCloudHookEnv` if you want to run zephyr hooks in some other environment
	  if(externalId && environment === vars.zephyrForJiraCloudHookEnv){
	    return true;
	  }
		return false;
	};

	return aFunction;
})();