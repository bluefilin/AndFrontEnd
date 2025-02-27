import axios from "axios";

export const postCreateCommittee = async (data) => {
    try {
        const responseCreateCommittee = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + `api/comites`, data)
        return responseCreateCommittee.data;
    }
    catch (err) {
        console.log(err)
        return err.response.data;
    }
}

export const getCommitteeList = async () => { 
    try {
        const resCommitteeList = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/comites`)
        return resCommitteeList.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export const getCommitteeId = async (id) =>{
    try {
        const resCommitteeList = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${id}`)
        return resCommitteeList.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export const putIdeaToCommittee = async (idCommittee, idIdea) => {
    try {
        const resIdeaToCommittee = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${idCommittee}/ideas/`, idIdea)
        return resIdeaToCommittee.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


//Función agregar idea al comité
export const addIdeaToCommittee = async (id, ideaData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${id}/ideas`,
        ideaData
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
};
//Función eliminar idea del comité
export const removeIdeaFromCommittee = async (idComite, idIdea) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${idComite}/ideas/${idIdea}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
};
export const putUpdateCommittee = async (updatedData,committeeId) => {
  try {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${committeeId}`;
    console.log('URL:', url);
    console.log('Updated Data:', updatedData);

    const updatedDataCommite = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${committeeId}`, updatedData);
    return updatedDataCommite.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSelectedIdeas = async (committeeId, selectedIdeaIds) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_REACT_APP_API_URL}api/comites/${committeeId}/ideas/${selectedIdeaIds.join(',')}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getCommitteeType = async (estado, tipo)=> {
  try {
    const resCommitteeType = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/comites`, {
      params:{
        estado:estado,
        tipo:tipo
      }
    })
    return resCommitteeType.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const postNewStageCommitte = async(updateStage) => {
  try{
      const newStage = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/comites/estados`, updateStage); 
      return newStage.data;
   }
   catch (err) {
       console.log(err);
       throw err;
   }
}