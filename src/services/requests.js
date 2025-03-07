import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    serverTimestamp 
  } from "firebase/firestore";
  import { db } from "../config/firebase";
  
 const requestsCollectionRef = collection(db, "Requests");
 
  // ============================================================================
  // REQUEST FUNCTIONS
  // ============================================================================
  
  /**
   * Creates a new request in the Requests collection
   * @param {Object} requestData - Data for the new request
   * @param {string} requestData.title - Title of the request
   * @param {string} requestData.description - Description of the request
   * @param {string} requestData.roomId - ID of the room the request is for
   * @param {string} requestData.userId - ID of the user making the request
   * @param {string} requestData.status - Status of the request (e.g., "pending", "approved", "denied")
   * @param {Object} requestData.additionalData - Any additional data for the request
   * @returns {Promise<Object>} - The created request with its ID
   */
  const createRequest = async (requestData) => {
    try {
      // Add timestamp to request data
      const requestWithTimestamp = {
        ...requestData,
        createdAt: new Date().toLocaleDateString("en-GB"),
        updatedAt: new Date().toLocaleDateString("en-GB"),
        // createdAt: serverTimestamp(),
        // updatedAt: serverTimestamp()
      };
  
      // Add the document to Firestore
      const requestDocRef = await addDoc(requestsCollectionRef, requestWithTimestamp);
      
      // Return the created request with its ID
      return { id: requestDocRef.id, ...requestWithTimestamp };
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  };
  
  /**
   * Retrieves a specific request by its ID
   * @param {string} requestId - ID of the request to retrieve
   * @returns {Promise<Object|null>} - The request data or null if not found
   */
  const getRequest = async (requestId) => {
    try {
      const requestDocRef = doc(requestsCollectionRef, requestId);
      const requestDoc = await getDoc(requestDocRef);
      
      if (requestDoc.exists()) {
        return { id: requestDoc.id, ...requestDoc.data() };
      } else {
        console.log("No such request found!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  };
  
  /**
   * Retrieves all requests from the Requests collection
   * @returns {Promise<Array>} - Array of all requests
   */
  const getAllRequests = async () => {
    try {
      const requestDocs = await getDocs(requestsCollectionRef);
      return requestDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching all requests:", error);
      throw error;
    }
  };
  
  /**
   * Retrieves all requests for a specific room
   * @param {string} roomId - ID of the room to get requests for
   * @returns {Promise<Array>} - Array of requests for the specified room
   */
  const getRequestsByRoom = async (roomId) => {
    try {
      // Create a query against the collection
      const q = query(requestsCollectionRef, where("roomId", "==", roomId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching room requests:", error);
      throw error;
    }
  };
  
  /**
   * Updates an existing request
   * @param {string} requestId - ID of the request to update
   * @param {Object} updateData - New data to update the request with
   * @returns {Promise<void>}
   */
  const updateRequest = async (requestId, updateData) => {
    try {
      const requestDocRef = doc(requestsCollectionRef, requestId);
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(requestDocRef, dataWithTimestamp);
      console.log("Request updated successfully");
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  };
  
  /**
   * Deletes a request
   * @param {string} requestId - ID of the request to delete
   * @returns {Promise<void>}
   */
  const deleteRequest = async (requestId) => {
    try {
      const requestDocRef = doc(requestsCollectionRef, requestId);
      await deleteDoc(requestDocRef);
      console.log("Request deleted successfully");
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  };
  

  // Export new functions
  export {
    // Request functions
    createRequest,
    getRequest,
    getAllRequests,
    getRequestsByRoom,
    updateRequest,
    deleteRequest,
  };