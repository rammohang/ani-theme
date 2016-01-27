app.service('AppService',['$http','$rootScope','$q',function($http,$rootScope,$q){

	var deferred = $q.defer();

	  this.getOrgBackUpHistory = function(commonConfiguration) {
	    return $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory1?sys=org", commonConfiguration, {})
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
	  
	  
	  this.getProxyBackUpHistory = function(commonConfiguration) {
		    return $http.post($rootScope.baseUrl
					+ "apigee/getorgbackuphistory1?sys=apiproxies", commonConfiguration, {})
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