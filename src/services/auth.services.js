import axios from "axios";
import { dataEncrypt } from "../util/encrypt";

export const loginService = async (email, password) => {
  const responseLogin = await axios.post(import.meta.env.VITE_REACT_APP_API_URL + `api/login`, {
    correo: email,
    contrasenia: password,
  })
    .then((response) => {
      if (response.data.id) {
        const data = dataEncrypt(response.data);
        sessionStorage.setItem("user", data);
      }
      return response.data;
    })
    .catch((err) => {
      return err.response.data;
    });
  return responseLogin;
}
export const forgotPassword = async (email) => {
  try {
    const responseForgotPassowrd = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/olvideContrasenia`, { correo: email })
    return responseForgotPassowrd.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export const linkChangePw = async (data) => {
  try {
    const responseLinkChangePw = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/cambioContrasena/${data.id}/${data.token}`)
    return responseLinkChangePw.data.resultado;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
export const postNewPw = async (password, id) => {
  try {
    const resPostNewPw = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}api/nuevaContrasena`, {
      contrasenia: password,
      id: id,
    });
    return resPostNewPw.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}