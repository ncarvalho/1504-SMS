// set my application to the variable 'app'
var app = angular.module('casting', ['ngRoute', 'firebase', 'appCtrls', 'dcbImgFallback']);
var appCtrls = angular.module('appCtrls', ['firebase']);

// this handles my templates and routes
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
			templateUrl: 'views/home.html', 
			controller: 'HomeCtrl'
		}).when('/apply', {
			templateUrl: 'views/apply.html', 
			controller: 'ApplyCtrl'
		}).when('/applicant/:applicantID', {
			templateUrl: 'views/details.html',
			controller: 'ApplicantCtrl'
		}).when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegisterCtrl'
		}).when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegisterCtrl'
		}).otherwise({ redirectTo: '/home' });
}]);