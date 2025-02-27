import './SendModal.css';

const SendModal = ({titulo, img, paragraf, btn1, btn2, fnct1, fnct2}) => {
	return(
		<div className='sendmodal'>
			<div className="sendModalContent">
				<h4>{titulo}</h4>
				<img src={img} alt="" />
				<p>{paragraf}</p>
				<div>
					{btn1 && (
						<button onClick={fnct1} className='btn1'>{btn1}</button>
					)}
					<button type="button" onClick={fnct2} className='btn2'>{btn2}</button>
				</div>
			</div>
		</div>
	);
};


export {SendModal};