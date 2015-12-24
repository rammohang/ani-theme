'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular
  .module('yapp', [
    'ngRoute',
    'ngAnimate'
  ]);


app.controller('delteProxyController', function($http,$scope,$rootScope) {
	
	   $scope.deleteApiProxy = function(userName,password,organization,apiProxyName){
		   
		   var commonConfiguration = {
		           "userName" : "mraviteja48@gmail.com",
		           "password" : "Ravi548$",
		           "organization" : $scope.organization,
		           "apiProxyName" : $scope.apiProxyName
		            
				   
		        };
		   var targetUrl = $rootScope.baseUrl + "apigee/deleteapi";
		   var req = {
				   method: 'POST',
				   url: targetUrl,
				   headers: {
				     'Content-Type': "application/json",
				     'Accept' : "application/json"
				   },
				   data: commonConfiguration
				  }
		   
	       
		   $http(req).then(function successCallback(response) {
			   alert("successCallback");
			    // this callback will be called asynchronously
			    // when the response is available
			  }, function errorCallback(response) {
				  alert("errorCallback");
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
		   
		   responsePromise.success(function(data, status, headers, config) {
              $scope.organization = "";
              $scope.apiProxyName = "";
			   alert("success"+data)
           });
		   
		   responsePromise.error(function(data, status, headers, config) {
               alert("Submitting form failed!");
            });
		   	
	    }
	
	
});

app.controller('undeployProxyController', function($http,$scope,$rootScope) {
	
	   $scope.undeployProxy = function(userName,password,organization,apiProxyName,environment, revision){
		   
		   var commonConfiguration = {
		           "userName" : "mraviteja48@gmail.com",
		           "password" : "Ravi548$",
		           "organization" : $scope.organization,
		           "apiProxyName" : $scope.apiProxyName,
		           "environment" : $scope.environment,
		           "revision" : $scope.revision
		            
				   
		        };
		   console.log(commonConfiguration);
		   
	       
		   var responsePromise = $http.post($rootScope.baseUrl + "apigee/undeployproxy", commonConfiguration, {});
		   
		   responsePromise.success(function(data, status, headers, config) {
			   $scope.organization = "";
			   $scope.apiProxyName = "";
			   $scope.environment = "";
			   $scope.revision = "";
			   alert("success"+data)
        });
		   
		   responsePromise.error(function(data, status, headers, config) {
            alert("Submitting form failed!");
         });
		   
		   	
	    }
	
	
});

app.controller('deployProxyController', function($http,$scope,$rootScope) {
	
	   $scope.deployProxy = function(userName,password,organization,apiProxyName,environment, revision){
		   
		   var commonConfiguration = {
		           "userName" : "mraviteja48@gmail.com",
		           "password" : "Ravi548$",
		           "organization" : $scope.organization,
		           "apiProxyName" : $scope.apiProxyName,
		           "environment" : $scope.environment,
		           "revision" : $scope.revision
		            
				   
		        };
		   console.log(commonConfiguration);
		   
	       
		   var responsePromise = $http.post($rootScope.baseUrl + "apigee/deployapiproxy", commonConfiguration, {});
		   
		   responsePromise.success(function(data, status, headers, config) {
			   $scope.organization = "";
			   $scope.apiProxyName = "";
			   $scope.environment = "";
			   $scope.revision = "";
			   alert("success"+data)
     });
		   
		   responsePromise.error(function(data, status, headers, config) {
         alert("Submitting form failed!");
      });
		   
		   	
	    }
	
	
});


app.controller('createProxyController', function($http,$scope,$rootScope) {
	
	   $scope.createAPIProxy = function(userName,password,organization,apiProxyName,environment, revision){
		   
		   var commonConfiguration = {
		           "userName" : "mraviteja48@gmail.com",
		           "password" : "Ravi548$",
		           "organization" : $scope.organization,
		           "apiProxyName" : $scope.apiProxyName
		        };
		   console.log(commonConfiguration);
		   
	       
		   var responsePromise = $http.post($rootScope.baseUrl + "apigee/createproxy", commonConfiguration, {});
		   
		   responsePromise.success(function(data, status, headers, config) {
			   $scope.organization = "";
			   $scope.apiProxyName = "";
			   alert("success"+data)
  });
		   
		   responsePromise.error(function(data, status, headers, config) {
      alert("Submitting form failed!");
   });
		   
		   	
	    }
	
	
});

app.config(function($routeProvider) {
    $routeProvider.
    when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
       
    }).
    when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
       
    }).
    when('/backUpOrg', {
        templateUrl: 'views/backUpOrg.html',
        controller: 'backUpOrgController'
       
    }).
    when('/cleanOrg', {
        templateUrl: 'views/cleanOrg.html',
        controller: 'cleanOrgController'
       
    }).
    when('/restoreOrg', {
        templateUrl: 'views/restoreOrg.html',
        controller: 'restoreOrgController'
       
    }).
    when('/deleteProxy', {
        templateUrl: 'views/deleteProxy.html',
        controller: 'delteProxyController'
       
    }).  
    when('/undeployProxy', {
        templateUrl: 'views/undeployProxy.html',
        controller: 'undeployProxyController'
       
    }).
    when('/deployProxy', {
        templateUrl: 'views/deployProxy.html',
        controller: 'deployProxyController'
       
    }).
    
    when('/createProxy', {
        templateUrl: 'views/createProxy.html',
        controller: 'createProxyController'
       
    }).
    
    when('/getProxy', {
        templateUrl: 'views/getAPIProxy.html',
        controller: 'GetProxyCtrl'
       
    }).
    
    otherwise({
        redirectTo: '/login'
    });
});

// declare global constants here
app.run(function ($rootScope) {
    $rootScope.baseUrl = "http://localhost:8080/apigee_rest/services/";
});
