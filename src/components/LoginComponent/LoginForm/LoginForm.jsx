import { useState } from 'react';
import './LoginForm.css';
import logoAndromeda from "../../../assets/img/logoLoginAndromeda.svg";
import { useNavigate } from 'react-router-dom';
import { loginService } from "../../../services/auth.services.js";
import { ForgotPwModal } from '../ForgotPwModal';
import eyeOpen  from '../../../assets/icons/eyeOpen.svg'
import eyeClose  from '../../../assets/icons/eyeClose.svg'

const LoginForm = () => {
	const [fgPwModal, setFgPwModal] = useState(false)
	const [email, setEmail] = useState('')
	const [pw, setPw] = useState('');
	const [showPw, setShowPw] = useState(false);
	const [errorLogin, setErrorLogin] = useState(false)
    const trueLogin = useNavigate();
	const authentication =async (e)=>{
		e.preventDefault();
		 // Verificar campos vacíos
		 if (!email || !pw) {
            // Campos vacíos, puedes mostrar un mensaje de error o realizar alguna acción
            console.log("Por favor, completa todos los campos.");
            return;
        }
        try{
			const response = await loginService(email, pw);
            if(response.error !== 404){
                trueLogin("/tablero")
            }else{
				setErrorLogin(true)
			}
        }
        catch(err){
            console.log(err)
        }
	}
	const tooglePw = () => {
		setShowPw(!showPw)
	}
	return(
		<>
			
			
			<section className='loginform'>
				{fgPwModal && (
					<ForgotPwModal
						open={fgPwModal}
						onClose={()=> setFgPwModal(false)}
					/>
				)}
				<div className='loginIntro'>
					<figure>
						<img src={logoAndromeda} alt="Logo Andromeda" />
					</figure>
					<h1>¡Bienvenido innovador!</h1>
				</div>
				<form onSubmit={authentication}>
					<label htmlFor="usuario">Correo electrónico</label>
					<input type="email" name="usuario" onChange={(e)=> setEmail(e.target.value)}/>
					<label htmlFor="password">Contraseña</label>
					<input type={showPw ? "text ": "password"} name="password" onChange={(e)=> setPw(e.target.value)}/>
					<span onClick={tooglePw}>
						{showPw?(
							<img src={eyeClose}/>
						):(
							<img src={eyeOpen}/>
						)}
					</span>
					{errorLogin ? (<p className='errorMsn'>El usuario o contraseña son incorrector</p>):""}
					<button>Ingresar</button>
					<p onClick={(s)=>setFgPwModal(true)} className='doYouForgot'>¿Olvidaste la contraseña?</p>
				</form>
			</section>

		</>
	);
};

export default LoginForm;