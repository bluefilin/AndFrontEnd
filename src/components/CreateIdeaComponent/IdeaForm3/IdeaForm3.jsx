import React, { useState } from 'react';
import './IdeaForm3.css';
import adIcon from "../../../assets/icons/adIcon.svg"
import redWarning from "../../../assets/icons/redWarning.svg"

const IdeaForm3 = ({ register, errors, isRequired, requiredFields }) => {
	const [charCountbeneC, setCharCountbeneC] = useState(0);
	const [maxLengthReachedbeneC, setMaxLengthReachedbeneC] = useState(false);
	const [errorVisible, setErrorVisible] = useState(false);
	const [charCountbeneU, setCharCountbeneU] = useState(0);
	const [maxLengthReachedbeneU, setMaxLengthReachedbeneU] = useState(false);

	const handlebeneUChange = (event) => {
		let text = event.target.value;

		if (text.length > 500) {
			text = text.slice(0, 500);
			setMaxLengthReachedbeneU(true);
		} else {
			setMaxLengthReachedbeneU(false);
		}
		setCharCountbeneU(text.length);

		event.target.value = text;

		const isError = isRequired && errors.beneficioU;
		event.target.classList.toggle('error-border', isError);


		requiredFields.beneficioU = isError;
		setErrorVisible(isError);
	};

	const handlebeneCChange = (event) => {

		let text = event.target.value;

		if (text.length > 500) {
			text = text.slice(0, 500);
			setMaxLengthReachedbeneC(true);
		} else {
			setMaxLengthReachedbeneC(false);
		}
		setCharCountbeneC(text.length);

		const isError = isRequired && errors.beneficioC;
		event.target.classList.toggle('error-border', isError);

		requiredFields.beneficioC = isError;
		setErrorVisible(isError);

		event.target.value = text;
	};
	return (
		<div className='ideaform3'>
			<div>
				<label htmlFor="beneU">
					¿Cuáles serán los beneficios para los usuarios? *
					<img src={adIcon} alt="" />
					<span>La herramienta “Mapa de impacto” te puede ayudar a definirlos mejor.</span>
				</label>
				<div className="input-container">
					<textarea
						id="beneU"
						placeholder='Cuéntanos como ayudará tu idea a las personas  ...'
						{...register("beneficioU", {
							required: {
								value: isRequired ? true : false,
								message: isRequired ? "Los beneficios de los usuarios requeridos" : "",
							},
							maxLength: {
								value: 500,
								message: "El campo no puede sobrepasar los 500 caracteres"
							}
						})}
						onChange={handlebeneUChange}
						className={requiredFields.beneficioU ? 'error-border' : ''}
					></textarea>
					<span className="char-count" style={{ color: maxLengthReachedbeneU ? '#f66' : '#999' }}>
						<span style={{ fontSize: '12px' }}>{charCountbeneU}</span>
						<span style={{ fontSize: '12px' }}> / 500</span>
						<span style={{ fontSize: '12px' }}>{maxLengthReachedbeneU && ' - El campo de caracteres ya es máximo'}</span>
					</span>
					{requiredFields.beneficioU && (
						<img className="red-warning-icon" src={redWarning} alt="" />
					)}
				</div>
				{requiredFields.beneficioU && (
					<div className={`error-message ${errorVisible ? 'visible' : ''}`}>
						{'Completar campo'}
					</div>
				)}
			</div>
			<div>
				<label htmlFor="beneC">
					¿Cuáles serán los beneficios para Grupo ASD? *
					<img src={adIcon} alt="" />
					<span>La herramienta “Mapa de impacto” te puede ayudar a definirlos mejor.</span>
				</label>
				<div className="input-container">
					<textarea
						id="beneC"
						placeholder='Cuéntanos como ayudará tu idea a nuestra organización ...'
						{...register("beneficioC", {
							required: {
								value: isRequired ? true : false,
								message: isRequired ? "Los beneficios de la compañia son requeridos" : "",
							},
							maxLength: {
								value: 500,
								message: "El campo no puede sobrepasar los 500 caracteres"
							}
						})}
						onChange={handlebeneCChange}
						className={requiredFields.beneficioC ? 'error-border' : ''}
					></textarea>
					<span className="char-count" style={{ color: maxLengthReachedbeneC ? '#f66' : '#999' }}>
						<span style={{ fontSize: '12px' }}>{charCountbeneC}</span>
						<span style={{ fontSize: '12px' }}> / 500</span>
						<span style={{ fontSize: '12px' }}>{maxLengthReachedbeneC && ' - El campo de caracteres ya es máximo'}</span>
					</span>
					{requiredFields.beneficioC && (
						<img className="red-warning-icon" src={redWarning} alt="" />
					)}
				</div>
				{requiredFields.beneficioC && (
					<div className={`error-message ${errorVisible ? 'visible' : ''}`}>
						{'Completar campo'}
					</div>
				)}
			</div>
		</div>
	);
};
export { IdeaForm3 };