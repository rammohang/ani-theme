app.controller('BackUpOrgCtrl',function($scope, $location, $rootScope, $http, $localStorage,AppService,$q,$uibModal, $log) {
	
	$scope.showModal = false;
	$scope.showBackups = false;
	$scope.proxyInfo = [];
	$scope.resourceInfo = [];
	$scope.developersInfo = [];
	$scope.productsInfo = [];
	$scope.appsInfo = [];
	$scope.orgs = [];
	$scope.showOther = false;
	$scope.orgText = "";
	$scope.orgHis = [];
	$scope.backupSchedules = [];
	$scope.periodicities = ['Weekly','Daily','Hourly'];
	
	$scope.curPage = 0;
	$scope.pageSize = 8;
	$scope.numberOfPages = function() {
		return Math.ceil($scope.orgHis.length / $scope.pageSize);
	};
	$scope.consoleInfo = {};
	var orgs = $rootScope.userDetails.organizations || [];
	for (var i = 0; i < orgs.length; i++) {
		$scope.orgs.push(orgs[i]);
	}
	$scope.orgs.push('Other');
	
	var commonConfiguration = {
		"userName" : $rootScope.userDetails.userName,
		"password" : $rootScope.userDetails.password
	};
    
	getScheduledBackups();
	
    var responsePromise = $http.post($rootScope.baseUrl
			+ "apigee/getorgbackuphistory1?sys="+"org", commonConfiguration, {});
	responsePromise.success(function(data, status, headers, config) {
		 $scope.orgHis = getProcessedHistory(data.orgBackUpInfoList);
	});		
	responsePromise.error(function(data, status, headers, config) {
		alert("oops !!! we are facing issues.");
	});
	
	//https://angular-ui.github.io/bootstrap/#/modal
	$scope.confirmAction = function(item, action) {
		var popupTitle = '';
		var bodyMsg = '' ;
		switch(action) {
		case 'delete':
			popupTitle = 'Delete Organization';
			bodyMsg = 'Are you Sure want to delete?<br/><br/>This will delete the backedup Organization.';
			break;
		case 'restore':
			popupTitle = 'Restore Organization';
			bodyMsg = 'Are you Sure want to restore?<br/><br/>This will replace the current revision of Organization.';
			break;
		}
		var modalInstance = $uibModal
				.open({
					animation : true,
					template : '<div >'
							+ '<div class="modal-header">'
							+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button>'
							+ '<h3 class="modal-title">'+ popupTitle +'</h3>'
							+ '</div>'
							+ '<div class="modal-body">'
							+ bodyMsg
							+ '</div>'
							+ '<div class="modal-footer">'
							+ '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button>'
							+ '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>'
							+ '</div>' + '</div>',
					controller : 'ConfirmPopupCtrl',
					size : undefined,
					resolve : {}
				});
		modalInstance.result.then(function() {
			switch(action) {
			case 'delete':
				$scope.deleteOrg(item.fileOid, item.organization);
				break;
			case 'restore':
				$scope.restoreOrg(item.fileOid, item.organization);
				break;
			}
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
  
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
		//$scope.showModal = !$scope.showModal;
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
		$scope.consoleInfo.proxyInfo = formattedArray;
		
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
		
		$scope.consoleInfo.resourceInfo = resourceArray;
		//3. APPS info to be displayed
		$scope.consoleInfo.appsInfo = JSON.parse(consoleInfo.appsInfo);
		//4. PRODUCTS info to be displayed
		var productData = JSON.parse(consoleInfo.productsInfo);
		$scope.consoleInfo.productsInfo = productData.PRODUCTS;
		$scope.consoleInfo.skippedProductsInfo = productData.SKIPPEDPRODUCTS;
		//5. DEV info to be displayed
		$scope.consoleInfo.developersInfo = JSON.parse(consoleInfo.developersInfo);
		$scope.open('lg');
	}
	
	$scope.disableButton = function(disable) {
		return disable;
	}
	
	$scope.deleteOrg = function(oid,filename) {
		for(var i = 0; i < $scope.orgHis.length; i++) {
			if(oid == $scope.orgHis[i].fileOid) {
				$scope.orgHis[i].deleteLoader = true;
				$scope.orgHis[i].disableButtons = true;
				break;
			}
		}
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?sys=org&oid="+oid, commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			for(var i = 0; i < $scope.orgHis.length; i++) {
				if($scope.orgHis[i].fileOid == oid) {
					$scope.orgHis[i].deleteLoader = false;
					$scope.orgHis[i].disableButtons = false;
					$scope.orgHis.splice(i, 1);
					break;
				}
			}
		});		
		responsePromise.error(function(data, status, headers, config) {
			alert("Submitting form failed!");
			for(var i = 0; i < $scope.orgHis.length; i++) {
				if($scope.orgHis[i].fileOid == oid) {
					$scope.orgHis[i].deleteLoader = false;
					$scope.orgHis[i].disableButtons = false;
					break;
				}
			}
		});
	}
	
	$scope.restoreOrg = function(oid,filename) {
		var org = $scope.organization;
		if($scope.organization == 'Other') {
			org = $scope.orgText;
		}
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : org
		};
		for(var i = 0; i < $scope.orgHis.length; i++) {
			if(oid == $scope.orgHis[i].fileOid) {
				$scope.orgHis[i].restoreLoader = true;
				$scope.orgHis[i].disableButtons = true;
				break;
			}
		}
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
				"status":"In Progress",
				"restoreLoader" : false,
				"deleteLoader": false
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
			// TODO in case backup fails
		});
	}
	
	$scope.saveBackupSchedule = function() {
		if(!$scope.scheduledOrg || !$scope.scheduledOrg) {
			alert('Please select organization and periodicity');
			return;
		}
		var backupSchedule = {
				"organization":$scope.scheduledOrg,
				"periodicity" : $scope.periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/save", backupSchedule, {});
		responsePromise.success(function(data, status, headers, config) {
			alert("schedule saved");
		});
		responsePromise.error(function(data, status, headers,
				config) {
			alert("Failed to save!");
		});
	}
	
	$scope.seeAllSchedules = function() {
		$scope.showBackups = !$scope.showBackups;
		getScheduledBackups();
	}
	
	$scope.changeScheduleOrg = function() {
		if(!$scope.scheduledOrg) {
			$scope.periodicity = '';
		} else {
			var flag = false;
			for(var i=0;i<$scope.backupSchedules.length;i++) {
				if($scope.backupSchedules[i].organization == $scope.scheduledOrg ) {
					flag = true;
					$scope.periodicity = $scope.backupSchedules[i].periodicity;
					break;
				}
			}
			if(!flag) {
				$scope.periodicity = '';
			}
		}
	}
	
	$scope.deleteScheduleOrg = function(id) {
		var scheduledBackup = {
				"id": id
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/delete", scheduledBackup, {});
		responsePromise.success(function(data, status, headers, config) {
			$scope.scheduledOrg = '';
			$scope.periodicity = '';
			for(var i = 0; i < $scope.backupSchedules.length; i++) {
				if($scope.backupSchedules[i].id == id) {
					$scope.backupSchedules.splice(i, 1);
					break;
				}
			}
		});
		responsePromise.error(function(data, status, headers,
				config) {
			alert("Failed to delete!");
		});
	}
	
	$scope.updateScheduleOrg = function(organization,periodicity) {
		var scheduledBackup = {
				"organization": organization,
				"periodicity":periodicity
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/save", scheduledBackup, {});
		responsePromise.success(function(data, status, headers, config) {
			alert("updated!");
		});
		responsePromise.error(function(data, status, headers,
				config) {
			alert("Failed to update!");
		});
	}
	
	function getScheduledBackups() {
		var user = {
				"email": $rootScope.userDetails.userName
		}
		var responsePromise = $http.post($rootScope.baseUrl+ "backup/schduledbackups", user, {});
		responsePromise.success(function(data, status, headers, config) {
			/*for(var i=0;i<data.length;i++) {
				data[i].periodicities = $scope.periodicities;
			}*/
			$scope.backupSchedules = data;
		});
		responsePromise.error(function(data, status, headers, config) {
			alert("Failed to retrieve!");
		});
	} 
	
	  $scope.animationsEnabled = true;

	  $scope.open = function (size) {

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	    	 consoleInfo: function () {
	          return $scope.consoleInfo;
	        }
	      }
	    });

	   /* modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });*/
	  };

});

