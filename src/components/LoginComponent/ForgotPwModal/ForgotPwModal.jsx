import { useState } from 'react';
import './ForgotPwModal.css';
import { forgotPassword } from '../../../services/auth.services';
import forgotPw from "../../../assets/img/forgotPw.png"

const ForgotPwModal = ({open, onClose}) => {
	const [email, setEmail] = useState("");
    const [emailExist, setEmailExist] = useState(false);
    const [emailNotExist, setEmailNotExist] = useState(false);
    const getBackPassword = async (e) =>{
        e.preventDefault();
		try{
			const resPassword = await forgotPassword(email);
			if(resPassword !== 204){
                setEmailExist(true);
                setEmailNotExist(false);
            }else{
                setEmailNotExist(true);
                setEmailExist(false);
            }
		}catch(err){
			console.log(err)
		}
    }
    const modalClose = () => {
        setEmailExist(false);
        setEmailNotExist(false);
        onClose();
      };
    if(!open) return null
	return(
		<div className='forgotpwmodal'>
			<div className="rmContent">
				{/* <img src={keyPs} alt="Password Key"/>*/}
				<h3 className="modalTitle">¿Olvidaste tú contraseña? </h3>
				<img src={forgotPw} alt="" className='imagenModal'/>
				<p className="rmGold">No te preocupes, escribe el correo que tienes registrado en Andrómeda para enviarte las instrucciones de reinicio </p>
				<form>
					<input type="email" onChange={(e) => setEmail(e.target.value)} placeholder='afajardo@grupoasd.com'/>
					<div>
						<p onClick={modalClose} className="rmGold rmButon">Cancelar</p>
						<button onClick={getBackPassword}>Enviar correo</button>
					</div>
					
					
				</form>
				{emailExist ?(<p className='rmgMsn'>¡Correo confirmado, revisa tu correo electrónico!</p>):(<></>)}
				{emailNotExist ?(<p className='rmgMsn rmgErrorMsn'>¡El correo electronico no existe!</p>):(<></>)}

				
			</div>
		</div>
	);
};

export {ForgotPwModal};