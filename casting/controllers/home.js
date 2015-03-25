// controller for home chat
app.controller('HomeCtrl', ['$scope', '$location', '$firebase', '$firebaseAuth', '$rootScope', function($scope, $location, $firebase, $firebaseAuth, $rootScope){
	// setting 'ref' to my firebase url
	var ref = new Firebase("https://casting.firebaseio.com/home");
	// start a firebase app with this url 
	var sync = $firebase(ref);

	var userRef = new Firebase("https://casting.firebaseio.com/home");
    $scope.authObj = $firebaseAuth(userRef);

    $scope.authObj.$onAuth(function(authData) {
		if (authData) {
		    console.log("Logged in as:", authData.uid);
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    console.log("This here ", $scope.currentuser);
	  } else {
	    console.log("Logged out");
	  }
	});

	$scope.messages = sync.$asArray();
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