import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";

const announcementsCollectionRef = collection(db, "Announcements");

// ============================================================================
// ANNOUNCEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new announcement in the Announcements collection
 * @param {Object} announcementData - Data for the new announcement
 * @param {string} announcementData.title - Title of the announcement
 * @param {string} announcementData.content - Content of the announcement
 * @param {string} announcementData.authorId - ID of the user creating the announcement
 * @param {string} announcementData.targetAudience - Target audience (e.g., "all", "students", "staff")
 * @param {Date} announcementData.expiryDate - Optional date when the announcement expires
 * @returns {Promise<Object>} - The created announcement with its ID
 */
const createAnnouncement = async (announcementData) => {
  try {
    // Add timestamps to announcement data
    const announcementWithTimestamp = {
      ...announcementData,
      createdAt: new Date().toISOString(), // Save the date in ISO 8601 format
      updatedAt: new Date().toISOString(), // Save the date in ISO 8601 format
    };

    // Add the document to Firestore
    const announcementDocRef = await addDoc(
      announcementsCollectionRef,
      announcementWithTimestamp
    );

    // Return the created announcement with its ID
    return { id: announcementDocRef.id, ...announcementWithTimestamp };
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

/**
 * Retrieves all announcements from the Announcements collection
 * @returns {Promise<Array>} - Array of all announcements
 */
const getAllAnnouncements = async () => {
  try {
    const q = query(
      announcementsCollectionRef,
      orderBy("updatedAt", "desc"), // Sort by updatedAt (newest first)
      orderBy("createdAt", "desc"), // Secondary sort
      limit(30) // Limit to 30 documents
    );

    const announcementDocs = await getDocs(q);
    return announcementDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};

/**
 * Retrieves a specific announcement by its ID
 * @param {string} announcementId - ID of the announcement to retrieve
 * @returns {Promise<Object|null>} - The announcement data or null if not found
 */
const getAnnouncement = async (announcementId) => {
  try {
    const announcementDocRef = doc(announcementsCollectionRef, announcementId);
    const announcementDoc = await getDoc(announcementDocRef);

    if (announcementDoc.exists()) {
      return { id: announcementDoc.id, ...announcementDoc.data() };
    } else {
      console.log("No such announcement found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching announcement:", error);
    throw error;
  }
};

/**
 * Updates an existing announcement
 * @param {string} announcementId - ID of the announcement to update
 * @param {Object} updateData - New data to update the announcement with
 * @returns {Promise<void>}
 */
const updateAnnouncement = async (announcementId, updateData) => {
  try {
    const announcementDocRef = doc(announcementsCollectionRef, announcementId);

    // Add updated timestamp
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: new Date().toISOString(), // Save the date in ISO 8601 format
    };

    await updateDoc(announcementDocRef, dataWithTimestamp);
    console.log("Announcement updated successfully");
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

/**
 * Deletes an announcement
 * @param {string} announcementId - ID of the announcement to delete
 * @returns {Promise<void>}
 */
const deleteAnnouncement = async (announcementId) => {
  try {
    const announcementDocRef = doc(announcementsCollectionRef, announcementId);
    await deleteDoc(announcementDocRef);
    console.log("Announcement deleted successfully");
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};
// Export new functions
export {
  // Announcement functions
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
