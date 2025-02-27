import axios from "axios"

export const getStates = async (tipo) => {
    try {
        const states = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/estados?tipo=${tipo}`);
        return states.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const getNextStages = async (ideaId) => {
    try{
       const nextStages = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/ideas/siguientesEstados/${ideaId}`); 
       return nextStages.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
export const postNewStage = async(updateStage) => {
    try{
        const newStage = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/ideas/estado`, updateStage); 
        return newStage.data;
     }
     catch (err) {
         console.log(err);
         throw err;
     }
}

