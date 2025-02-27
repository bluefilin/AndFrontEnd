import './ModalIdea.css';

const ModalIdea = ({ open, onClose, title, paragraph, btn1, btn2, addToCommittee, saveChanges, sendFeedback, validateIdea}) => {
	const modalClose = ()=>{
		onClose();
	}
	let mainFinction
	if(title === "¿Agregar idea a comité?" ){
		mainFinction=addToCommittee;
	}else if(title === "¿Guardar idea?" ){
		mainFinction=saveChanges;
	}else if(title === "¿Enviar a ajustes?"){
		mainFinction=sendFeedback;
	}else if(title === "¿Validar la idea?" || 
	title === "¿Convertir idea en caso de negocio?" || 
	title === "¿Pasar la idea a desarrollo?" ||
	title === "¿Enviar a ajustes de caso de negocio?" ) {
		mainFinction=validateIdea;
	}
	if(!open) return null
	return(
		<div className='modalidea'>
			<div className="modaldeaContent">
				<h3 className="rmGoldB">{title}</h3>
				<p className="rmGold">{paragraph} </p>
				<div>
					<button type="button" onClick={modalClose}>{btn1}</button>
					<button type="button" onClick={mainFinction}>{btn2}</button>
				</div>
				
			</div>
		</div>
	);
};

export { ModalIdea };