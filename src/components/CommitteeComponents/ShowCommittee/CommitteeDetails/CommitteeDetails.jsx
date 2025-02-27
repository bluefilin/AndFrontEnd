import React, { useState, useEffect } from 'react';
import './CommitteDetails.css';
import editcommiteA from "../../../../assets/icons/editA.svg";
import editcommite from "../../../../assets/icons/edit.svg";

import { getUsersCommitte } from '../../../../services/users.services';
import defaultPhoto from "../../../../assets/img/defaultPhoto.jpg";

const CommitteeDetails = ({ 
	commiteContent, 
	confidencialidad, 
	setConfidencialidad,
	selectedUsers,
	setSelectedUsers,
	MembersAvatarUrls,
	setMembersAvatarUrls,	
	setShowSendSave,
	showSendSave,
	putUpdateCommittee,
	toogleDetails,
	isDetalleIcon,
	allUsersUrl
}) => {
		
	const [editableConfidencialidad, setEditableConfidencialidad] = useState(commiteContent?.confidencialidad);
	const [showConfidencialidad, setShowConfidencialidad] = useState(true);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [tipoComite, setTipoComite] = useState("Ordinario");
	const [committeeParticipants, setCommitteeParticipants] = useState([]); 
		
	const handleUserSelection = (userId, isChecked) => {
		if (isChecked) {
		  // Agregar el usuario a la lista si no está presente
		  setSelectedUsers((prevSelectedUsers) => {
			const updatedUsers = [...prevSelectedUsers, userId];
			return Array.from(new Set(updatedUsers)); // Eliminar duplicados si los hay
		  });
		} else {
		  // Quitar el usuario de la lista si está presente
		  setSelectedUsers((prevSelectedUsers) =>
			prevSelectedUsers.filter((id) => id !== userId)
		  );
		}
	  };

	useEffect(() => {
		
		console.log('Selected Users:', selectedUsers);
	}, [selectedUsers]);
	
	useEffect(() => {
		if (isEditMode) {
			getUsersCommitte()
				.then((comiteUsers) => {
					setCommitteeParticipants(comiteUsers);
					console.log(comiteUsers);
				})
				.catch((error) => {
					console.error('Error al recuperar usuarios del grupo "comité":', error);
				});
		}
	}, [isEditMode]);

	

	const handleEditClick = () => {
		// Si la confidencialidad del comité no está editable, mostrar el icono de edición
		if (!isEditMode) {
			setEditableConfidencialidad(commiteContent?.confidencialidad);
			setShowConfidencialidad(false);
			setIsEditMode(true);
			setIsCheckboxVisible(true);
			setIsEditing(true);
			
			setTipoComite(commiteContent?.tipo);
				if(commiteContent?.tipo ==='Ordinario') {
					setSelectedUsers(commiteContent?.integrantes.map(integrante =>integrante._id));
				}else{	
					setSelectedUsers([]);}
			// Ocultar la división de confidencialidad
			document.querySelector('.confidentiality-container').classList.add('hidden');

			// Actualizar lista de participantes según la confidencialidad
			const participants = (commiteContent?.confidencialidad === "Ordinario")
				? commiteContent?.integrantes
				: [];
        	setCommitteeParticipants(participants);
			console.log("Edit icon clicked");
		}else if (!isDetalleIcon) {
			//Si el icono de detalles está activo, desactivar la edición
			setIsEditing(false);
			setIsEditMode(false);
		}else {
			// Actualizar los integrantes del comité en la base de datos durante el modo de edición
			const updatedCommiteContent = {
			  ...commiteContent,
			  confidencialidad,
			  integrantes: integrantes.map((userId) => ({
				_id: userId,
				// Otras propiedades del participante según tu estructura de datos
			  })),
			};
		
			putUpdateCommittee(commiteContent._id, updatedCommiteContent)
			  .then((updatedData) => {
				console.log('Comité actualizado en la base de datos:', updatedData);
		
				// Actualizar el estado con los participantes seleccionados
				setCommitteeParticipants(updatedData.integrantes);
				
				setIsEditing(false);
				setIsEditMode(false);
			})
			  .catch((error) => {
				console.error('Error al actualizar el comité en la base de datos:', error);
			});
			console.log('Comité actualizado en la base de datos:', updatedData);
		}
	};
	// console.log(committeeParticipants);
	return (
		<>
		<article className='detailsCommittee'>
		<div className="Header">
						<h3>Detalles *</h3>
						<span onClick={handleEditClick}>
						{commiteContent.estado === "652ed8d0d698f429de6e6e4b" ? null : (
							<img 
								id='detalleIco' 							
								src={isDetalleIcon ? editcommite : editcommiteA} 
								alt="" onClick={toogleDetails } 
							/>
						)}
						</span>
						</div>
						<div>
							<p>Tipo de comité</p>
							<p className="normal-text">{commiteContent?.tipo}</p>                    				
						</div>
						<div>
							<p>Confidencialidad</p>
							<div className="confidentiality-container">
								{showConfidencialidad && <p>{commiteContent?.confidencialidad}</p>}
							</div>						
							{isEditing && (
								<div className='radiosCommitte'>
								<label htmlFor="confidencialidadDropdown"></label>
								<select
									id="confidencialidadDropdown"
									name="confidencialidad"
									value={confidencialidad}
									onChange={(e) => {
										setConfidencialidad(e.target.value);									
										// Si la opción seleccionada es "Ordinario", establecer selectedUsers igual a integrantes
										if (e.target.value === 'Ordinario') {
										  setSelectedUsers(committeeParticipants);
										}
										else if (e.target.value === 'Extraordinario') {
											setSelectedUsers(committeeParticipants?.filter(integrante => 
											  selectedUsers.includes(integrante._id) ||
											  (integrante.correo === "Armando@gmail.com" ||
											  (integrante.nombres.includes("Armando") && integrante.apellidos.includes("Florez")))
											).map(integrante => integrante._id) || []);
										  }
									  }}
									>
									<option value="Ordinario">Ordinario</option>
									<option value="Extraordinario">Extraordinario</option>
								</select>
								</div>
						)}
						</div>
						<div>
							<p>Participantes</p>
							<p className="normal-text">{commiteContent?.integrantes?.length}</p>
						</div>
					</article>
					<br /><br /><br />
					<article className='membersCommittee'>
						<h3>Participantes</h3>
						<h4>Invitados</h4>
						{isEditMode ? (
							// Si está en modo de edición, muestra los participantes seleccionados
							committeeParticipants.map((integrante, index) => (
							<div key={index} className="member">
								<div>
								{allUsersUrl[index] !== null ? (
									<img src={allUsersUrl[index]} alt="" />
								) : (
									<img src={defaultPhoto} alt="" />
								)}
								</div>
								<div>
								<p>{integrante?.nombres.split(" ")[0]} {integrante?.apellidos.split(" ")[0]}</p>
								<p>{integrante?.cargo}</p>
								</div>
								<div className="commiteeMember" key={index}>
									{confidencialidad === "Ordinario" && (
									<input
										type="checkbox"
										className='inputCheckComite'
										checked={true}
										disabled={true}
										name="integrante"
										id={`integrante-${index}`}
									/>
									)}
									{confidencialidad === "Extraordinario" && (
									<input
										type="checkbox"
										className='inputCheckComite'
										checked={
											selectedUsers.includes(integrante._id) ||
											(integrante.correo === "Armando@gmail.com" ||
											integrante.nombres.includes("Armando") &&
											integrante.apellidos.includes("Florez"))
										}
										onChange={(e) => {
											if (
												integrante.correo === "Armando@gmail.com" ||
												integrante.nombres.includes("Armando") &&
												integrante.apellidos.includes("Florez")
											) {
												return; // Evitar desmarcar a Armando@gmail.com
											}
											handleUserSelection(integrante._id, e.target.checked);
										}}
										name="integrante"
										id={`integrante-${index}`}
									/>
									)}
								</div>
							</div>
							))
						) : (
							// Si no está en modo de edición, muestra los participantes originales
							commiteContent?.integrantes?.map((integrante, index) => (
							<div key={index} className="member">
								<div>
								{MembersAvatarUrls[index] !== null ? (
									<img src={MembersAvatarUrls[index]} alt="" />
								) : (
									<img src={defaultPhoto} alt="" />
								)}
								</div>
								<div>
								<p>{integrante?.nombres.split(" ")[0]} {integrante?.apellidos.split(" ")[0]}</p>
								<p>{integrante?.cargo}</p>
								</div>
								
							</div>
							))
						)}
						</article>
					</>
						)
}											
export { CommitteeDetails };