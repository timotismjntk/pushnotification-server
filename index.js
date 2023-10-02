const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const admin = require('firebase-admin');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

admin.initializeApp({
    credential: admin.credential.cert(require('./pushnotification-955fe-firebase-adminsdk-sqnb1-5165fe34e1.json')),
});

function showNotifications() {
    const db = getFirestore();
    const notificationsRef = db.collection('Properties');

    // Set up a real-time listener
    notificationsRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified') {
                if (change.doc.data().last_registration) {
                    // show notification
                    admin
                        .messaging()
                        .send({
                            notification: {
                                title: 'User registered',
                                body: 'User registered to property',
                            },
                            topic: 'demo',
                            data: {},
                        })
                        .then((response) => {
                            console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                            console.log('Error sending message:', error);
                        });
                }
            }
        });
    });
}

showNotifications();

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

server.listen(8000, () => {
    console.log('listening on *:8000');
});
