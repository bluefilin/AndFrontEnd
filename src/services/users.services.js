import axios from "axios"

export const getAllUsers = async () => {
    try {
        const users = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/usuarios/`);
        return users.data;
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const getUsersCommitte = async () => { 
    try {
        const users = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/usuarios/grupo/comite`);
        return users.data;
    }
    catch (err) {
        console.log(err)
        return err
    }
}


export const getUserAvatarUrl = async (avatarName) => {
  try {
      return`${import.meta.env.VITE_REACT_APP_API_URL}api/usuarios/${avatarName}/avatar`;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getPhotoComment = async (idUser)=>{
    try{
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/usuarios/perfil/${idUser}`);
        return res.status
    }catch(err){
        console.log(err)
        return null;
    }
}
