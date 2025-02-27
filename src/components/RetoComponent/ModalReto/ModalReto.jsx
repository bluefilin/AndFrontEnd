import './ModalReto.css';

const ModalReto = ({ open, onClose, title, paragraph, btn1, btn2, saveChanges, sendFeedback, validateReto, launchChallenge, ChallengeWithout}) => {
	const modalClose = ()=>{
		onClose();
	}
	let mainFinction
	if(title === "¿Guardar reto?" ){
		mainFinction=saveChanges;
	}else if(title === "¿Enviar a ajustes?"){
		mainFinction=sendFeedback;
	}else if(title === "¿Validar el reto?"){
		mainFinction=validateReto;
	}
	else if(title === "¿Lanzar reto?"){
		mainFinction=launchChallenge;
	}
	else if (title === "Sin lanzar") {
		mainFinction = ChallengeWithout;
	}
	if(!open) return null
	return(
		<div className='modalReto'>
			<div className="modalRetoContent">
				<h3 className="rmGoldB">{title}</h3>
				<p className="rmGold">{paragraph} </p>
				<div>
					<button onClick={modalClose}>{btn1}</button>
					<button onClick={mainFinction}>{btn2}</button> 
				</div>
				
			</div>
		</div>
	);
};

export { ModalReto }; 