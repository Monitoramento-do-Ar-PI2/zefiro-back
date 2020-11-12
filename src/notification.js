const admin = require('firebase-admin');
const functions = require('firebase-functions');
const StationModel = require('./models/StationModel');

const db = admin.firestore();
const fcm = admin.messaging();

// eslint-disable-next-line import/prefer-default-export
export const sendToDevice = functions.firestore;
(async () => {
  const querySnapshot = await db
    .collection('tokens')
    .get();

  const tokens = querySnapshot.docs.map((snap) => snap.id);

  const changeStream = StationModel.watch();
  changeStream.on('change', () => {
    const payload = {
      notification: {
        title: 'Zéfiro',
        body: 'Verifique a qualidade do ar',
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };
    fcm.MessagingPayload = payload;
    return fcm.sendToDevice(tokens, payload);
  });
})();
