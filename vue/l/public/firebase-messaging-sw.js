// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyA1-QuakN6Q32dWIzkBPzG8SEWhLIltICU",
    authDomain: "minsu-d6ae4.firebaseapp.com",
    projectId: "minsu-d6ae4",
    storageBucket: "minsu-d6ae4.firebasestorage.app",
    messagingSenderId: "338350609658",
    appId: "1:338350609658:web:cf2c90c6389f2a5fe62543",
    measurementId: "G-JDVRD3TWKJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received: ", payload);
  // Customize the notification in the background (can display a notification to the user)
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
