import './Committee.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom/dist';
import { getCommitteeId } from '../../services/committee.services';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShowCommittee } from '../../components/CommitteeComponents/ShowCommittee';
const Committee = () => {
	const { idComite } = useParams();
	const [committe, setCommitte] = useState([])
	useEffect(() => {
		const getCommite = async () => {
			let committeData = await getCommitteeId(idComite);
			setCommitte(committeData)
		}
		getCommite()
	}, [])
	
	return (
		
	<div className='committee'>
		   {committe.estado === "652ed8d0d698f429de6e6e4b" ?  (
			<div>
	<h2>Comité agendado - {committe?.fechaInicio ? format(new Date(committe?.fechaInicio), 'dd/M/y', { locale: es }).replace(/\b\w/g, l => l.toUpperCase()) : ''}</h2>
	<p>Aquí puedes validar y editar la información del comité que estas creando</p>
	</div>
		   ):(
			<div>
		<h2>Comité creado</h2>
		<p>Recuerda que para programar un comité debes completar todos los campos</p>
		</div>
		   )}
		<ShowCommittee
			commiteContent={committe}
		/>
	</div>
	);
};

export default Committee;