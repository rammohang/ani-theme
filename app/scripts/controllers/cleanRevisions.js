app.controller('cleanRevisionsCtrl', function($scope, $http, $location,$rootScope, $localStorage) {
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
	
	var org = $scope.organization;
	if($scope.organization == 'Other') {
		org = $scope.orgText;
	}
	
	//call to display db records
	var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password
		};
	var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+"proxyrevision", commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.proxyRevHis = getProcessedHistory(data.proxyRevisionBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	//call to display db records finish
	$scope.cleanRevisions = function() {
		var org = $scope.organization;
		if($scope.organization == 'Other') {
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
		$scope.proxyRevHis.unshift(dbmodel);
		$scope.showLoader = true;
		//logic finish
		
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/cleanrevisions", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			var consoleInfo = data.proxyRevisionBackUpInfo;
			for(var i=0;i<$scope.proxyRevHis.length;i++) {
				if($scope.proxyRevHis[i].tempToken==data.tempToken) {
					var dataItem = getProcessedHistoryItem(consoleInfo);
					$scope.proxyRevHis[i]=dataItem;
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	//delete proxyRevision
	$scope.deleteProxyRevision = function(oid,filename) {
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?oid="+oid+"&sys=proxyrevision", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			for(var i = 0; i < $scope.proxyRevHis.length; i++) {
				if($scope.proxyRevHis[i].fileOid == oid) {
					$scope.proxyRevHis.splice(i, 1);
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	//restore ProxyRevision
	$scope.restoreProxyRevisionBackUp = function(oid,filename) {
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
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"proxyrevision", commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
					$scope.organization = "";
					$scope.proxyRevHis = data;
					console.log($scope.proxyRevHis);
				});		
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
		});
	}
	
	//display row data
	//Display row results
	$scope.viewDetailedStatus = function(consoleInfo) {
		// use this oid as a key to get detailed console info
		$scope.showModal = !$scope.showModal;
		// populate detailed into bootstrap modal
		
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
	
	}
	
	
	
	 $scope.curPage = 0;
	 $scope.pageSize = 5;
	 $scope.numberOfPages = function() {
		return Math.ceil($scope.proxyRevHis.length / $scope.pageSize);
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

	
});