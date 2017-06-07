const webpush = require('web-push');
var firebase = require('firebase');
var admin = require("firebase-admin");

var serviceAccount = require("/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "{}"
});

var config = {
    apiKey: "{}",
    authDomain: "{}",
    databaseURL: "{}",
    storageBucket: "{}",
};
var app = firebase.initializeApp(config);

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

//console.log(vapidKeys)


webpush.setGCMAPIKey('{}');
//Above is obtained from https://console.firebase.google.com/project/push-notification-web-d0beb/settings/cloudmessaging

webpush.setVapidDetails(
    'mailto: {} ',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);


var db = admin.database();
var ref = db.ref("accounts");
ref.on('value', function(snapshot) {
    var num = snapshot.numChildren(); //get number of node
    console.log(num);
    ref.limitToLast(num).on("child_added", function(childSnapshot) {
        var pushSubscription = childSnapshot.val();
        console.log(pushSubscription);

        webpush.sendNotification(pushSubscription, 'Push Notification')
            .then(function(result) {
                console.log(result)
            }).catch(function(error) {
                console.log('error', error)
            })
			
    })

    //ref.off("value"); ref.child("accounts").off("child_added");
});
//process.exit(1);
app.delete();
