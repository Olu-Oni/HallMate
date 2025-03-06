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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const studentsCollectionRef = collection(db, "Students");
const usersCollectionRef = collection(db, "Users");

const getUser = async (uID) => {
  try {
    const userDocRef = doc(usersCollectionRef, uID); // Reference to the specific student document
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log("obtaining user info");
      return { id: userDoc.id, ...userDoc.data() }; // Return student data with the document ID
    } else {
      console.log("No such user found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const getAllStudents = async () => {
  try {
    const studentDocs = await getDocs(studentsCollectionRef);
    console.log(studentDocs);
    const response = studentDocs.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    }); // Return student data
    console.log("my response ", response);
    return response;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
}; // Missing closing curly brace was added here

const getStudent = async (uID) => {
  try {
    // First, get the user document to access `profileRef`
    const userData = await getUser(uID);
    if (!userData || !userData.profileRef) {
      console.log("User does not have a valid profile reference.");
      return null;
    }
    // console.log(userData.profileRef)
    const studentDocRef = userData.profileRef; // Assuming `profileRef` is already a Firestore reference
    const studentDoc = await getDoc(studentDocRef);

    if (studentDoc.exists()) {
      // console.log(studentDoc.data())
      return { id: studentDoc.id, ...studentDoc.data() }; // Return student data
    } else {
      console.log("No such student found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

const getStudentWithoutUser = async (uID) => {
  try {
    const studentDocRef = doc(db, "Students", uID); // Correct way to reference a document
    const studentDoc = await getDoc(studentDocRef);

    if (studentDoc.exists()) {
      // console.log(studentDoc.data())
      return { id: studentDoc.id, ...studentDoc.data() }; // Return student data
    } else {
      console.log("No such student found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

/**
 * Creates a new student in the Students collection
 * @param {Object} studentData - Data for the new student
 * @param {Object} studentData.displayInfo - Display information (name, matrNo, etc.)
 * @param {Object} studentData.personalInfo - Personal information
 * @param {Object} studentData.academicInfo - Academic information
 * @returns {Promise<Object>} - The created student with its ID
 */
const createStudent = async (studentData) => {
  try {
    // Add timestamps to student data
    const studentWithTimestamp = {
      ...studentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add the document to Firestore
    const studentDocRef = await addDoc(
      studentsCollectionRef,
      studentWithTimestamp
    );

    // Return the created student with its ID
    return { id: studentDocRef.id, ...studentWithTimestamp };
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

/**
 * Updates a student's information
 * @param {string} studentId - ID of the student to update
 * @param {Object} updateData - New data to update the student with
 * @returns {Promise<void>}
 */
const updateStudent = async (studentId, updateData) => {
  try {
    const studentDocRef = doc(studentsCollectionRef, studentId);

    // Add updated timestamp
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(studentDocRef, dataWithTimestamp);
    console.log("Student updated successfully");
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

/**
 * Deletes a student
 * @param {string} studentId - ID of the student to delete
 * @returns {Promise<void>}
 */
const deleteStudent = async (studentId) => {
  try {
    const studentDocRef = doc(studentsCollectionRef, studentId);
    await deleteDoc(studentDocRef);
    console.log("Student deleted successfully");
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export {
  getStudent,
  getStudentWithoutUser,
  getAllStudents,
  getUser,
  createStudent,
  updateStudent,
  deleteStudent,
};
