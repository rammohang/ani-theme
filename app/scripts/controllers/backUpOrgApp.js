app.controller('BackUpOrgAppCtrl', function($scope, $http, $location,$rootScope, $localStorage) {
	
	$scope.proxyHis = [];
	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	$scope.restoreRevLoader = false;
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
	var responsePromise = $http.post($rootScope.baseUrl+"apigee/getorgbackuphistory1?sys=apps", commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
				$scope.showLoader = "N";
				$scope.organization = "";
				$scope.proxyHis = getProcessedHistory(data.appBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
				$scope.showLoader = "N";
		alert("Submitting form failed!");
	});	
	// call finish

	$scope.backUp = function() {
		var org = $scope.organization;
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		
		//logic to push temp array
		var tempToken = generateRandomString();
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org,
			"tempToken" : tempToken
		};
		console.dir(commonConfiguration);
		var dbmodel = {
				"organization" : org,
				"tempToken":tempToken,
				"disableButtons": true,
				"status":"In Progress"
		}
		$scope.proxyHis.unshift(dbmodel);
		$scope.showLoader = true;
		//logic finsih
		$scope.showLoader = "Y";
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys=apps&saveandzip=true",
				commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.showLoader = "N";
			//load data
			//load data finish
			
			var consoleInfo = data.appBackUpInfo;
			for(var i=0;i<$scope.proxyHis.length;i++) {
				if($scope.proxyHis[i].tempToken==data.tempToken) {
					var dataItem = getProcessedHistoryItem(consoleInfo);
					$scope.proxyHis[i]=dataItem;
					break;
				}
			}
			
		});
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	
	
	$scope.deleteBackup = function(oid,filename) {
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?oid="+oid+"&sys=apps", commonConfiguration, {});
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
	
	$scope.restoreBackUp = function(oid,filename) {
		$scope.restoreRevLoader = true;
		var tempToken = generateRandomString();
		var org = $scope.organization;
		if($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		
		$scope.oid = oid;
		$scope.filename = filename;
		
		for(var i=0;i<$scope.proxyHis.length;i++){
			if($scope.proxyHis[i].fileOid==oid){
				$scope.proxyHis[i].restoreRevLoader = true;
				break;
			}
		}
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org,
			"tempToken" : tempToken
		};
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys=apps", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			var tempToken = data.tempToken;
			for(var i = 0; i < $scope.proxyHis.length; i++) {
				if($scope.proxyHis[i].fileOid == oid) {
					$scope.proxyHis[i].restoreRevLoader = false;
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	//Display row data
	$scope.viewDetailedStatus = function(consoleInfo) {
		// use this oid as a key to get detailed console info
		$scope.showModal = !$scope.showModal;
		// populate detailed into bootstrap modal
		$scope.appsInfo = JSON.parse(consoleInfo.appInfo);
	}
	
	$scope.disableButton = function(disable) {
		return disable;
	}
	
});