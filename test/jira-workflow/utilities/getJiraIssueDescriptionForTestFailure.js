(function(){

	var aFunction = function(){
		let $tc = this.variables.$tc,
      $tr = this.variables.$tr,
      description = [
      '--- *Test Case Failure Notification* ---',
      '*Test Run Name:* '+ $tr.details.name,
      '*API Endpoint:* '+ $tc.request.method + ' ' + $tc.request.url
    ];
    if($tc.details.summary){
      description.push('*Summary:* ' + $tc.details.summary);
    }
    if($tc.details.iterationSummary){
      description.push('*Iteration Summary:* ' + $tc.details.iterationSummary);
    }
    description.push('*Executed By:* ' + $tr.details.executor.name + ' - ' + $tr.details.executor.email);
    description.push('*Assertion Summary:*\n'+ $tc.result.assertionSummary);
    if($tc.result.resultLink){
      description.push('*Result Link:*\n' + $tc.result.resultLink);
    }
    return description.join('\n');
	};

	return aFunction;
})();