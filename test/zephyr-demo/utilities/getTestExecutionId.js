(function(){

	var aFunction = function(res, opts, versionId, cycleId){
		res = JSON.parse(res);
		let executions = res.executions;
		for(let obj of executions){
		  if(obj.execution.cycleId === cycleId && obj.execution.versionId === Number(versionId)){
		    return obj.execution.id;
		  }
		}
		return null;
	};

	return aFunction;
})();