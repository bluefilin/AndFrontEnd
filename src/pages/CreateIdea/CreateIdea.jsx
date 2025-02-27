import './CreateIdea.css';
import { IdeaForm } from '../../components/CreateIdeaComponent/IdeaForm';


const CreateIdea = () => {
	return (
		<div className='createidea'>
			<h2>Crea tu idea</h2>
			<IdeaForm/>
		</div>
	)
};

export { CreateIdea };