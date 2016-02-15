app.controller('BackUpCommonCtrl',function($scope, $location, $rootScope, $http, $localStorage,AppService,$q,$uibModal, $log) {
	
	$scope.subsystem = '';
	$scope.subsystemid = '';
	$scope.pageHeading = '';
	$scope.showOrgBackupSchedules = false;
	$scope.showModal = false;
	$scope.showBackups = false;
	$scope.showBackupBtn = true;
	$scope.showCleanupBtn = true;
	$scope.backupupLoader = false;
	$scope.cleanupLoader = false;
	
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
	
	//https://angular-ui.github.io/bootstrap/#/modal
	$scope.confirmAction = function(item, action) {
		var popupTitle = '';
		var bodyMsg = '' ;
		switch(action) {
		case 'delete':
			popupTitle = 'Delete';
			bodyMsg = 'Are you Sure want to delete?<br/><br/>This will delete the backedup Version.';
			break;
		case 'restore':
			popupTitle = 'Restore';
			bodyMsg = 'Are you Sure want to restore?<br/><br/>This will replace the current revision.';
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
							+ '<button class="btn btn-primary" type="button" ng-click="ok()"><span class="glyphicon glyphicon-ok" aria-hidden="true"> OK</button>'
							+ '<button class="btn btn-warning" type="button" ng-click="cancel()"><span class="glyphicon glyphicon-remove" aria-hidden="true"> Cancel</button>'
							+ '</div>' + '</div>',
					controller : 'ConfirmPopupCtrl',
					size : undefined,
					resolve : {}
				});
		modalInstance.result.then(function() {
			switch(action) {
			case 'delete':
				$scope.deleteItem(item.fileOid, item.organization);
				break;
			case 'restore':
				$scope.restoreItem(item.fileOid, item.organization);
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
	
	$scope.disableButton = function(disable) {
		return disable;
	}
	
	$scope.deleteItem = function(oid,filename) {
		for(var i = 0; i < $scope.orgHis.length; i++) {
			if(oid == $scope.orgHis[i].fileOid) {
				$scope.orgHis[i].deleteLoader = true;
				$scope.orgHis[i].disableButtons = true;
				break;
			}
		}
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/deletebackup?sys="+$scope.subsystemid+"&oid="+oid, commonConfiguration, {});
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
	
	$scope.restoreItem = function(oid,filename) {
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
				+ "apigee/restoreorg?oid="+oid+"&filename="+filename+"&sys="+$scope.subsystemid, commonConfiguration, {});
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

	$scope.backUp = function(action,data) {
		$scope.data = data;
		
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
		
		if(data) {
			commonConfiguration.proxiesList = data.proxiesList;
			console.dir(commonConfiguration);
		} else {
			if($scope.subsystemid == $rootScope.apigeeSubsystems.apiproxies.id && action == 'cleanup') {
				// refer to backUpProxy.js
				$scope.showCleanupProxies(commonConfiguration);
				return;
			}
		}
		
		var dbmodel = {
				"organization" : org,
				"tempToken":tempToken,
				"disableButtons": true,
				"status":"In Progress",
				"restoreLoader" : false,
				"deleteLoader": false
		}
		$scope.orgHis.unshift(dbmodel);
		
		$scope.showStatus = true; 
		var url = $rootScope.baseUrl+ "apigee/backupsubsystems?sys="+ $scope.subsystemid +"&saveandzip=true&action="+action;
		if($scope.subsystemid == $rootScope.apigeeSubsystems.proxyrevision.id) {
			url = $rootScope.baseUrl + "apigee/cleanrevisions";
		}
		
		//1.call for backup proxies
		var responsePromise = $http.post(url, commonConfiguration, {});
		responsePromise.success(function(data, status, headers, config) {
			var consoleInfo = {};
			switch($scope.subsystemid) {
			case $rootScope.apigeeSubsystems.org.id:
				consoleInfo = data.orgBackUpInfo;
				break;
			case $rootScope.apigeeSubsystems.apiproxies.id:
				consoleInfo = data.proxyBackUpInfo;
				break;
			case $rootScope.apigeeSubsystems.apps.id:
				consoleInfo = data.appBackUpInfo;
				break;
			case $rootScope.apigeeSubsystems.resources.id:
				consoleInfo = data.resourceBackUpInfo;
				break;
			case $rootScope.apigeeSubsystems.apiproducts.id:
				consoleInfo = data.productBackUpInfo;
				break;
			case $rootScope.apigeeSubsystems.appdevelopers.id:
				consoleInfo = data.developersInfo;
				break;
			case $rootScope.apigeeSubsystems.proxyrevision.id:
				consoleInfo = data.proxyRevisionBackUpInfo;
				break;
			}
			
			for(var i=0;i<$scope.orgHis.length;i++) {
				if($scope.orgHis[i].tempToken==data.tempToken) {
					var dataItem = getProcessedHistoryItem(consoleInfo);
					$scope.orgHis[i]=dataItem;
					break;
				}
			}
		});
		responsePromise.error(function(data, status, headers,config) {
			alert("Backup failed!");
			for(var i=0;i<$scope.orgHis.length;i++) {
				if($scope.orgHis[i].tempToken==tempToken) {
					$scope.orgHis.splice(i, 1);
					break;
				}
			}
		});
	}
	
});

