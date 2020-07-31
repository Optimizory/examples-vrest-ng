(function(){
  
  var aFunction = function(tcResult){
    let comment = "";
    if(tcResult.isExecuted){
      if(!tcResult.isPassed){
        comment = tcResult.assertionSummary;
      }
    } else {
      comment = "Test Case not executed.";
    }
    return comment;
  };
  
  return aFunction;
})();