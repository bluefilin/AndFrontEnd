import axios from "axios"

export const getTiposInnovacion = async () => {
    try {
        const tiposinnovacion = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/tiposInnovaciones`);
        return tiposinnovacion.data;
    } catch (error) {

    }
}