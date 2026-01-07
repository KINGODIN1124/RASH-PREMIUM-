importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC2k8pfLN7GsHRjR0TjA7XWbv1gAu-Yy1Q",
  authDomain: "rash-premium.firebaseapp.com",
  projectId: "rash-premium",
  messagingSenderId: "707837381992",
  appId: "1:707837381992:web:da27c427cef2a0d0315add"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: '/icons/icon-192.png'
    }
  );
});
