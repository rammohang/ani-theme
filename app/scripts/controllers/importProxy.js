app.controller('ImportProxyCtrl', [ '$scope', '$http', '$location','$rootScope', '$localStorage', 
                                    function($scope, $http, $location, $rootScope, $localStorage) {
	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	var orgs = $rootScope.userDetails.organizations || [];
	for (var i = 0; i < orgs.length; i++) {
		$scope.orgs.push(orgs[i]);
	}
	$scope.orgs.push('Other');
	$scope.changeOrg = function(event) {
		if ($scope.organization == 'Other') {
			$scope.orgText = "";
			$scope.showOther = true;
		} else {
			$scope.showOther = false;
		}
	}


	$scope.uploadFile = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		var userDetails = $localStorage.userDetails;
		$rootScope.userDetails = userDetails;
		$scope.showLoader = true;
		var userName = $rootScope.userDetails.userName;
		var password = $rootScope.userDetails.password;
		var file = $scope.fileObject;
		console.log('file is ');
		console.dir(file);
		var uploadUrl = $rootScope.baseUrl + "apigee/uploadproxy";
		var fd = new FormData();
		fd.append('file', file);
		fd.append('userName', userName);
		fd.append('password', password);
		fd.append('organization', org);

		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function(data, status, headers, config) {

			$scope.responseStatus = data.contextInfo;
			$scope.showLoader = false;
		}).error(function() {
			$scope.showLoader = false;
			alert("Submitting form failed!");
		});
	};

} ]);