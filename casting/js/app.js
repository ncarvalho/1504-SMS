var app = angular.module('casting', ['ngRoute', 'firebase', 'appCtrls']);

var appCtrls = angular.module('appCtrls', []);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'views/home.html', 
			controller: 'HomeCtrl'
		})
		.when('/apply', {
			templateUrl: 'views/apply.html', 
			controller: 'ApplyCtrl'
		})
		.when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegisterCtrl'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegisterCtrl'
		})
		.otherwise({ redirectTo: '/home' });
}]);

app.controller('HomeCtrl', ['$scope', '$firebase', function($scope, $firebase){
	var ref = new Firebase("https://casting.firebaseio.com/home");
	var sync = $firebase(ref);

	$scope.messages = sync.$asArray();
	$scope.username = 'Director' + Math.floor(Math.random() * 101);

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

app.controller('ApplyCtrl', ['$scope', '$firebase' '$location', function($scope, $firebase, $location){
	var ref = new Firebase("https://casting.firebaseio.com/applications");
	var sync = $firebase(ref);

	$scope.applications = sync.$asArray();

	$scope.apply = function(e) {
		$scope.applications.$add({
			name: $scope.name,
			phone: $scope.phone,
			email: $scope.email,
			height: $scope.height,
			weight: $scope.weight,
			hair: $scope.hair,
			eye: $scope.eye,
			dob: $scope.dob,
			film: $scope.film,
			tv: $scope.tv,
			theatre: $scope.theatre,
			commercial: $scope.commercial,
			education: $scope.education,
			training: $scope.training,
			skills: $scope.skills
		}).then(function(){
			$scope.name = '';
			$scope.phone = '';
			$scope.email = '';
			$scope.height = '';
			$scope.weight = '';
			$scope.hair = '';
			$scope.eye = '';
			$scope.dob = '';
			$scope.film = '';
			$scope.tv = '';
			$scope.theatre = '';
			$scope.commercial = '';
			$scope.education = '';
			$scope.training = '';
			$scope.skills = '';
			$scope.applicationForm.$setUntouched();
			$location.path('/home');
		});
	}
}]);


app.controller('RegisterCtrl', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	var ref = new Firebase("https://casting.firebaseio.com/users");
    
    $scope.authObj = $firebaseAuth(ref);
	$scope.sync = $firebase(ref);
	$scope.newUser = $scope.sync.$asObject();

	$scope.register = function(){
		$scope.authObj.$createUser({
			email: $scope.user.email,
			password: $scope.user.password
		}).then(function(){
			return $scope.authObj.$authWithPassword({
				email: $scope.user.email,
				password: $scope.user.password
			});
		}).then(function(authData){
			$rootScope.authData = authData;
			console.log('data', authData);

			$scope.sync.$set(authData.uid, {
				uid: authData.uid, 
				fname: $scope.user.fname,
				lname: $scope.user.lname,
				email: $scope.user.email
			});

			$location.path('/home');
		})
	}

});




















