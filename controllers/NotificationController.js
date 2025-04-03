const admin = require("firebase-admin");
const serviceAccount = require("./../minsu-d6ae4-firebase-adminsdk-l6w1c-965986939c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://minsu-d6ae4-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();


const generateMessage = (token, title, body, url) => {
  return {
    notification: {
      title: title,  
      body: body,    
    },
    data: {
      action: "locatorApproved",
      customKey: "customValue",
      url: url,     
    },
    android: {
      priority: "high",
      notification: {
        icon: "minsu", 
        color: "#4CAF50",
        sound: "default",
        clickAction: url,  
      },
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      fcmOptions: {
        link: url,  
      },
      notification: {
        icon: "/minsu.png",
        vibrate: [100, 50, 100],
        actions: [
          {
            action: "view",
            title: "View Message",
          },
        ],
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: title,  
            body: body,    
          },
          sound: "default",
        },
      },
      fcmOptions: {
        image: "/minsu.png",
      },
    },
    token: token,  
  };
};


const sendNotifications = async (req, res) => {
  try {    
    const { title, body, url } = req.body;
    if (!title || !body || !url) {
      return res.status(400).json({ message: 'Title, body, and URL are required.' });
    }
    const tokensSnapshot = await db.collection('fcmTokens').where('employeeId', '==', 'MCC-413').get();
    if (tokensSnapshot.empty) {
      return res.status(404).json({ message: 'No tokens found in Firestore.' });
    }
    const tokens = tokensSnapshot.docs.map(doc => doc.id);
    console.log('Tokens fetched:', tokens);    
    for (const token of tokens) {
      try {
        const message = generateMessage(token, title, body, url); 
        const response = await admin.messaging().send(message);
        console.log(`Successfully sent message to ${token}:`, response);
      } catch (error) {
        console.error(`Error sending message to ${token}:`, error);
        
      }
    }
    return res.status(200).json({ message: 'Notifications sent successfully.' });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return res.status(500).json({ message: 'Error sending notifications.', error: error.message });
  }
};

module.exports = {
  sendNotifications,
};
