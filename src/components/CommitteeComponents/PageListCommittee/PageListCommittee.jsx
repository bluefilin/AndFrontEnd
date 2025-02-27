import './PageListCommittee.css';
import { Link } from 'react-router-dom/dist';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import defaultFox from "../../../assets/img/defaultPhoto.jpg"

const PageListCommittee = ({ committeeList }) => {
	return (
		<div className='pagelistcommittee'>
			<p>
				{/* {startIndex + 1} - {endIndex} de {ideasList.length}
				<span
					onClick={prev}
					className={currentPage > 1 ? "prevNext" : "prevNextDisable"}
				>
					&lt;
				</span>
				<span
					onClick={next}
					className={currentPage < totalPages ? "prevNext" : "prevNextDisable"}
				>
					&gt;
				</span> */}



			</p>
			<div className='elementsList'>
				{committeeList.reverse().map((committe, index) => (
					<Link className="committeeItem" to={`/comite/${committe._id}`}
						key={index} >
						<figure>
							<img src={defaultFox} alt="" />
						</figure>
						<div className='committeeListeElement'>
							<h3>Comité del {format(new Date(committe?.fechaInicio), 'dd/MMM/yy', { locale: es })} </h3>
							<p>Estado: <span>{committe.estado.nombre}</span></p>
							<p>Tipo de comité: <span>{committe.tipo}</span></p>
						</div>
						<div className='committeeParticipants'>Participantes: <span> {committe.integrantes.length}</span> </div>
					</Link>
				))}
			</div>
		</div>
	);
};


export { PageListCommittee };