app.controller('BackUpOrgCtrl',function($scope, $location, $rootScope, $http, $localStorage,AppService,$q) {
	
	$scope.showModal = false;
	
	$scope.proxyInfo = [];
	$scope.resourceInfo = [];
	$scope.developersInfo = [];
	$scope.productsInfo = [];
	$scope.appsInfo = [];
		

	$scope.resourceMessageStatus = "";
	$scope.appsMessageStatus = "";
	$scope.productsMessageStatus = "";
	$scope.developersMessageStatus = "";

	$scope.filedir = "";

	$scope.proxyData = "";
	$scope.resourceData = "";

	$scope.enable = true;

	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	
	$scope.orgHis = [];
	$scope.consoleInfo = {};
	
	var orgs = $rootScope.userDetails.organizations || [];

	for (var i = 0; i < orgs.length; i++) {
		$scope.orgs.push(orgs[i]);
	}
	$scope.orgs.push('Other');
	
	
	
	var org = $scope.organization;
	if($scope.organization == 'Other') {
		org = $scope.orgText;
	}
	
	
	 $scope.curPage = 0;
	 $scope.pageSize = 5;
	 $scope.numberOfPages = function() {
		return Math.ceil($scope.orgHis.length / $scope.pageSize);
	 };
	 
	 function generateRandomString() {
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 16; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return text;
		}
		
		function getProcessedHistoryItem(dataItem) {
			var item = null;
			if(dataItem) {
				var item = {};
				for(var key in dataItem) {
					item[key]=dataItem[key];
				}
				item.disableButtons = false;
				item.status = "Completed";
				item.tempToken = "";
			}
			return item;
		}
		
		function getProcessedHistory(data) {
			var items = [];
			if(data) {
				var items = [];
				for(var i=0;i<data.length;i++) {
					var dataItem = data[i];
					var item = getProcessedHistoryItem(dataItem);
					items.push(item);
				}
			}
			return items;
		}
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+"org", commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.orgBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
  
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
	
	$scope.disableButton = function(disable) {
		return disable;
	}
	
	$scope.deleteOrg = function(oid,filename) {
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?oid="+oid, commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			for(var i = 0; i < $scope.orgHis.length; i++) {
				if($scope.orgHis[i].fileOid == oid) {
					$scope.orgHis.splice(i, 1);
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
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
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		console.log(commonConfiguration);
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"org", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.backUpzip+= "Organization Restored successfully\n";
					$scope.organization = "";
					$scope.orgHis = data;
					console.log($scope.orgHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}

	$scope.backUpOrg = function() {
		$scope.showStatus = true;
		var org = $scope.organization;
		
		if ($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		if(!org) {
			alert("No Organization Selected!!");
			return false;
		}

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
		$scope.orgHis.unshift(dbmodel);
		
		//1.call for backup proxies
		var responsePromise = $http.post($rootScope.baseUrl+ "apigee/backupsubsystems?sys=" + "org"+ "&saveandzip=true", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			var consoleInfo = data.orgBackUpInfo;
			for(var i=0;i<$scope.orgHis.length;i++) {
				if($scope.orgHis[i].tempToken==data.tempToken) {
					var dataItem = getProcessedHistoryItem(consoleInfo);
					$scope.orgHis[i]=dataItem;
					break;
				}
			}
		});

		responsePromise.error(function(data, status, headers,
				config) {
			alert("Submitting form failed!");
		});
	}
	console.log($scope.account);
	
});

