// controller for current user status
app.controller('StatusCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	$rootScope.$on('$firebaseAuth:login', function(e, authUser){
		console.log('email: ', authUser);
		$scope.userEmail = authUser.email;
	});

}]);