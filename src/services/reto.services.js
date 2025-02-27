import axios from "axios"

export const getAllRetos = async()=>{
    try {
        const retos = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos`)
        .then(res => res.data)
        .catch(res => res.data)
        return retos
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const RetosInnovaServices = async (estadoId)=>{
    const getInnovacionRetos = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/innovacion`, {
        params: { estadoId }
    })
    .then((res)=>{
        console.log(res)
        return res.data
    })
    .catch((err)=>{
        console.log(err)
        return err
    })
    return getInnovacionRetos
}
export const getRetosById = async (idUsuario) => {

    const getInnovacionRetos = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/usuarios/${idUsuario}`).then((res)=>{

        return res.data

    })

    .catch((err)=>{

        console.log(err)

        return err

    })

    return getInnovacionRetos

}
// nuevo



export const postNewStage = async(updateStage) => {
    try{
        const newStage = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/${updateStage.reto}/estados`, updateStage); 
        return newStage.data;
     }
     catch (err) {
         console.log(err);
         throw err;
     }
}
export const postCreateReto = async (newData)=>{
    try{
        const createReto = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos`, newData, {
            headers:{
                "Content-Type": "multipart/form-data",
                "Content-Type":"application/json"
            } 
        })
        return createReto.data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const putUpdateReto = async (upDateReto, retoId)=>{
    try{
        const updateTheReto = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/${retoId}`, upDateReto);
        return updateTheReto.data;
    }
    catch (err){
        console.log(err);
        throw err;
    }
}

export const getUnitReto = async (idReto) => {
    try {
        const filterUnitReto = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/${idReto}`);
        return filterUnitReto.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export const getNextStages = async (retoId) => {
    try{
       const nextStages = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/${retoId}/estados`); 
       return nextStages.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export const getRetoConfig = async () =>{
    try{
        const allRetoConfig = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/focos/filtros`); 
        return allRetoConfig.data;
     }
     catch (err) {
         console.log(err);
         throw err;
     }
}

export const postRetoFile = async (dataFile, idReto) =>{
    try{
        const retoFile = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/${idReto}/file`, dataFile, {
            headers:{
                "Content-Type": "multipart/form-data",
            } 
        });
        return retoFile.data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
export const obtenerRetosDeUsuarioDesafiado = async (userId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/desafiados/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const putCreateComment = async (data, idReto) => {
    try {
        const resCreateComment = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}api/retos/${idReto}/comentarios`, data)
        return resCreateComment.data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}