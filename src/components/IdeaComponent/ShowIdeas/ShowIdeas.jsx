import './ShowIdeas.css';
import { NavIdeas } from '../NavIdeas';
import { MainIdea } from '../MainIdea';
import { IdeaForm } from '../../CreateIdeaComponent/IdeaForm';


const ShowIdeas = ({idea, onPreviousClick, onNextClick}) => {
	const ideaResume = idea;
	
	return (
		<div className='showideas'>
			{ideaResume.estado.nombre === "Ajustar" || ideaResume.estado.nombre === "Pendiente" ? (
				<IdeaForm
					idea={ideaResume}
				/>	
			):(
				<MainIdea
					ideaResume={ideaResume}
				/>
			)}
			
			<NavIdeas
				onPreviousClick={onPreviousClick}
				onNextClick={onNextClick}
			/>
		</div>
	);
};

export { ShowIdeas };