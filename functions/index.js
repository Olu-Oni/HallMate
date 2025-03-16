/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { config, https } from "firebase-functions";
import { initializeApp } from "firebase-admin";
import { setApiKey, send } from "@sendgrid/mail";

initializeApp();
setApiKey(config().sendgrid.key);

export const sendWelcomeEmail = https.onCall(async (data, context) => {
  const { email, password } = data;

  // Ensure the request is authenticated (optional)
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "Request not authenticated");
  }

  const msg = {
    to: email,
    from: "your-email@example.com", // Use the email address or domain you verified with SendGrid
    subject: "Welcome to HallMate",
    text: `Welcome to HallMate! Your temporary password is: ${password}`,
    html: `<strong>Welcome to HallMate!</strong><p>Your temporary password is: ${password}</p>`,
  };

  try {
    await send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new https.HttpsError("internal", "Unable to send email");
  }
});