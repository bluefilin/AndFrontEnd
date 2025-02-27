import axios from "axios";
export const getActivities = async () => {
    try {
      const resActivities= await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/actividades`)
      return resActivities.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  export const postActivities = async (data) => {
    try {
      const resActivities= await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/actividades`, data)
      return resActivities.status;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  export const putActivities = async (dataId, data) => {
    try {
      const resActivities= await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}api/actividades/${dataId}`, data)
      return resActivities.status;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }