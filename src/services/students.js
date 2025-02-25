import api from "./axiosInstsance";

const getAllStudents = async () => {
  const response = await api.get("/students");
  console.log(response)
  return response;
};

const getStudent = async (uID) => {
  const response = await api.get(`/students/${uID}`);
  return response;
};

const getUser = async (uID) => {
  const response = await api.get(`/users/${uID}`);
  return response;
};

export { getStudent, getAllStudents, getUser };
