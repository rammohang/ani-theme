app.controller('BackUpOrgCtrl',function($scope, $location, $rootScope, $http, $localStorage,AppService,$q) {
	
	
	
	$scope.proxyInfo = [];
	$scope.resourceInfo = [];
	$scope.developersInfo = [];
	$scope.productsInfo = [];
	$scope.appsInfo = [];
	$scope.showStatus = false;
	$scope.showProxiesStatus = false;
	$scope.showResourcesStatus = false;
	$scope.showAppsStatus = false;
	$scope.showProductsStatus = false;
	$scope.showDevelopersStatus = false;
	
	
	$scope.proxiesLoader = false;
	$scope.resourcesLoader = false;
	$scope.appsLoader = false;
	$scope.productsLoader = false;
	$scope.developersLoader = false;

	

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
		alert('TODO:'+oid);
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
				"_id":{
					"$oid":"-1"
				}
		}
		$scope.orgHis.unshift(dbmodel);
		
		$scope.showLoader = true;
		$scope.proxiesLoader = true;
		console.log(commonConfiguration);
		//1.call for backup proxies
		$scope.currentProgress="Proxies being backedup";
		var responsePromise = $http.post($rootScope.baseUrl
				+ "apigee/backupsubsystems?sys=" + "apiproxies"
				+ "&saveandzip=false", commonConfiguration, {});
		responsePromise
				.success(function(data, status, headers, config) {
					$scope.proxyMessageStatus += "Proxies Backed Successfully";
					$scope.proxiesLoader = false;
					$scope.organization = "";
					$scope.proxyData = data;
					console.log($scope.proxyData);
					$scope.filedir = $scope.proxyData.dir;
					$scope.showLoader = false;
					
					$scope.showProxiesStatus = true;

					var proxyInfo = JSON.parse($scope.proxyData.proxyInfo);
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
					//1.backup proxies done

					//2.call for resources
					$scope.resourcesLoader = true;
					$scope.currentProgress="Resources being backedup";
					var responsePromise = $http
							.post(
									$rootScope.baseUrl
											+ "apigee/backupsubsystems?sys="
											+ "resources"
											+ "&saveandzip=false&filedir="
											+ $scope.filedir,
									commonConfiguration, {});
					responsePromise
							.success(function(data, status,
									headers, config) {
								$scope.resourcesLoader = false;
								$scope.showResourcesStatus = true;
								// write logic to show resources in table
								var resourceInfo = JSON.parse(data.resourceInfo);
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

								$scope.resourceMessageStatus = "Resouces Backed successfully";
								//2.resources call finish
								$scope.currentProgress="APPS being backedup";
								//3. call for apps
								$scope.appsLoader = true;
								var responsePromise = $http
										.post(
												$rootScope.baseUrl
														+ "apigee/backupsubsystems?sys="
														+ "apps"
														+ "&saveandzip=false&filedir="
														+ $scope.filedir,
												commonConfiguration,
												{});
								responsePromise
										.success(function(data,
												status,
												headers, config) {
											$scope.appsInfo = JSON.parse(data.appsInfo);
											$scope.showAppsStatus = true;
											// write logic to show apps
											$scope.appsLoader = false;
											$scope.appsMessageStatus = "APPS Backed successfully";
											$scope.currentProgress="API Products being backedup";
											//4. call for API Products
											$scope.productsLoader = true;
											var responsePromise = $http
													.post(
															$rootScope.baseUrl
																	+ "apigee/backupsubsystems?sys="
																	+ "apiproducts"
																	+ "&saveandzip=false&filedir="
																	+ $scope.filedir,
															commonConfiguration,
															{});
											responsePromise
													.success(function(
															data,
															status,
															headers,
															config) {
														$scope.showProductsStatus = true;
														$scope.productsLoader = false;
														$scope.productsInfo = JSON.parse(data.productsInfo);

														$scope.productsMessageStatus = "Products Backed successfully";

														//4. call for API Products finish
														$scope.currentProgress="Dev's being backedup";
														//5. call for API Developers
														$scope.developersLoader = true;
														var responsePromise = $http
																.post(
																		$rootScope.baseUrl
																				+ "apigee/backupsubsystems?sys="
																				+ "appdevelopers"
																				+ "&saveandzip=true&filedir="
																				+ $scope.filedir
																				+ "&collname=OrgBundle",
																		commonConfiguration,
																		{});
														responsePromise
																.success(function(
																		data,
																		status,
																		headers,
																		config) {
																	$scope.showDevelopersStatus = true;
																	$scope.developersLoader = false;
																	//write logic to show developers here
																	$scope.developersInfo = JSON.parse(data.developersInfo);

																	$scope.developersMessageStatus = "APP Developers Backed successfully";
//call to display table in ui
																	var commonConfiguration = {
																			"userName" : $rootScope.userDetails.userName,
																			"password" : $rootScope.userDetails.password
																			
																		};
																	var responsePromise = $http.post($rootScope.baseUrl
																			+ "apigee/getorgbackuphistory?sys="+"org", commonConfiguration, {});
																	responsePromise.success(function(data, status, headers, config) {
																				$scope.showLoader = "N";
																				//$scope.backUpzip+= "Restored API Proxies successfully\n";
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
														responsePromise
																.error(function(
																		data,
																		status,
																		headers,
																		config) {
																	alert("Submitting form failed!");
																});

														//5. call for API Developers finished
													});
											responsePromise
													.error(function(
															data,
															status,
															headers,
															config) {
														alert("Submitting form failed!");
													});

										});
								responsePromise
										.error(function(data,
												status,
												headers, config) {
											alert("Submitting form failed!");
										});

								//3. call for apps done

							});
					responsePromise.error(function(data,
							status, headers, config) {
						alert("Submitting form failed!");
					});

				});
		responsePromise.error(function(data, status, headers,
				config) {
			$scope.showLoader = false;
			alert("Submitting form failed!");
		});

	}
	console.log($scope.account);
});

