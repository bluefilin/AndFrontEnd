import './ChangePwByMail.css';
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom/dist";
import { NavLink } from "react-router-dom/dist";
import robot from "../../../assets/img/robot.svg"
import { linkChangePw } from '../../../services/auth.services';
import { postNewPw } from '../../../services/auth.services'

const ChangePwByMail = () => {
	const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errorConfirmPw, setErrorConfirmPw] = useState(false);
    const [ifToken, setIfToken] = useState(true);
    const data = useParams();
    useEffect(() => {
        const getLink = async (data)=>{
			const resGetLink = await linkChangePw(data);
			setIfToken(resGetLink)
		}
		getLink(data)
    }, []);
	console.log(ifToken)
    const validateNewPassword = (password) => {
        // aqui hacer la validacion de la nueva contraseña
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]|\\:;"'<,>.?/]).{8,15}$/;
        return pattern.test(password);
    };
    
    const enviarData = async (e)=> {   
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('La nueva contraseña y la confirmación de contraseña no coinciden.');
            setErrorConfirmPw(true);
            return;
        }else if(!validateNewPassword(newPassword)){
            setError('La nueva contraseña debe tener al menos 8 caracteres y contener mayúsculas, minúsculas, números y símbolos.');
            setErrorConfirmPw(true);
            return;
        }else{
            try {
				await postNewPw(newPassword, data.id)
				setError('Tu contraseña se ha cambiado exitosamente');
                setErrorConfirmPw(false);
            }
            catch (error) {
                setError('La contraseña actual es incorrecta.');
            }
        }

       }
    return(
        <>
            {
                ifToken === true ? (
                    <>
                            <div className="changePw2">
                                <h2>Cambiar Contraseña</h2>
                                <article>
                                    <h3>Actualizar tu contraseña</h3>
                                    <p> <span>Hola</span> recuerda que si quieres cambiar tu contraseña debe tener mínimo <span>8 caracteres entre mayúsculas, minúsculas, números y símbolos.</span></p>
                                    <form onSubmit={enviarData}>
                                        <label htmlFor="nueva">Nueva contraseña</label>
                                        <input type="text" placeholder="Nueva contraseña" name="nueva" style={{border: errorConfirmPw ? "1px solid #F34545" : "1px solid #D9D9D9"}} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="off"/>
                                        <label htmlFor="confirmar">Confirmar contraseña</label>
                                        <input type="text" placeholder="Confirmar nueva contraseña" style={{border: errorConfirmPw ? "1px solid #F34545" : "1px solid #D9D9D9"}} name="confirmar" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="off"/>
                                        <button>Actualizar contraseña</button>
                                        {error && <p>{error}</p>}
                                    </form>
                                    <NavLink to="/">
                                        Vuelve al inicio
                                    </NavLink>
                                </article>
                            </div>
                    </>
                ):(
                    <>
                        <div className="errorToken">
                            <img src={robot} alt="Robot" />
                            <h2>¡El tiempo del enlace para recuperar contraseña ha terminado!</h2>
                            <p>Si no alcanzaste a hacer el proceso de recuperar la contraseña vuelve al inicio para solicitar un nuevo enlace de recuperación de contraseña.  </p>
                            <NavLink to="/">
                                Vuelve al inicio
                            </NavLink>
                        </div>
                    </>
                )
            }
        </>
    )
};

export {ChangePwByMail};