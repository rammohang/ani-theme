app.controller('ReleaseManagementCtrl', function($scope, $http, $location,$rootScope, $localStorage,$uibModal,$log,$controller) {
	
	$controller('BackUpOrgCtrl', {$scope: $scope}); //inherits BackUpCommonCtrl controller
	$scope.subsystem = undefined;
	$scope.releaseManagement = true;
	$scope.showOrgBackupSchedules = false;
	$scope.animationsEnabled = true;
	$scope.formData = {};
	$scope.formData.orgs = [];
	$scope.formData.showOther = false;
	
	var orgs = $rootScope.userDetails.organizations || [];
	for (var i = 0; i < orgs.length; i++) {
		$scope.formData.orgs.push(orgs[i]);
	}
	$scope.formData.orgs.push('Other');
	
	//https://angular-ui.github.io/bootstrap/#/modal
	$scope.confirmAction = function(item, action) {
		var popupTitle = '';
		var bodyMsg = '' ;
		switch(action) {
		case 'delete':
			popupTitle = 'Delete Organization';
			bodyMsg = 'Are you Sure want to delete?<br/><br/>This will delete the backedup Organization.';
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
				$scope.deleteItem(item.fileOid, item.organization);
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
			break;
			case 'restore':
				$scope.openModal(item, action);
			break;
		}
	};
	
    $scope.openModal = function(item, action) {
		var modalInstance = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'restoreModalContent.html',
			controller : 'RestoreModalInstanceCtrl',
			size : undefined,
			resolve : {
				formData : function() {
					return $scope.formData;
				}
			}
		});

		modalInstance.result.then(function(formData) {
			$scope.formData = formData;
			$scope.restoreToDifferentEnv(item.fileOid,
					item.organization);
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	  
	// call to restore org to different env
	$scope.restoreToDifferentEnv = function(oid,filename) {
		var tempToken = generateRandomString();
		var org = $scope.formData.organization;
		if (org == 'Other') {
			org = $scope.orgText;
		}
		var commonConfiguration = {
			"userName" : $rootScope.userDetails.userName,
			"password" : $rootScope.userDetails.password,
			"organization" : filename,
			"newOrg" : org,
			"newEnv" : $scope.formData.newEnv,
			"tempToken" : tempToken
		};
		
		if(!commonConfiguration.newEnv || !commonConfiguration.newOrg) {
			alert('Please fill all the fields');
			return;
		}
		
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
			$scope.formData.newEnv = "";
			var tempToken = data.tempToken;
			for(var i = 0; i < $scope.orgHis.length; i++) {
				if($scope.orgHis[i].fileOid == oid) {
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
	
		
});