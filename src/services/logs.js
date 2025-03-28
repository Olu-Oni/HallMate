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
  role,
  adminId,
  adminName,
  action,
  section,
  prevState,
  currState
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    role,
    adminId,
    adminName,
    action,
    section,
    prevState,
    currState,
  };

  console.log(logEntry)
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
      console.log('doing name')
      logsQuery = query(logsQuery, // Convert both to lowercase for comparison
        where("adminNameLowercase", "==", filters.adminName.toLowerCase()));

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
