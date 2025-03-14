import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Function to log actions
export const logAction = async (
  adminId,
  adminName,
  action,
  section,
  prevState,
  currState
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    adminId,
    adminName,
    action,
    section,
    prevState,
    currState,
  };

  await addDoc(collection(db, "AdminLogs"), logEntry);
};

export const fetchLogs = async (filters = {}) => {
  try {
    let logsQuery = query(
      collection(db, "AdminLogs"),
      orderBy("timestamp", "desc")
    );

    // Apply filters
    if (filters.section) {
      logsQuery = query(logsQuery, where("section", "==", filters.section));
    }
    if (filters.adminName) {
      logsQuery = query(logsQuery, where("adminName", "==", filters.adminName));
    }
    if (filters.startDate && filters.endDate) {
      logsQuery = query(
        logsQuery,
        where("timestamp", ">=", filters.startDate),
        where("timestamp", "<=", filters.endDate)
      );
    }

    const logsSnapshot = await getDocs(logsQuery);
    const logsData = logsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return logsData;
  } catch (err) {
    console.error("Error fetching logs:", err);
    throw err; // Re-throw the error for handling in the calling function
  }
};
