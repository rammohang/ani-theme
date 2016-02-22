app.controller('BaseCtrl', function($scope, $http, $location, $rootScope, $localStorage) {
	$scope.alerts = [];
	
	$scope.goBack = function() {
		window.history.back();
	}
	
	$scope.addAlert = function(alert) {
		$scope.alerts.push(alert);
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
	
});