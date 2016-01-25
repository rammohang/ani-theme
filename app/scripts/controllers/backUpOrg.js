app.controller('BackUpOrgCtrl',function($scope, $location, $rootScope, $http, $localStorage,AppService,$q) {
	
	$scope.showModal = false;
	
	$scope.proxyInfo = [];
	$scope.resourceInfo = [];
	$scope.developersInfo = [];
	$scope.productsInfo = [];
	$scope.appsInfo = [];
		

	$scope.proxyMessageStatus = "";
	$scope.resourceMessageStatus = "";
	$scope.appsMessageStatus = "";
	$scope.productsMessageStatus = "";
	$scope.developersMessageStatus = "";

	$scope.filedir = "";

	$scope.proxyData = "";
	$scope.resourceData = "";

	$scope.showLoader = false;
	$scope.enable = true;

	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	
	$scope.currentProgress="";
	$scope.orgHis = [];
	$scope.consoleInfo = {};
	
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
	
	$scope.viewDetailedStatus = function(consoleInfo) {
		// use this oid as a key to get detailed console info
		$scope.showModal = !$scope.showModal;
		// populate detailed into bootstrap modal
		//$scope.consoleInfo = consoleInfo;
		
		// 1. Proxies Info to be displayed
		var proxyInfo = JSON.parse(consoleInfo.proxyInfo);
		var formattedArray = [];
		for(var i=0;i<proxyInfo.length;i++) {
		  var proxyObj = proxyInfo[i];
		  var singleProxyInfo = {};
		  singleProxyInfo["proxyName"]=Object.keys(proxyObj)[0];
		  var proxyContents = proxyObj[singleProxyInfo["proxyName"]];
		  for(var key in proxyContents) {
		    singleProxyInfo[key] = proxyContents[key];
		  }
		  formattedArray.push(singleProxyInfo);
		}
		console.log(formattedArray);
		$scope.proxyInfo = formattedArray;
		
		// 2.Resource Info to be displayed
		var resourceInfo = JSON.parse(consoleInfo.resourceInfo);
		var resourceArray = [];
		for(var i=0;i<resourceInfo.length;i++) {
		  var proxyObj = resourceInfo[i];
		  var singleResourceInfo = {};
		  singleResourceInfo["envName"]=Object.keys(proxyObj)[0];
		  var proxyContents = proxyObj[singleResourceInfo["envName"]];
		  for(var key in proxyContents) {
		    singleResourceInfo[key] = proxyContents[key];
		  }
		  resourceArray.push(singleResourceInfo);
		}
		
		$scope.resourceInfo = resourceArray;
		
		//3. APPS info to be displayed
		$scope.appsInfo = JSON.parse(consoleInfo.appsInfo);
		//4. PRODUCTS info to be displayed
		$scope.productsInfo = JSON.parse(consoleInfo.productsInfo);
		//5. DEV info to be displayed
		$scope.developersInfo = JSON.parse(consoleInfo.developersInfo);
	}
	

	var org = $scope.organization;
	if($scope.organization == 'Other') {
		org = $scope.orgText;
	}
	
	$scope.showLoader = "Y";
	
	 $scope.curPage = 0;
	 $scope.pageSize = 3;
	 $scope.numberOfPages = function() {
			return Math.ceil($scope.orgHis.length / $scope.pageSize);
		};
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
	console.log(commonConfiguration);
	
	
	AppService.getOrgBackUpHistory(commonConfiguration).then(function(result) {
    	  $scope.orgHis = result;
      },function(error) {
        // handle errors here
        console.log(error.statusText);
      }
    );
	/*var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory?sys="+"org", commonConfiguration, {});
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
	*/
	
	
	
	$scope.deleteOrg = function(oid,filename) {
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?oid="+oid, commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			for(var i = 0; i < $scope.orgHis.length; i++) {
				if($scope.orgHis[i]._id == oid) {
					$scope.orgHis.splice(i, 1);
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
			$scope.showLoader = "N";
			alert("Submitting form failed!");
		});
	}
	
	$scope.restoreOrg = function(oid,filename) {
		var org = $scope.organization;
		if($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		alert(oid);
		$scope.oid = oid;
		$scope.filename = filename;
		$scope.showLoader = "Y";
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
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

	$scope.backUpOrg = function() {
		$scope.showStatus = true;
		var t1 = new Date();
		var org = $scope.organization;
		
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}

		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		
		var dbmodel = {
				"uploadDate":{
					"$date":"--"
				},
				"filename":org,
				"_id": -1
		}
		$scope.orgHis.unshift(dbmodel);
		
		$scope.showLoader = true;
		$scope.proxiesLoader = true;
		console.log(commonConfiguration);
		//1.call for backup proxies
		$scope.currentProgress="Proxies being backedup";
		var responsePromise = $http.post($rootScope.baseUrl+ "apigee/backupsubsystems?sys=" + "org"+ "&saveandzip=true", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.proxyMessageStatus += "Proxies Backed Successfully";
					$scope.proxiesLoader = false;
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.filedir = $scope.proxyData.dir;
					$scope.showLoader = false;
					
					$scope.showProxiesStatus = true;
								
					
//call to display table in ui
				var commonConfiguration = {
							"userName" : $rootScope.userDetails.userName,
							"password" : $rootScope.userDetails.password
						};
			var responsePromise = $http.post($rootScope.baseUrl+"apigee/getorgbackuphistory?sys="+"org", commonConfiguration, {});
				responsePromise.success(function(data, status, headers, config) {
								$scope.showLoader = "N";
								$scope.organization = "";
								$scope.orgHis = data;
					var Seconds_Between_Dates = Math.abs((t1.getTime() - new Date().getTime())/1000);
						alert("Completed in " + Seconds_Between_Dates + ' Seconds');
					});		
				responsePromise.error(function(data, status, headers, config) {
								$scope.showLoader = "N";
						alert("Submitting form failed!");
				});														
//call finish
			});

		responsePromise.error(function(data, status, headers,
				config) {
			$scope.showLoader = false;
			alert("Submitting form failed!");
		});

	}
	console.log($scope.account);
});

