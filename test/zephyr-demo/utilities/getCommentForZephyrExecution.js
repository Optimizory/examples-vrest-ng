(function(){
  
  var aFunction = function(){
    let $tc = this.variables.$tc,
      $tr = this.variables.$tr,
      comment = [
      '*Test Run Name:* '+ $tr.details.name,
      '*API Endpoint:* '+ $tc.request.method + ' ' + $tc.request.url
    ];
    if($tc.details.summary){
      comment.push('*Summary:* ' + $tc.details.summary);
    }
    if($tc.details.iterationSummary){
      comment.push('*Iteration Summary:* ' + $tc.details.iterationSummary);
    }
    comment.push('*Executed By:* ' + $tr.details.executor.name + ' - ' + $tr.details.executor.email);
    comment.push('*Assertion Summary:*\n'+ $tc.result.assertionSummary);
    if($tc.result.resultLink){
      comment.push('*Result Link:*\n' + $tc.result.resultLink);
    }
    return comment.join('\n\n');
  };
  
  return aFunction;
})();