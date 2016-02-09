app.controller('BackUpOrgProdCtrl', function($scope, $http, $location,
		$rootScope, $localStorage,AppService,$q) {

	
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
var responsePromise = $http.post($rootScope.baseUrl+"apigee/getorgbackuphistory1?sys=apiproducts", commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
					$scope.showLoader = "N";
					$scope.organization = "";
					$scope.proxyHis = getProcessedHistory(data.productBackUpInfoList);
		});		
	responsePromise.error(function(data, status, headers, config) {
					$scope.showLoader = "N";
			alert("Submitting form failed!");
	});	
	// call finish
	

	$scope.backUpAPIProduct = function() {
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
				+ "apigee/backupsubsystems?sys=" + "apiproducts&saveandzip=true",
				commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.organization = "";
			$scope.showLoader = "N";
			//load data
			//load data finish
			
			var consoleInfo = data.productBackUpInfo;
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
	
	
	
	$scope.deleteProductBackUp = function(oid,filename) {
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?oid="+oid+"&sys=apiproducts", commonConfiguration, {});
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
	
	$scope.restoreProxyBackUp = function(oid,filename) {
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
				+ "apigee/restoreorg?oid="+$scope.oid+"&filename="+$scope.filename+"&sys="+"apiproxies", commonConfiguration, {});
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
		
		// 1. Proxies Info to be displayed
		//4. PRODUCTS info to be displayed
		var productData = JSON.parse(consoleInfo.productInfo);
		console.log(productData+"---");
		$scope.productsInfo = productData.PRODUCTS;
		$scope.skippedProductsInfo = productData.SKIPPEDPRODUCTS;
	}
	
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
			item.restoreRevLoader = false;
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
	
	$scope.disableButton = function(disable) {
		return disable;
	}
	
	
	

	
});