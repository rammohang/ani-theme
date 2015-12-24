'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
app.controller('GetProxyCtrl', function($scope, $location, $rootScope,$http) {
$scope.proxyData = "";
    $scope.getAPIProxy = function(userName,password,organization,apiProxyName) {
    	  var commonConfiguration = {
		           "userName" : "mraviteja48@gmail.com",
		           "password" : "Ravi548$",
		           "organization" : $scope.organization,
		           "apiProxyName" : $scope.apiProxyName
		        };
		   console.log(commonConfiguration);
		
var responsePromise = $http.post($rootScope.baseUrl + "apigee/getapiproxy", commonConfiguration, {});
		   
		   responsePromise.success(function(data, status, headers, config) {
			   $scope.organization = "";
			   $scope.apiProxyName = "";
			   $scope.proxyData = data;
			   console.log($scope.proxyData);
  });
		   
		   responsePromise.error(function(data, status, headers, config) {
      alert("Submitting form failed!");
   });
	
    }

  });
