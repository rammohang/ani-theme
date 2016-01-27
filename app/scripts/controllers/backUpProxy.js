app.controller('BackUpProxyCtrl', function($scope, $http, $location,
		$rootScope, $localStorage,AppService,$q) {
	$scope.proxyHis = [];
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

	$scope.backUpzip = "";
	$scope.proxyData = "";
	$scope.showLoader = "N";
	
	$scope.curPage = 0;
	 $scope.pageSize = 3;
	 $scope.numberOfPages = function() {
			return Math.ceil($scope.proxyHis.length / $scope.pageSize);
		};
	// call to display records in mongo
	var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password
		};
		console.log(commonConfiguration);
		
		
		AppService.getProxyBackUpHistory(commonConfiguration).then(function(result) {
	    	  $scope.proxyHis = result.proxyBackUpInfoList;
	      },function(error) {
	        // handle errors here
	        console.log(error.statusText);
	      }
	    );
	// call finish
	

	$scope.backUpAPIProxy = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys=" + "apiproxies&saveandzip=true",
				commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.backUpzip += "API Proxies backuped Successfully\n";
			$scope.organization = "";
			$scope.proxyData = data;
			console.log($scope.proxyData);
			$scope.showLoader = "N";
			// call to load data
			var commonConfiguration = {
					"userName" : $rootScope.userDetails.userName,
					"password" : $rootScope.userDetails.password
				};
	var responsePromise = $http.post($rootScope.baseUrl+"apigee/getorgbackuphistory1?sys=apiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
						$scope.showLoader = "N";
						$scope.organization = "";
						$scope.proxyHis = data.proxyBackUpInfoList;
			var Seconds_Between_Dates = Math.abs((t1.getTime() - new Date().getTime())/1000);
				alert("Completed in " + Seconds_Between_Dates + ' Seconds');
			});		
		responsePromise.error(function(data, status, headers, config) {
						$scope.showLoader = "N";
				alert("Submitting form failed!");
		});		
			// call to load data finish
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
	$scope.deleteProxyBackUp = function(oid,filename) {
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?oid="+oid+"&sys=apiproxies", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			for(var i = 0; i < $scope.proxyHis.length; i++) {
				if($scope.proxyHis[i].fileOid == oid) {
					$scope.proxyHis.splice(i, 1);
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
});