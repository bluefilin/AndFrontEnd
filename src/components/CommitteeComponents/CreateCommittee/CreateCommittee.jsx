/* eslint-disable react/prop-types */
import { useState } from 'react';
import './CreateCommittee.css';
import { postCreateCommittee } from '../../../services/committee.services';
import { useEffect } from 'react';
import { getUsersCommitte } from '../../../services/users.services';
import redWarning from "../../../assets/icons/redWarning.svg";
import errorFox from "../../../assets/img/errorFox.png"

const CreateCommittee = ({ closeModal, closeModalReload}) => {
	const [date, setDate] = useState("");
	const [initialHour, setInitialHour] = useState('');
	const [endHour, setEndHour] = useState('');
	const [confidencialidad, setConfidencialidad] = useState('Comité Público');
	const [tipoComite, setTipoComite] = useState('')
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [committes, setcommittes] = useState([])
	const [validateButtons, setValidateButtons] = useState(true); 
	const [validateEnd, setValidateEnd] = useState(false)

	useEffect(() => {
		const getUserCommite = async () => {
			const usersCommite = await getUsersCommitte();
			setcommittes(usersCommite);

			const allUserIds = usersCommite.map(user => user._id);
     		 setSelectedUsers(allUserIds);
		}
		getUserCommite()
	}, [])
	const handleUserSelection = (userId, isChecked) => {
		if (isChecked) {
			setSelectedUsers([...selectedUsers, userId]);
		  } else {
			setSelectedUsers(selectedUsers.filter(id => id !== userId));
		  }
	  }
	const createNewCommittee = async () => {
		/* e.preventDefault(); */
		try {

			const committeeData = {
				tipo:tipoComite,
				fechaInicio: new Date(`${date} ${initialHour}`),
				fechaFinalizacion:new Date(`${date} ${endHour}`),
				integrantes:[...selectedUsers],
				confidencialidad:confidencialidad
			}
			const response = await postCreateCommittee(committeeData)
			console.log(response)
		}
		catch (err) {
			console.log(err)
		}
	}
	const validateCommittee = ()=>{
		if(date === "" || initialHour === "" || endHour === ""){
			setValidateButtons(false)
			setValidateEnd(false)
		}else{
			createNewCommittee()
			setValidateButtons(false)
			setValidateEnd(true)
		}
	}
	return (
		<>
					<h2 className='createCommitteeTitle'>Crear comité</h2>
					<p className='createCommitteeSubtitle'>Selecciona el día, tipo y participantes que asistrirán al comité</p>
					<div className='committee'>
						<h2 className='subtitleModal'>Día y hora *</h2>
						<p>
							Puedes agregar un comité teniendo únicamente la fecha de la reunión. Para programarlo 
							debes tener todos los datos antes de enviar a los miembros del comité
						</p>
						<div className='committeDate'>
							<div>
								<input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
								/>
								<label htmlFor="date">Fecha</label>
							</div>
							<div className="committeTime">
								<span>
									<input
										type="time"
										value={initialHour}
										onChange={(e) => setInitialHour(e.target.value)}
									/>
									<label htmlFor="date">Hora de inicio</label>
								</span>
								<span>
									<input
										type="time"
										value={endHour}
										onChange={(e) => setEndHour(e.target.value)}
									/>
									<label htmlFor="date">Hora final</label>
								</span>
							</div>
						</div>
						<div className="committeeType">
							<h2 className='subtitleModal'>Tipo de comité </h2>
							<p>En los comités de proyectos se analizan los casos de negocio</p>
							<div className='radiosCommitte' >
								<label htmlFor="cOportunity">
									<input type="radio" name="typeCommitee" id="cOportunity" value="Comité Oportunidad" onChange={()=>{setTipoComite("Comité Oportunidad")}} />Comité Oportunidad
								</label>
								<label htmlFor="cProyect">
									<input type="radio" name="typeCommitee" id="cProyect" value="Comité Proyecto" onChange={()=>{setTipoComite("Comité Proyecto")}}/>Comité Proyecto
								</label>
								
							</div>
						</div>
						<div className="committeeConfidentiality" >
							<h2 className='subtitleModal'>Confidencialidad </h2>
							<p>En los comités Extraordinarios no puedes invitar a todos los miembros del comité.</p>
							<div className='radiosCommitte' >
								<label htmlFor="cOrdinario">
									<input 
										type="radio" 
										name="confidencialidad" 
										id="cOrdinario" 
										value="Comite Ordinario"
										checked={confidencialidad === 'Comité Ordinario'} 
										onChange={() => setConfidencialidad('Comité Ordinario')}
									/>Comite Ordinario
								</label>
								<label htmlFor="cExtraordinario">
									<input 
										type="radio" 
										name="confidencialidad" 
										id="cExtraordinario"
										value="Comite Extraordinario"
										checked={confidencialidad === 'Comité Extraordinario'} 
										onChange={() => setConfidencialidad('Comité Extraordinario')}
									 />Comite Extraordinario
								</label>										
							</div>
						</div>
						<div className='members'>
							{committes.map((user, index) => ( 
								<div className="commiteeMember" key={index} >
									{confidencialidad == "Comité Extraordinario" && (
										<input 
											type="checkbox" 
											className='inputCheck' 
											defaultChecked={selectedUsers.includes(user._id)}
											onChange={(e) => handleUserSelection(user._id, e.target.checked)}
											name="integrante" 
											id="" 
										/>
									)}
									
									<label htmlFor="">
										<span className='memberName'>{user.nombres + " " + user.apellidos}</span> 
										<p className='memberPost'>{user.cargo}</p> 
									</label>
								</div>
							))}

						</div>
						{validateButtons ? (
							<div className='createCommitteeButtons'>
								<button className='button buttonFill'  onClick={validateCommittee}>Agregar</button>
								<button className='button buttonOutline' onClick={closeModal}>Cancelar</button>
							</div>
						):(
							validateEnd?(
								<div className='successfulCreateComite'>
									<h3>¡Comité creado!</h3>
									<p>Ahora, si lo deseas puedes seguir agregando ideas a esta fecha antes de enviar la programación al comité </p>
									<span onClick={closeModalReload}>Seguir validando</span>
								</div>
							):(
								<div className='errorMsn1'>
									<p>
										Tienes que diligenciar los campos de fecha y hora
										<img src={redWarning} alt="" />
									</p>
									<span onClick={()=>setValidateButtons(true)}>
										Revisar
									</span>
									<img src={errorFox} alt="" />
								</div>
							)
						)}
						
					</div>
		</>
	);
};
export { CreateCommittee };