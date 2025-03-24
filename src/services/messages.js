const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-firebase-admin-sdk.json'); // Replace with your service account file path

/**
 * Send push notification to a specific device
 * @param {string} deviceToken - The FCM registration token of the target device
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Additional data payload (optional)
 * @param {string} link - Deep link URL (optional)
 * @returns {Promise} - Promise that resolves with the messaging response
 */
async function sendPushNotification(deviceToken, title, body, data = {}, link = null) {
    // Construct message payload
    const message = {
      token: deviceToken,
      notification: {
        title: title,
        body: body
      },
      data: data
    };
  
    // Add webpush configuration if link is provided
    if (link) {
      message.webpush = {
        fcm_options: {
          link: link
        }
      };
    }
  
    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

export const sendMulticastPushNotification = async(deviceTokens, title, body, data = {}, link = null) =>{
    // Construct multicast message
    const message = {
      tokens: deviceTokens,
      notification: {
        title: title,
        body: body
      },
      data: data
    };
  
    // Add webpush configuration if link is provided
    if (link) {
      message.webpush = {
        fcm_options: {
          link: link
        }
      };
    }
  
    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log(
        `${response.successCount} messages were sent successfully, ${response.failureCount} failed`
      );
      return response;
    } catch (error) {
      console.error('Error sending multicast message:', error);
      throw error;
    }
  }