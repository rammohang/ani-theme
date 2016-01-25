app.service('AppService',['$http','$q',function($http,$q){

	var deferred = $q.defer();

	  this.getOrgBackUpHistory = function(commonConfiguration) {
	    return $http.post("http://localhost:8084/apigee_rest/services/apigee/getorgbackuphistory1", commonConfiguration, {})
	      .then(function(response) {
	        // promise is fulfilled
	        deferred.resolve(response.data);
	        return deferred.promise;
	      }, function(response) {
	        // the following line rejects the promise 
	        deferred.reject(response);
	        return deferred.promise;
	      });
	  };
	
	
}]);