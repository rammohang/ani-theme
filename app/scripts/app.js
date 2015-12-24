'use strict';
/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular.module('yapp', [ 'ngRoute', 'ngAnimate' ]);

app.config(function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'LoginCtrl'
	}).when('/dashboard', {
		templateUrl : 'views/dashboard.html',
		controller : 'DashboardCtrl'
	}).when('/backUpOrg', {
		templateUrl : 'views/backUpOrg.html',
		controller : 'BackUpOrgCtrl'
	}).when('/cleanOrg', {
		templateUrl : 'views/cleanOrg.html',
		controller : 'CleanOrgCtrl'
	}).when('/restoreOrg', {
		templateUrl : 'views/restoreOrg.html',
		controller : 'RestoreOrgCtrl'
	}).when('/deleteProxy', {
		templateUrl : 'views/deleteProxy.html',
		controller : 'DeleteProxyCtrl'
	}).when('/undeployProxy', {
		templateUrl : 'views/undeployProxy.html',
		controller : 'UndeployProxyCtrl'
	}).when('/deployProxy', {
		templateUrl : 'views/deployProxy.html',
		controller : 'DeployProxyCtrl'
	}).when('/createProxy', {
		templateUrl : 'views/createProxy.html',
		controller : 'CreateProxyCtrl'
	}).when('/getProxy', {
		templateUrl : 'views/getAPIProxy.html',
		controller : 'GetProxyCtrl'
	}).otherwise({
		redirectTo : '/login'
	});
});

// declare global constants here
app.run(function($rootScope) {
	$rootScope.baseUrl = "http://172.16.203.103:8080/apigee_rest/services/";
	$rootScope.userName = "mraviteja48@gmail.com";
	$rootScope.password = "Ravi548$";
});

app.controller('LoginCtrl', function($scope, $location, $rootScope) {
	$scope.submit = function() {
		$rootScope.userId = $scope.userId;
		$rootScope.password = $scope.password;
		// write authentication api call here.
		$scope.userLoggedIn = true; // this should be set to true, if authentication is successful
		// use $rootScope.baseUrl as prefix all the api calls
		// redirect to dashboard upon successful authentication.
		$location.path('/dashboard');
		return false;
	}
});

app.controller('DashboardCtrl', function($scope, $location) {
	
});

app.controller('DeleteProxyCtrl', function($http, $scope, $rootScope) {
	$scope.deleteApiProxy = function(userName, password, organization,
			apiProxyName) {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deleteapi", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('UndeployProxyCtrl', function($http, $scope, $rootScope) {
	$scope.undeployProxy = function(userName, password, organization,
			apiProxyName, environment, revision) {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName,
			"environment" : $scope.environment,
			"revision" : $scope.revision
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/undeployproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.environment = "";
			$scope.revision = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('DeployProxyCtrl', function($http, $scope, $rootScope) {
	$scope.deployProxy = function(userName, password, organization,
			apiProxyName, environment, revision) {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName,
			"environment" : $scope.environment,
			"revision" : $scope.revision
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deployapiproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			$scope.environment = "";
			$scope.revision = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('CreateProxyCtrl', function($http, $scope, $rootScope) {
	$scope.createAPIProxy = function(userName, password, organization,
			apiProxyName, environment, revision) {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/createproxy", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.apiProxyName = "";
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('GetProxyCtrl', function($scope, $location, $rootScope, $http) {
	$scope.proxyData = "";
	$scope.getAPIProxy = function(userName, password, organization,
			apiProxyName) {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getapiproxy", commonConfiguration, {});
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

app.controller('BackUpOrgCtrl', function($scope, $location, $rootScope, $http) {
	$scope.proxyData = "";
	$scope.backUpOrg = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"backupLocation" : $scope.backupLocation
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backuporg", commonConfiguration, {});
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