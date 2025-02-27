import './ShowRetos.css';
import { NavRetos } from '../NavRetos/NavRetos';
import { RetoForm } from '../../CreateRetoComponent/RetoForm/RetoForm';
// import { MainReto } from '../MainReto';
import { MainRetoChallenge } from '../MainRetoChallenge/MainRetoChallenge';

const ShowRetos = ({ reto, onPreviousClick, onNextClick }) => {
	const retoResume = reto;
	return (
		<div className='showreto'>
			{retoResume.estado.nombre === "Ajustar" || retoResume.estado.nombre === "Pendiente" ? (
				<RetoForm
					reto={retoResume}
				/>
			) : (
				<MainRetoChallenge
					retoResume={retoResume}
				/>
			)}
			<NavRetos
				onPreviousClick={onPreviousClick}
				onNextClick={onNextClick}
			/>
		</div>
	);
};

export { ShowRetos };