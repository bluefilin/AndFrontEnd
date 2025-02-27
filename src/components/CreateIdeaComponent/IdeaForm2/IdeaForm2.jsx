import React, { useState } from 'react';
import './IdeaForm2.css';
import adIcon from "../../../assets/icons/adIcon.svg"
import redWarning from "../../../assets/icons/redWarning.svg"
const IdeaForm2 = ({ register, errors, isRequired, requiredFields }) => {
	const [errorVisible, setErrorVisible] = useState(false);
	const [charCountclients, setCharCountclients] = useState(0);
	const [maxLengthReachedclients, setMaxLengthReachedclients] = useState(false);
	const [charCountimplementation, setCharCountimplementation] = useState(0);
	const [maxLengthReachedimplementation, setMaxLengthReachedimplementation] = useState(false);
	const [charCountfunction, setCharCountfunction] = useState(0);
	const [maxLengthReachedfunction, setMaxLengthReachedfunction] = useState(false);

	const handleclients = (event) => {
		let text = event.target.value;

		if (text.length > 500) {
			text = text.slice(0, 500);
			setMaxLengthReachedclients(true);
		} else {
			setMaxLengthReachedclients(false);
		}
		setCharCountclients(text.length);

		event.target.value = text;

		const isError = isRequired && errors.clientes;

		event.target.classList.toggle('error-border', isError);

		requiredFields.clientes = isError;

		setErrorVisible(isError);
	};



	const handlefunction = (event) => {
		let text = event.target.value;

		if (text.length > 500) {
			text = text.slice(0, 500);
			setMaxLengthReachedfunction(true);
		} else {
			setMaxLengthReachedfunction(false);
		}
		setCharCountfunction(text.length);

		const isError = isRequired && errors.funcion;
		event.target.classList.toggle('error-border', isError);

		requiredFields.funcion = isError;
		setErrorVisible(isError);

		event.target.value = text;
	};


	const handleimplementation = (event) => {

		let text = event.target.value;

		if (text.length > 500) {
			text = text.slice(0, 500);
			setMaxLengthReachedimplementation(true);
		} else {
			setMaxLengthReachedimplementation(false);
		}
		setCharCountimplementation(text.length);

		const isError = isRequired && errors.implementacion;

		event.target.classList.toggle('error-border', isError);

		requiredFields.implementacion = isError;

		setErrorVisible(isError);

		event.target.value = text;
	};
	return (
		<div className='ideaform2'>
			<div>
				<label htmlFor="clients">
					¿Quiénes son los usuarios? *
					<img src={adIcon} alt="" />
					<span>Para identificarlos mejor puedes ayudarte con las herramientas “Mapa de actores” o “Mapa de empatía”</span>
				</label>
				<div className="input-container">
					<textarea
						id="clients"
						placeholder='Describe a las personas que se relacionan directamente con tu idea o que se beneficiarán con ella ...'
						{...register("clientes", {
							required: {
								value: isRequired ? true : false,
								message: isRequired ? "El planteamiento de los usuarios es requerido" : "",
							},
							maxLength: {
								value: 500,
								message: "El campo no puede sobrepasar los 500 caracteres"
							}
						})}
						onChange={handleclients}
						className={requiredFields.clientes ? 'error-border' : ''}
					></textarea>
					<span className="char-count" style={{ color: maxLengthReachedclients ? '#f66' : '#999' }}>
						<span style={{ fontSize: '12px' }}>{charCountclients}</span>
						<span style={{ fontSize: '12px' }}> / 500</span>
						<span style={{ fontSize: '12px' }}>{maxLengthReachedclients && ' - El campo de caracteres ya es máximo'}</span>
					</span>
					{requiredFields.clientes && (
						<img className="red-warning-icon" src={redWarning} alt="" />
					)}
				</div>
				{requiredFields.clientes && (
					<div className={`error-message ${errorVisible ? 'visible' : ''}`}>
						{'Completar campo'}
					</div>
				)}
			</div>
			<div>
				<label htmlFor="function">
					¿Cómo funcionará? *
					<img src={adIcon} alt="" />
					<span>Explica como tu idea intenta solucionar el problema. Puedes utilizar un “ Diagrama de flujo”</span>
				</label>
				<div className="input-container">
					<textarea
						id="function"
						placeholder='Detalla los pasos para construir tu idea'
						{...register("funcion", {
							required: {
								value: isRequired ? true : false,
								message: isRequired ? "El funcionamiento es requerido" : "",
							},
							maxLength: {
								value: 500,
								message: "El campo no puede sobrepasar los 500 caracteres"
							}
						})}
						onChange={handlefunction}
						className={requiredFields.funcion ? 'error-border' : ''}
					></textarea>
					<span className="char-count" style={{ color: maxLengthReachedfunction ? '#f66' : '#999' }}>
						<span style={{ fontSize: '12px' }}>{charCountfunction}</span>
						<span style={{ fontSize: '12px' }}> / 500</span>
						<span style={{ fontSize: '12px' }}>{maxLengthReachedfunction && ' - El campo de caracteres ya es máximo'}</span>
					</span>
					{requiredFields.funcion && (
						<img className="red-warning-icon" src={redWarning} alt="" />
					)}
				</div>
				{requiredFields.funcion && (
					<div className={`error-message ${errorVisible ? 'visible' : ''}`}>
						{'Completar campo'}
					</div>
				)}
			</div>

			<div>
				<label htmlFor="implementation">
					¿Cómo se implementará? *
					<img src={adIcon} alt="" />
					<span>Aquí puedes ilustrar tu idea con un “ Road Map” o un “ Plan de trabajo”</span>
				</label>
				<div className="input-container">
					<textarea
						id="implementation"
						placeholder='Describe como será su ejecución  ...'
						{...register("implementacion", {
							required: {
								value: isRequired ? true : false,
								message: isRequired ? "La implementación es requerida" : "",
							},
							maxLength: {
								value: 500,
								message: "El campo no puede sobrepasar los 500 caracteres"
							}
						})}
						onChange={handleimplementation}
						className={requiredFields.implementacion ? 'error-border' : ''}
					></textarea>
					<span className="char-count" style={{ color: maxLengthReachedimplementation ? '#f66' : '#999' }}>
						<span style={{ fontSize: '12px' }}>{charCountimplementation}</span>
						<span style={{ fontSize: '12px' }}> / 500</span>
						<span style={{ fontSize: '12px' }}>{maxLengthReachedimplementation && ' - El campo de caracteres ya es máximo'}</span>
					</span>
					{requiredFields.implementacion && (
						<img className="red-warning-icon" src={redWarning} alt="" />
					)}
				</div>
				{requiredFields.implementacion && (
					<div className={`error-message ${errorVisible ? 'visible' : ''}`}>
						{'Completar campo'}
					</div>
				)}
			</div>
		</div>
	);
};

export { IdeaForm2 };