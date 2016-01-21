app.controller('DashboardCtrl', function($scope, $http, $location, $rootScope,
		$localStorage) {
	var userDetails = $localStorage.userDetails;
	$rootScope.userDetails = userDetails;
	if (!userDetails || !userDetails.userLoggedIn) {
		$location.path('/login');
	}
	$scope.logout = function() {
		$localStorage.userDetails = undefined;
	};
});