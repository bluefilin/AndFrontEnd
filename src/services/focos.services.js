import axios from "axios"

export const getFocos = async () => {
    try {     
        const focos = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/focos`);
        return focos.data;
    } catch (error) {
        console.log(err);
        throw err;
    }
}