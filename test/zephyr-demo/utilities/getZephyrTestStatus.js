(function(){
  
  var aFunction = function(){
    
    let vars = this.variables,
      isExecuted = vars.$tc.result.isExecuted,
      isPassed = vars.$tc.result.isPassed,
      result;

    if(isExecuted){
      if(isPassed){
        result = 1;
      } else {
        result = 2;
      }
    } else {
      result = -1;
    }
    
    return result + "";
  };

  return aFunction;
})();