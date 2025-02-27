import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import api from "./axiosInstsance";
import { db } from "../config/firebase";


const studentsCollectionRef = collection(db, "Students")
const usersCollectionRef = collection(db, "Users")

const getUser = async (uID) => {
  // const response = await api.get(`/users/${uID}`);
  // return response;
  try {
    const userDocRef = doc(usersCollectionRef, uID); // Reference to the specific student document
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('obtaining user info')
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

// const getAllStudents = async () => {
//   const response = await api.get("/students");
//   console.log(response)
//   return response;
// };

const getAllStudents = async () => {
  try {
    const studentDocs = await getDocs(studentsCollectionRef);
console.log(studentDocs)
     const response = studentDocs.docs.map(doc => { return { ...doc.data(), id: doc.id } }); // Return student data
     console.log('my response ', response)
     return response
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


export { getStudent, getStudentWithoutUser, getAllStudents, getUser };
