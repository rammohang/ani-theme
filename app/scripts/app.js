'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var app = angular
  .module('yapp', [
    'ngRoute',
    'ngAnimate'
  ]);


app.config(function($routeProvider) {
    $routeProvider.
    
    when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
       
    }).
    when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
       
    }).
    when('/restoreOrg', {
        templateUrl: 'views/restoreOrg.html',
        controller: 'restoreOrgController'
       
    }).
    when('/deleteProxy', {
        templateUrl: 'views/deleteProxy.html',
        controller: 'delteProxyController'
       
    }).  
    when('/undeployProxy', {
        templateUrl: 'views/undeployProxy.html',
        controller: 'undeployProxyController'
       
    }).
    
    otherwise({
        redirectTo: '/login'
    });
});
