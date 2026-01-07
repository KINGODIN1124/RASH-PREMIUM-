const messaging = firebase.messaging();

async function initPushNotifications() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const token = await messaging.getToken({
      vapidKey: 'BDDc7WXZizRI-QoEMmWGJivpFZTJK2m5DwTWhFNyqjNKIXI3epeQ_7BZH1I2ozv9F53nyoH9UVGb8RsCxKG09tQ'
    });

    if (!token) return;

    // Save token to Firestore
    await firebase.firestore()
      .collection('notificationTokens')
      .doc(token)
      .set({
        token,
        createdAt: new Date(),
        userAgent: navigator.userAgent
      });

    console.log('Push notifications enabled');
  } catch (err) {
    console.error('Push error:', err);
  }
}
