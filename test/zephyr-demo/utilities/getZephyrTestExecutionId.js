(function(){
  
  var aFunction = function(){
    
    let vars = this.variables,
      versionId = vars.projectVersionId,
      cycleId = vars.testCycleId,
      executions = this.execution.response.parsed.executions;
  
    if(executions && executions.length){
      for(let obj of executions){
        if(obj.execution.cycleId === cycleId && obj.execution.versionId === versionId){
          return obj.execution.id;
        }
      }  
    }
    
    console.error("[Method - getZephyrTestExecutionId] - Zephyr execution id not found");
    
    return null;
  };
  
  return aFunction;
})();