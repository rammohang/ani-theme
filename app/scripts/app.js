'use strict';
/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular.module('yapp', [ 'ngRoute', 'ngAnimate','ngStorage' ]);

app.config(function($httpProvider) {
	 $httpProvider.defaults.timeout = 50000;
});


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
			controller : 'CleanUpOrgCtrl'	
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
	}).when('/exportProxy',{
		templateUrl :'views/exportAPIProxy.html',
		controller : 'ExportProxyCtrl'
	}).when('/backupProxy', {
		templateUrl : 'views/backUpProxy.html',
		controller : 'BackUpProxyCtrl'
	}).when('/backUpResource', {
		templateUrl : 'views/backUpResource.html',
		controller : 'BackUpOrgResourceCtrl'
	}).when('/backUpApp', {
		templateUrl : 'views/backUpApp.html',
		controller : 'BackUpOrgAppCtrl'
	}).when('/backUpProducts', {
		templateUrl : 'views/backUpProducts.html',
		controller : 'BackUpOrgProdCtrl'
	}).when('/backUpDevelopers', {
		templateUrl : 'views/backUpDevelopers.html',
		controller : 'BackUpOrgDevCtrl'
	}).when('/cleanUpProxy', {
		templateUrl : 'views/cleanUpProxy.html',
		controller : 'CleanUpOrgProxyCtrl'
	}).when('/cleanUpResource', {
		templateUrl : 'views/cleanUpResource.html',
		controller : 'CleanUpOrgResourceCtrl'
	}).when('/cleanUpApp', {
		templateUrl : 'views/cleanUpApp.html',
		controller : 'CleanUpOrgAppCtrl'
	}).when('/cleanUpProducts', {
		templateUrl : 'views/cleanUpProducts.html',
		controller : 'CleanUpOrgProductsCtrl'
	}).when('/cleanUpDevelopers', {
		templateUrl : 'views/cleanUpDevelopers.html',
		controller : 'CleanUpOrgDevelopersCtrl'
	}).when('/restoreProxy', {
		templateUrl : 'views/restoreApiProxy.html',
		controller : 'RestoreOrgProxyCtrl'
	}).when('/restoreResource', {
		templateUrl : 'views/restoreResources.html',
		controller : 'RestoreOrgResourceCtrl'
	}).when('/restoreApps', {
		templateUrl : 'views/restoreApps.html',
		controller : 'RestoreOrgAppsCtrl'
	}).when('/restoreProducts', {
		templateUrl : 'views/restoreProducts.html',
		controller : 'RestoreOrgProductsCtrl'
	}).when('/restoreDevelopers', {
		templateUrl : 'views/restoreDevelopers.html',
		controller : 'RestoreOrgDevelopersCtrl'
	}).otherwise({
		redirectTo : '/login'
	});
});

// declare global constants here
app.run(function($rootScope,$localStorage) {
	$rootScope.baseUrl = "http://localhost:8080/apigee_rest/services/";
	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
});

app.controller('LoginCtrl', function($scope, $http, $location, $rootScope,$localStorage) {
	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	if(userDetails && userDetails.userLoggedIn == true) {
		$rootScope.userName = userDetails.userName;
		$rootScope.password = userDetails.password;
		$rootScope.displayName = userDetails.displayName;
		$rootScope.userLoggedIn = userDetails.userLoggedIn;
		$location.path('/dashboard');
	}
	
	$scope.submit = function() {
		var userDetails = {
			"email" : $scope.email,
			"password" : $scope.password
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "user/authenticate", userDetails, {});
		responsePromise.success(function(data, status, headers, config) {
			if(data.userName) {
				var userDetails = {};
				$rootScope.userName = userDetails.userName = data.email;
				$rootScope.password = userDetails.password = data.password;
				$rootScope.displayName = userDetails.displayName = data.userName;
				$rootScope.userLoggedIn = userDetails.userLoggedIn = true;
				$localStorage.userDetails = userDetails;
				$location.path('/dashboard');
			} else {
				alert("Invalid username/password. Please try again !!");
			}
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
		
	}
});

app.controller('DashboardCtrl', function($rootScope,$scope, $location) {
	
});

app.controller('DeleteProxyCtrl', function($http, $scope, $rootScope) {
	$scope.proxiesList = "";
	$scope.disable = false;
	
	$scope.getAPIProxies = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/listapiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.disable = true;
			$scope.apiProxyName = "";
			$scope.proxiesList = data;
			console.log($scope.proxiesList);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	
	
	
	$scope.deleteApiProxy = function() {
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
			$scope.disable = false;
			alert("success" + data)
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
});

app.controller('UndeployProxyCtrl', function($http, $scope, $rootScope) {
	$scope.proxiesList = [];
	$scope.envList = [];
	$scope.environment = {};
	$scope.revision = "";
	
	$scope.changeEnv = function() {
		$scope.revision = "";
		var selectedEnv = $scope.environment;
		if(selectedEnv.revision != null) {
			var revisions = selectedEnv.revision || [];
			if(revisions.length > 0) {
				$scope.revision = revisions[0].name;
			}
		}
	};
	
	$scope.getDeployedEnv = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/apiproxy/deployments", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.disable = true;
			$scope.envList = data.environment;
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	
	
	
	$scope.getAPIProxies = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/listapiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.disable = true;
			$scope.apiProxyName = "";
			$scope.proxiesList = data;
			console.log($scope.proxiesList);
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	
	
	$scope.undeployProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName,
			"environment" : $scope.environment.name,
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
	$scope.deployProxy = function() {
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
	$scope.createAPIProxy = function() {
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
	$scope.getAPIProxy = function() {
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
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	$scope.enable = true;
	
	$scope.catchKeys = function(){
		if($scope.organization.length > 0){
			$scope.enable = false;
		}else{
			$scope.enable = true;
		}
	}
	
	$scope.backUpOrg = function() {
		
	
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys="+"org", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Backup Created Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.filter('pagination', function()
		{
	 return function(input, start)
	 {
	  start = +start;
	  return input.slice(start);
	 };
	});

app.controller('RestoreOrgCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		
		 $scope.curPage = 0;
		 $scope.pageSize = 3;
		 $scope.numberOfPages = function() {
				return Math.ceil($scope.orgHis.length / $scope.pageSize);
			};
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys="+"org", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Org Data Fetched successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreOrg = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"org", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Organization Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});


app.controller('CleanUpOrgCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	$scope.cleanUpOrg = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanupsubsystems?sys="+"org", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Cleaned Organization Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('ExportProxyCtrl', function($scope, $rootScope, $http) {
	$scope.proxyData = {};
	$scope.exportAPIProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization,
			"apiProxyName" : $scope.apiProxyName,
			"revision" : $scope.revision
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/exportapiproxy", commonConfiguration, {});
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

app.controller('BackUpProxyCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.backUpAPIProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys="+"apiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "API Proxies backuped Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});



app.controller('BackUpOrgResourceCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.backUpOrgResource = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys="+"resources", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Resources backuped Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('BackUpOrgAppCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.backUpOrgApp = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys="+"apps", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "APPS backuped Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});

app.controller('BackUpOrgProdCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.backUpOrgProd = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys="+"apiproducts", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Products backuped Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('BackUpOrgDevCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.backUpOrgDev = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys="+"appdevelopers", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Developers backuped Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('CleanUpOrgProxyCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.cleanUpOrgAPIProxy = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanupsubsystems?sys="+"apiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "API Proxies cleaned Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});



app.controller('CleanUpOrgResourceCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.cleanUpOrgResource = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanupsubsystems?sys="+"resources", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Resources cleaned Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('CleanUpOrgAppCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.cleanUpOrgApps = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanupsubsystems?sys="+"apps", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "APPS cleaned Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('CleanUpOrgProductsCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.cleanUpOrgProducts = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanupsubsystems?sys="+"apiproducts", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Products cleaned Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});


app.controller('CleanUpOrgDevelopersCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.cleanUpOrgDevelopers = function() {
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanupsubsystems?sys="+"appdevelopers", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Developers cleaned Successfully\n";
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.showLoader = "N";
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
});

app.controller('RestoreOrgProxyCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		
		 $scope.curPage = 0;
		 $scope.pageSize = 3;
		 $scope.numberOfPages = function() {
				return Math.ceil($scope.orgHis.length / $scope.pageSize);
			};
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys="+"apiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Restored API Proxies successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreOrg = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"apiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Organization Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});



app.controller('RestoreOrgResourceCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		
		 $scope.curPage = 0;
		 $scope.pageSize = 3;
		 $scope.numberOfPages = function() {
				return Math.ceil($scope.orgHis.length / $scope.pageSize);
			};
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys="+"resources", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					//$scope.backUpzip+= "Restored API Proxies successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreOrg = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"resources", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Resources Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});


app.controller('RestoreOrgAppsCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		
		 $scope.curPage = 0;
		 $scope.pageSize = 3;
		 $scope.numberOfPages = function() {
				return Math.ceil($scope.orgHis.length / $scope.pageSize);
			};
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys="+"apps", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					//$scope.backUpzip+= "Restored API Proxies successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreApps = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"apps", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Resources Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});


app.controller('RestoreOrgProductsCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		
		 $scope.curPage = 0;
		 $scope.pageSize = 3;
		 $scope.numberOfPages = function() {
				return Math.ceil($scope.orgHis.length / $scope.pageSize);
			};
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys="+"apiproducts", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					//$scope.backUpzip+= "Restored API Proxies successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreProducts = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"apiproducts", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Resources Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});



app.controller('RestoreOrgDevelopersCtrl', function($scope, $location, $rootScope, $http) {
	
	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.orgHis = "";
	$scope.showLoader = "N";
	
	
	
	
	$scope.fetchOrgHistory = function() {
		$scope.showLoader = "Y";
		
		 $scope.curPage = 0;
		 $scope.pageSize = 3;
		 $scope.numberOfPages = function() {
				return Math.ceil($scope.orgHis.length / $scope.pageSize);
			};
		
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/getorgbackuphistory?sys="+"appdevelopers", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					//$scope.backUpzip+= "Restored API Proxies successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreDevelopers = function(oid,filename) {
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userName,
			"password" : $rootScope.password,
			"organization" : $scope.organization
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"appdevelopers", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.backUpzip+= "Developers Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});