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
			// console.log to view who is logged in
		    console.log("Logged in as:", authData.uid);
		    var singleRef = new Firebase("https://casting.firebaseio.com/users/" + authData.uid);
		    $scope.user = $firebase(singleRef);
		    $scope.currentuser = $scope.user.$asObject();
		    $scope.currentuser.$loaded().then(function(data){
		    	$scope.currentuser = data;
		    })
		    // console.log to view the current users info
		    console.log("This here ", $scope.currentuser);
	  } else {
	  	// console.log to view if user is logged out
	    console.log("Logged out");
	  }
	});

	// addmessage function that adds message to array along with its author upon hitting return, 
	// then clears the textarea
	$scope.messages = sync.$asArray();
	$scope.addMessage = function(e) {
		$scope.fullName = $scope.currentuser.fname + " " + $scope.currentuser.lname;
		
		if(e.keyCode != 13) return;
		$scope.messages.$add({
			from: $scope.fullName,
			text: $scope.newMessage,
			id: $scope.currentuser.$id
		}).then(function(){
			$scope.newMessage = "";
		});
	}
}]);