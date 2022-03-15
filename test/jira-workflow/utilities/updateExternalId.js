(function(){

	var aFunction = function(externalId){
    let fs = require('fs');
    let path = require('path');
    
    let projectDir = this.variables.$projectDir,
      tcId = this.variables.$tc.details.id;
    
    let filePath = projectDir + path.sep + 'testcases' + path.sep + tcId + '.json';
    let contents = fs.readFileSync(filePath, "utf-8");
    let obj = JSON.parse(contents);
    if(obj.details.externalId){
      obj.details.externalId += "," + externalId;  
    } else {
      obj.details.externalId = externalId;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
	};
  
	return aFunction;
})();