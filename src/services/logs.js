import { 
    collection, 
    addDoc, 
  } from "firebase/firestore";
  import { db } from "../config/firebase";


export const logAction = async (adminId, adminName, action, details, section) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      adminId,
      adminName,
      action,
      details,
      section,
    };
    await addDoc(collection(db, "AdminLogs"), logEntry);
  };