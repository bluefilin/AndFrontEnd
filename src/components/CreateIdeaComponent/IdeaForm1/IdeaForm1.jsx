import './IdeaForm1.css';
import photo from "../../../assets/img/defaultPhoto.jpg";
import { useState, useEffect } from 'react';
import adIcon from "../../../assets/icons/adIcon.svg"
import redWarning from "../../../assets/icons/redWarning.svg"
import { RetosInnovaServices } from '../../../services/reto.services';
import { getUserAvatarUrl } from '../../../services/users.services';

const IdeaForm1 = ({ register, errors, isRequired, requiredFields, setQueryList, idea, idReto }) => {
	const [charCountTitle, setCharCountTitle] = useState(0);
	const [maxLengthReachedTitle, setMaxLengthReachedTitle] = useState(false);
	const [charCountProblem, setCharCountProblem] = useState(0);
	const [maxLengthReachedProblem, setMaxLengthReachedProblem] = useState(false);
	const [errorVisible, setErrorVisible] = useState(false);
	const [query, setQuery] = useState('');
	const [selectedItem, setSelectedItem] = useState({});
	const [results, setResults] = useState([]);
	const [showRetos, setShowRetos] = useState(false);
	useEffect(() => {
		const fetchRetos = async () => {
			const retos = await RetosInnovaServices(22);
			setResults(retos);

			if (idReto) {
				setShowRetos(true);

				const retoSeleccionado = retos.find((reto) => reto._id === idReto);

				if (retoSeleccionado) {
					setSelectedItem(retoSeleccionado);
				}
			} else {
				setShowRetos(false);
			}

			if (idea && idea.reto) {
				setSelectedItem(idea.reto);
				setShowRetos(true);
			}
		};

		fetchRetos();
	}, [idReto, idea]);

	useEffect(() => {
		setQueryList([selectedItem]);
	}, [selectedItem, setQueryList]);
	const handleInputChange = event => {
		setQuery(event.target.value);
	};

	const handleTitleChange = (event) => {
		let text = event.target.value;

		if (text.length > 200) {
			text = text.slice(0, 200);
			setMaxLengthReachedTitle(true);
		} else {
			setMaxLengthReachedTitle(false);
		}
		setCharCountTitle(text.length);
		event.target.value = text;

		const isError = isRequired && errors.titulo;
		event.target.classList.toggle('error-border', isError);

		requiredFields.titulo = isError;
		setErrorVisible(isError);
	};

	const handleProblemChange = (event) => {
		let text = event.target.value;

		if (text.length > 500) {
			text = text.slice(0, 500);
			setMaxLengthReachedProblem(true);
		} else {
			setMaxLengthReachedProblem(false);
		}
		setCharCountProblem(text.length);
		event.target.value = text;

		const isError = isRequired && errors.problema;
		event.target.classList.toggle('error-border', isError);

		requiredFields.problema = isError;
		setErrorVisible(isError);
	};

	const handleChallengeChange = (event) => {
		const value = event.target.value;
		setShowRetos(value === 'si');
	};
	const handleItemClick = async (item) => {
		console.log('Nuevo selectedItem:', item);
		if (!selectedItem || selectedItem._id !== item._id) {
			try {
				const avatarUrl = await getUserAvatarUrl(item.foto);
				item.avatarUrl = avatarUrl;
				setSelectedItem(item);
			} catch (error) {
				console.error('Error al obtener la URL del avatar:', error);
			}
			setQuery('');
			console.log(selectedItem);
		}
	};

	const filteredResults = results.filter((autorSearchList) => {
		return (
			autorSearchList.titulo &&
			autorSearchList.titulo.toLowerCase().includes(query.toLowerCase()) &&
			(!selectedItem || selectedItem._id !== autorSearchList._id)
		);
	});
	return (
		<div className='ideaform1'>
			{idReto ? (
				<div className='challenged'>
					<button type='disabled'><h5>&#10004;</h5> Desafiado </button> 
					<h2>{selectedItem.titulo}</h2>
				</div>
			) : (
				<div className='challengeAssociation'>
					<div>
						<label htmlFor="">
							¿Tu idea está asociada a un reto?
						</label>
						<div className="prueba">
							<p>
								<input type="radio" name="challenge" value="si" onChange={handleChallengeChange} checked={showRetos} />Sí, viene de un reto
							</p>
							<p>
								<input type="radio" name="challenge" value="no" onChange={handleChallengeChange} />No, es una idea nueva
							</p>
						</div>
					</div>

					{showRetos && (
						<>
							<div className="ctContentAdd" id="genteExtra">
								<label htmlFor="retos">Selecciona el reto que te inspiró</label>
								<input
									id="retos"
									type="search"
									placeholder="..."
									autoComplete="off"
									onChange={handleInputChange}
									value={query}
								/>
							</div>
							{query.length > 0 && (
								<div className="ctContentUsers">
									<ul>
										{filteredResults.map((autorSearchList, index) => (
											<li key={index} onClick={() => handleItemClick(autorSearchList)}>
												{autorSearchList.titulo}
											</li>
										))}
									</ul>
								</div>
							)}
							{selectedItem && Object.keys(selectedItem).length > 0 && (
								<div className="ctContentUsers">
									<div className="ctcUser">
										<figure>
											{selectedItem.foto !== '' && selectedItem.foto !== undefined ? (
												<img src={selectedItem.avatarUrl} alt="" />
											) : (
												<img src={photo} alt="" />
											)}
										</figure>
										<div>
											<h2>{selectedItem.titulo}</h2>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			)}
			{idReto ? (
				<div className='problemss'>
					<label htmlFor="problem">
						Problema o situación
						</label>
						<div>
					<p className='problem-challenge'>
						{selectedItem.problema}
					</p>
					<input
						type="hidden"
						{...register("problema", {
							required: {
								value: isRequired ? true : false,
								message: isRequired ? "El planteamiento del problema es requerido" : "",
							},
							maxLength: {
								value: 500,
								message: "El campo no puede sobrepasar los 500 caracteres",
							},
						})}
						value={selectedItem.problema}
					/>
					</div>
					<div>
						<label htmlFor="title">
							¿Qué título tiene tu idea?  *
							<img src={adIcon} alt="" />
							<span>Asegurate que el título de la idea ayude a identificar fácilmente su objetivo</span>
						</label>
						<div className="input-container">
							<textarea
								type="text"
								placeholder='Se creativo con el nombre ...'
								{...register("titulo", {
									required: {
										value: isRequired ? true : false,
										message: isRequired ? "El título es requerido" : "",
									},
									maxLength: {
										value: 120,
										message: "El título de la idea es muy larga"
									}
								})}
								onChange={handleTitleChange}

								className={requiredFields.titulo ? 'error-border' : ''}
							></textarea>
							{requiredFields.titulo && (
								<img className="red-warning-icon" src={redWarning} alt="" />)}
							<span className="char-count" style={{ color: maxLengthReachedTitle ? '#f66' : '#999' }}>
								<span style={{ fontSize: '12px' }}>{charCountTitle}</span>
								<span style={{ fontSize: '12px' }}> / 200</span>
								<span style={{ fontSize: '12px' }}>{maxLengthReachedTitle && ' - El campo de caracteres ya es máximo'}</span>
							</span>
						</div>
						{requiredFields.titulo && (
							<div className="error-message">{'Completar campo'}</div>
						)}
					</div>

				</div>

			) : (
				<>
					      <div>
        <label htmlFor="title">
          ¿Qué título tiene tu idea? *
          <img src={adIcon} alt="" />
          <span>Asegurate que el título de la idea ayude a identificar fácilmente su objetivo</span>
        </label>
        <div className="input-container">
          <textarea
            type="text"
            placeholder="Se creativo con el nombre..."
            {...register('titulo', {
              required: {
                value: isRequired ? true : false,
                message: isRequired ? 'Completar campo' : '',
              },
              maxLength: {
                value: 200,
                message: 'El campo no puede sobrepasar los 50 caracteres',
              },
            })}
            onChange={handleTitleChange}
            className={requiredFields.titulo ? 'error-border' : ''}
          ></textarea>
          {requiredFields.titulo && (
            <img className="red-warning-icon" src={redWarning} alt="" />
          )}
          <span className="char-count" style={{ color: maxLengthReachedTitle ? '#f66' : '#999' }}>
            <span style={{ fontSize: '12px' }}>{charCountTitle}</span>
            <span style={{ fontSize: '12px' }}> / 200</span>
            <span style={{ fontSize: '12px' }}>{maxLengthReachedTitle && ' - El campo de caracteres ya es máximo'}</span>
          </span>
        </div>
        {requiredFields.titulo && (
          <div className="error-message">{'Completar campo'}</div>
        )}
      </div>

					<div>
						<label htmlFor="problem">
							¿Cuál es la situación o el problema? *
							<img src={adIcon} alt="" />
							<span>Explica de la manera más clara posible el problema que quieres solucionar. Puedes ayudarte con la herramienta “Los 5 por qués? “ </span>
						</label>
						<div className="input-container">
							<textarea
								id="problem"
								placeholder='Describe la situación que vas a mejorar o el problema que quieres solucionar con tu idea...'
								{...register("problema", {
									required: {
										value: isRequired ? true : false,
										message: isRequired ? "El planteamiento el problema es requerido" : "",
									},
									maxLength: {
										value: 500,
										message: "El campo no puede sobrepasar los 500 caracteres"
									}
								})}
								onChange={handleProblemChange}
								className={requiredFields.problema ? 'error-border' : ''}
							></textarea>
							{requiredFields.problema && (
								<img className="red-warning-icon" src={redWarning} alt="" />
							)}
							<span className="char-count" style={{ color: maxLengthReachedProblem ? '#f66' : '#999' }}>
								<span style={{ fontSize: '12px' }}>{charCountProblem}</span>
								<span style={{ fontSize: '12px' }}> / 500</span>
								<span style={{ fontSize: '12px' }}>{maxLengthReachedProblem && ' - El campo de caracteres ya es máximo'}</span>
							</span>
						</div>
						{requiredFields.problema && (
							<div className={`error-message ${errorVisible ? 'visible' : ''}`}>
								{'Completar campo'}
							</div>
						)}
					</div>
				</>)}
		</div>
	);
};
export { IdeaForm1 };