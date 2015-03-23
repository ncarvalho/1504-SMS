// set my application to the variable 'app'
var app = angular.module('casting', ['ngRoute', 'firebase', 'appCtrls']);
var appCtrls = angular.module('appCtrls', []);

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

// controller for the audition application
app.controller('ApplyCtrl', ['$scope', '$firebase', '$location', function($scope, $firebase, $location){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications");
	// start a firebase app with this url 
	var sync = $firebase(ref);
	// saving the array of applications to firebase
	$scope.applications = sync.$asArray();
	// apply function that accepts all the fields from the apply.html and saves into applications array
	$scope.apply = function(e) {
		$scope.applications.$add($scope.application)
		.then(function(){
			// after application is submitted, clear form and navigate to home
			$scope.application = {};
			$scope.applicationForm.$setUntouched();
			$location.path('/home');
		});
	}
}]);

// controller for the Applicant details
app.controller('ApplicantCtrl', ['$scope', '$firebase', '$routeParams', function($scope, $firebase, $routeParams){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/applications/" + $routeParams.applicantID);
	// start a firebase app with this url 
	$scope.sync = $firebase(ref);
	// setting applicant object to a variable then console logging the data received from that applicant
	$scope.currentApplicant = $scope.sync.$asObject();
	console.log($scope.currentApplicant);

}]);

// controller for the director registration
app.controller('RegisterCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/users");
    
    $scope.authObj = $firebaseAuth(ref);
	$scope.sync = $firebase(ref);
	$scope.newUser = $scope.sync.$asObject();
	// register function to create a user based on sign up info
	$scope.register = function(){
		$scope.authObj.$createUser({
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(){
			// return the data user has sent
			return $scope.authObj.$authWithPassword({
				email: $scope.user.email,
				password: $scope.user.password
			});
		}).then(function(authData){
			// set authData to a variable that can be seen across all controllers
			$rootScope.authData = authData;
			// console log the authData
			console.log('data', authData);
			// the the id and user info to the db and navigate home
			$scope.sync.$set(authData.uid, $scope.user);
			$location.path('/home');
		})
	}
	// login function to authenticate users trying to log in
	$scope.login = function(){
		$scope.authObj.$authWithPassword({
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(authData) {
			$location.path('/home');
		}).catch(function(error) {
			console.log(error)
			$location.path('/login');
		});
	}

}]);

// controller for current user status
app.controller('StatusCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){

	$rootScope.$on('$firebaseAuth:login', function(e, authUser){
		console.log('email: ', authUser);
		$scope.userEmail = authUser.email;
	});

}]);

// controller for home chat
app.controller('HomeCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/home");
	// start a firebase app with this url 
	var sync = $firebase(ref);
	// saving the array of messages to firebase
	$scope.messages = sync.$asArray();
	// generating random usernames temporarily 
	$scope.username = 'Director' + Math.floor(Math.random() * 101);
	// addmessage function that adds message to array along with its author upon hitting return, then clears the textarea
	$scope.addMessage = function(e) {
		if(e.keyCode != 13) return;
		$scope.messages.$add({
			from: $scope.username,
			text: $scope.newMessage
		}).then(function(){
			$scope.newMessage = "";
		});
	}
}]);