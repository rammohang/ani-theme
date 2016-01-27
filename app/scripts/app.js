'use strict';
/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular.module('yapp', [ 'ngRoute', 'ngAnimate', 'ngStorage' ]);

app.config(function($httpProvider) {
	 $httpProvider.interceptors.push('httpInterceptor');
});

app.factory('httpInterceptor', function ($q,$location,$rootScope, $localStorage) {
    return {
        request: function (config) {
        	var userDetails = $localStorage.userDetails;
        	console.log("==================== httpInterceptor ====================");
        	$rootScope.userDetails = userDetails;
        	if (!userDetails || !userDetails.userLoggedIn) {
        		$location.path('/login');
        	}
        	$rootScope.logout = function() {
        		$localStorage.userDetails = undefined;
        	};
            return config || $q.when(config);
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
	}).when('/scheduleBackup', {
		templateUrl : 'views/backUpScheduler.html',
		controller : 'BackupSchedulerCtrl'
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
app.directive('modal', function () {
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
              '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>'+
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


app.run(function($rootScope, $localStorage) {
	$rootScope.baseUrl = "http://localhost:8084/apigee_rest/services/";
	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
});

app.filter('pagination', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});
