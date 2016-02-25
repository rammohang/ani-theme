'use strict';
/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular.module('yapp', [ 'ngRoute', 'ngAnimate', 'ngStorage','ui.bootstrap','ui.multiselect' ]);

app.run(function($rootScope, $localStorage, $location,$timeout,$sessionStorage) {
	$rootScope.baseUrl = "http://localhost:8084/apigee_rest/services/";
	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	$rootScope.noLoginRoutes = ['/login','/signUp'];
	$rootScope.routeMap = {
			"dashboard":['/dashboard'],
			"organization":['/backUpOrg','/backUpEnv'],
			"apiproxies":['/backupProxy','/cleanRevisions'],
			"publish":['/backUpProducts','/backUpDevelopers','/backUpApp','/backUpResource'],
			"monetize":['/monetizeApis'],
			"documentation":['/documentation', '/installationGuide'],
			"releaseManagement":['/releaseMgmt']
	};
	
	$rootScope.$on('$routeChangeStart', function (event) {
        var userDetails = $localStorage.userDetails;
    	$rootScope.userDetails = userDetails;
    	if (!userDetails || !userDetails.userLoggedIn) {
    		if($.inArray($location.path(), $rootScope.noLoginRoutes) == -1) {
    			$location.path('/login');
    		}
    	}
    });
	
	$rootScope.$on('$routeChangeSuccess', function (event) {
		// TODO
	});
	
	$rootScope.$on('$includeContentLoaded', function(event) {
		$timeout(function() {
			for(var key in $rootScope.routeMap) {
				if($.inArray($location.path(), $rootScope.routeMap[key]) != -1) {
					$('li.acmmenu').removeClass('active1');
					$('li.'+key).addClass('active1');
					break;
	    		}
			}
		}, 100);
	});
	
	$rootScope.logout = function() {
		$localStorage.userDetails = undefined;
		$sessionStorage.respondedForReleaseManagement = false;
	};
	
	$rootScope.apigeeSubsystems = {
		"org" : {
			"id" : "org",
			"name" : "Organization"
		},
		"apiproxies" : {
			"id" : "apiproxies",
			"name" : "API Proxies"
		},
		"apps" : {
			"id" : "apps",
			"name" : "Apps"
		},
		"resources" : {
			"id" : "resources",
			"name" : "Resources"
		},
		"apiproducts" : {
			"id" : "apiproducts",
			"name" : "Products"
		},
		"appdevelopers" : {
			"id" : "appdevelopers",
			"name" : "Developers"
		},
		"proxyrevision" : {
			"id" : "proxyrevision",
			"name" : "Proxy Revision"
		},
		"environments" : {
			"id" : "environments",
			"name" : "Environments"
		}
	};
	
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
	}).when('/backUpEnv', {
		templateUrl : 'views/backUpEnv.html',
		controller : 'BackUpEnvCtrl'
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
	}).when('/exportProxy', {
		templateUrl : 'views/exportAPIProxy.html',
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
	}).when('/importProxy', {
		templateUrl : 'views/importAPIProxy.html',
		controller : 'ImportProxyCtrl'
	}).when('/signUp', {
		templateUrl : 'views/signUp.html',
		controller : 'SignUpCtrl'
	}).when('/cleanRevisions', {
		templateUrl : 'views/cleanRevisions.html',
		controller : 'cleanRevisionsCtrl'
	}).when('/releaseMgmt', {
		templateUrl : 'views/release.html',
		controller : 'ReleaseManagementCtrl'
	}).when('/monetizeApis', {
		templateUrl : 'views/monetizeApis.html',
		controller : 'monetizeApisCtrl'
	}).when('/documentation', {
		templateUrl : 'views/documentation.html',
		controller : 'documentationCtrl'
	}).when('/installationGuide', {
		templateUrl : 'views/installationGuide.html',
		controller : 'installationGuideCtrl'
	}).when('/myAccount', {
		templateUrl : 'views/updateUserProfile.html',
		controller : 'MyAccountCtrl'
	}).when('/changePassword', {
		templateUrl : 'views/changePassword.html',
		controller : 'ChangePasswordCtrl'
	}).otherwise({
		redirectTo : '/login'
	});
});

// declare global constants here
app.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);

// http://jsfiddle.net/alexsuch/RLQhh/
app.directive('mymodal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog modal-acm">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' +
              '<div class="modal-footer">'+
              '<button type="button" class="btn btn-warning" data-dismiss="modal"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Close</button>'+
            '</div>'+
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
 });

app.directive('modal2', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog modal-acm">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' +
              '<div class="modal-footer">'+
            '</div>'+
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
 });


app.filter('pagination', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});

//https://angular-ui.github.io/bootstrap/#/modal
app.controller('ConfirmPopupCtrl', function($scope, $uibModalInstance) {
	$scope.ok = function() {
		$uibModalInstance.close();
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, consoleInfo) {

	$scope.consoleInfo = consoleInfo;
	  $scope.ok = function () {
	    $uibModalInstance.close();
	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };
});

app.controller('RestoreModalInstanceCtrl', function($scope, $uibModalInstance, $controller,formData) {
	$controller('BaseCtrl', {$scope: $scope}); //inherits BaseCtrl controller
	$scope.formData = formData;
	$scope.formData.organization = "";
	$scope.formData.newEnv = "";
	$scope.changeOrg = function() {
		if ($scope.formData.organization == 'Other') {
			$scope.formData.orgText = "";
			//$scope.formData.showOther = true;
			$scope.formData.envList = [];
		} else {
			$scope.formData.showOther = false;
			$scope.formData.envList = $scope.formData.orgMap[$scope.formData.organization] || [];
		}
	}

	$scope.ok = function() {
		var org = $scope.formData.organization;
		if (org == 'Other') {
			org = $scope.formData.orgText;
		}
		if (!$scope.formData.newEnv || !org) {
			$scope.addAlert({type : 'danger',msg : 'Please fill in all the fields!!'});
		} else {
			$uibModalInstance.close($scope.formData);
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
});

app.controller('CleanupProxiesModalInstanceCtrl', function($scope, $uibModalInstance,$controller, data) {
	$controller('BaseCtrl', {$scope: $scope}); //inherits BaseCtrl controller
	$scope.data = data;
	$scope.checkAll = function() {
		if ($scope.data.selectedAll) {
			$scope.data.selectedAll = true;
		} else {
			$scope.data.selectedAll = false;
		}
		for (var i = 0; i < $scope.data.proxies.length; i++) {
			$scope.data.proxies[i].selected = $scope.data.selectedAll;
		}
	};

	// helper method to get selected proxies
	$scope.data.selectedProxies = function() {
		return filterFilter($scope.data.proxies, {
			selected : true
		});
	};

	// watch proxies for changes
	$scope.$watch('data.proxies|filter:{selected:true}', function(nv) {
		$scope.data.proxiesList = nv.map(function(proxy) {
			return proxy.name;
		});
	}, true);

	$scope.ok = function() {
		if($scope.data.proxiesList.length > 0) {
			$uibModalInstance.close($scope.data);
		} else {
			$scope.addAlert({ type: 'danger', msg: 'Please select Proxies to be cleaned up.!!' });
		}
	};
	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});
