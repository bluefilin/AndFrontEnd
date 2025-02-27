import React, { useState } from 'react';
import './RetoForm1.css';
import adIcon from '../../../assets/icons/adIcon.svg';
import redWarning from "../../../assets/icons/redWarning.svg"
const RetoForm1 = ({ register, errors, isRequired, requiredFields }) => {
  const [charCountTitle, setCharCountTitle] = useState(0);
  const [maxLengthReachedTitle, setMaxLengthReachedTitle] = useState(false);
  const [charCountProblem, setCharCountProblem] = useState(0);
  const [maxLengthReachedProblem, setMaxLengthReachedProblem] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

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

  return (
    <div className="retoform1">
      <div>
        <label htmlFor="title">
          ¿Qué título tiene tu reto? *
          <img src={adIcon} alt="" />
          <span>Asegúrate de que el título del reto ayude a identificar fácilmente su objetivo.</span>
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
          ¿Cuál es la situación o problema? *
          <img src={adIcon} alt="" />
          <span>Explica de la manera más clara posible el problema que quieres solucionar. Puedes ayudarte con la herramienta "los 5 ¿por que?".</span>
        </label>
        <div className="input-container">
          <textarea
            id="problem"
            placeholder="Describe la situación para que los demás puedan entender de que se trata el reto y buscar una solución..."
            {...register('problema', {
              required: {
                value: isRequired ? true : false,
                message: isRequired ? 'El planteamiento del problema es requerido' : '',
              },
              maxLength: {
                value: 500,
                message: 'El campo no puede sobrepasar los 50 caracteres',
              },
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
          <div className={`error-message ${errorVisible ? 'visible' : ''}`} style={{ fontSize: '12px' }}>
            {'Completar campo'}
          </div>
        )}
      </div>
    </div>
  );
};

export { RetoForm1 };
