/* eslint-disable react/prop-types */
import './NavRetos.css';

const NavRetos = ({ onPreviousClick, onNextClick }) => {
	return (
		<div className='navretos'>
			<span onClick={onPreviousClick}>Anterior reto</span>
			<span onClick={onNextClick}>Siguiente reto</span>
		</div>
	);
};

export { NavRetos };