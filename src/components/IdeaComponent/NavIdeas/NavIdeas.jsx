/* eslint-disable react/prop-types */
import './NavIdeas.css';

const NavIdeas = ({ onPreviousClick, onNextClick }) => {
	return (
		<div className='navideas'>
			<span onClick={onPreviousClick}>Anterior idea</span>
			<span onClick={onNextClick}>Siguiente idea</span>
		</div>
	);
};

export { NavIdeas };