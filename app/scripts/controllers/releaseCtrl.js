app.controller('ReleaseManagementCtrl', function($scope, $http, $location,$rootScope, $localStorage) {
	
	$scope.showModal = false;
	$scope.proxyInfo = [];
	$scope.resourceInfo = [];
	$scope.developersInfo = [];
	$scope.productsInfo = [];
	$scope.appsInfo = [];
	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	$scope.orgHis = [];
	
	$scope.curPage = 0;
	$scope.pageSize = 8;
	
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
		
		
		// call to restore org to different env
		$scope.restoreToDifferentEnv = function(oid,filename) {
			var org = $scope.organization;
			if ($scope.organization == 'Other') {
				org = $scope.orgText;
			}
			console.log(oid,filename,org,$scope.newEnv+"====");
			var commonConfiguration = {
					"userName" : $rootScope.userDetails.userName,
					"password" : $rootScope.userDetails.password,
					"organization" : filename,
					"newOrg" : org,
					"newEnv" : $scope.newEnv
				};
			
			
			console.log(commonConfiguration);
			
			
			var responsePromise = $http.post($rootScope.baseUrl
					+ "apigee/restoreorg?oid="+oid+"&filename="+filename+"&sys="+"org", commonConfiguration, {});
			responsePromise.success(function(data, status, headers, config) {
				for(var i = 0; i < $scope.orgHis.length; i++) {
					if(oid == $scope.orgHis[i].fileOid) {
						$scope.orgHis[i].restoreLoader = false;
						$scope.orgHis[i].disableButtons = false;
						break;
					}
				}
			});		
			responsePromise.error(function(data, status, headers, config) {
				alert("Submitting form failed!");
				for(var i = 0; i < $scope.orgHis.length; i++) {
					if(oid == $scope.orgHis[i].fileOid) {
						$scope.orgHis[i].restoreLoader = false;
						$scope.orgHis[i].disableButtons = false;
						break;
					}
				}
			});
			
			
			
			
		};
		
		
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
			var productData = JSON.parse(consoleInfo.productsInfo);
			$scope.productsInfo = productData.PRODUCTS;
			$scope.skippedProductsInfo = productData.SKIPPEDPRODUCTS;
			//5. DEV info to be displayed
			$scope.developersInfo = JSON.parse(consoleInfo.developersInfo);
		}
		
		$scope.numberOfPages = function() {
			return Math.ceil($scope.orgHis.length / $scope.pageSize);
		};
	
	
});