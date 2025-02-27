import './SendModalIdeasCom.css';

const SendModal = ({titulo, img, paragraf, btn1, btn2, fnct1, fnct2}) => {
	return(
		<div className='sendmodalIdeasComite'> 
			<div className="sendModalContentIdeas">
				<h4 className='Titulo'>{titulo}</h4>
				<img className='Imagen' src={img} alt="" />
				<p className='Parrafo'>{paragraf}</p>
				<div className='divBotones'>
					{btn1 && (
						<button onClick={fnct1} className='btn100'>{btn1}</button>
					)}
					<button type="button" onClick={fnct2} className='btn200'>{btn2}</button>
				</div>
			</div>
		</div>
	);
};


export {SendModal};