'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
app.controller('LoginCtrl', function($scope, $location, $rootScope) {

    $scope.submit = function() {
    	
		$rootScope.userId = $scope.userId;
		$rootScope.password = $scope.password;
		
		// write authentication api call here.
		$userLoggedIn = true; // this should be set to true, if authentication is successful 
		
		// redirect to dashboard upon successful authentication.
		$location.path('/dashboard');
	
		return false;
    }

  });
