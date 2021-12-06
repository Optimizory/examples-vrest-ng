(function(){

	var aFunction = function(filePath){
	  
	  let projectDir = this.variables.$projectDir;
		
		//for windows
		if(process.platform === "win32"){
		  if(filePath.includes('/')){
		    let regex = /[/]/g;
		    filePath = filePath.replace(regex, "\\");
		  }
		}
		filePath = projectDir + filePath;
		
		return filePath;
	};

	return aFunction;
})();