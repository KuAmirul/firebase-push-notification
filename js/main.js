'use strict';

var config = {
    apiKey: "{}",
    authDomain: "{}",
    databaseURL: "{}",
    storageBucket: "{}"
};
//  firebase.initializeApp(config);

firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});

firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var isAnonymous = user.isAnonymous;
            //var uid = user.uid;
            // 
            var uid = firebase.auth().currentUser.uid;

            function addUser(endpoint, auth, p256dh) {
                var rootRef = firebase.database().ref().child('accounts').child(uid).set({
                    endpoint: endpoint
                })

                var keyRef = firebase.database().ref().child('accounts').child(uid).child('keys').set({
                    auth: auth,
                    p256dh: p256dh
                })

            }
    

    //Checking if browser supports serviceWorker
    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported on this browser');

        navigator.serviceWorker.register('sw.js').then(function() {
            return navigator.serviceWorker.ready;
        }).then(function(reg) {
            console.log('Service Worker is ready to go!', reg);
            reg.pushManager.subscribe({
                userVisibleOnly: true
            }).then(function(sub) {
				  var target = sub.toJSON();
                  document.getElementById("mytext").value = target;
				  var endpoint = target.endpoint;
				  console.log(endpoint);
				  var auth = target.keys.auth;
				  console.log(auth);
				  var p256dh = target.keys.p256dh;
				  console.log(p256dh);
				  //var key = sub.getKey('p256dh');   --- get binary value of keys in ArrayBuffer
				  //var auth = sub.getKey('auth');
				
                addUser(endpoint,auth,p256dh);
                //saveData('subscriptions', null, {"keys": endpoint  })
            });
        }).catch(function(error) {
            console.log('Service Worker failed to boot', error);
        });
    };

	
	 var accRef = firebase.database().ref('accounts'); 
	     accRef.on('value', function(snapshot) {
			 var num = snapshot.numChildren(); //get number of node
		     console.log(num);
			 accRef.limitToLast(num).on("child_added",function(childSnapshot){
				 var childData = childSnapshot.val();
                 console.log(childData);
			 })
       
		
    });
	
}
else {
    // User is signed out.
    // ...
}
// ...
});