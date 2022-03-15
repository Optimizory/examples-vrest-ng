(function(){
  var base64 = function(str){
    if (typeof btoa === 'undefined') {
      return Buffer.from(str, "binary").toString('base64');
    } else {
      return btoa(str);
    }
  };
  
	var aFunction = function(){
    let token = this.variables.jiraUsername + ":" + this.variables.jiraApiToken;
    
    return "Basic " + base64(unescape(encodeURIComponent(token)));
	};

	return aFunction;
})();