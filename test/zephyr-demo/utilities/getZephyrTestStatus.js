(function(){

	var aFunction = function(isExecuted, isPassed){
	  let result;
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