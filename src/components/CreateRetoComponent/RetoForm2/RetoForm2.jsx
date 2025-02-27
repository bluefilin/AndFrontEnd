import React, { useState } from 'react';
import './RetoForm2.css';
import adIcon from '../../../assets/icons/adIcon.svg';
import redWarning from "../../../assets/icons/redWarning.svg"
const RetoForm2 = ({ register, errors, isRequired, requiredFields }) => {
  const [charCount, setCharCount] = useState(0);
  const [maxLengthReached, setMaxLengthReached] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  const handleTextareaChange = (event) => {
    let text = event.target.value;

    if (text.length > 500) {
      text = text.slice(0, 500);
      setMaxLengthReached(true);
    } else {
      setMaxLengthReached(false);
    }
    setCharCount(text.length);

    const isError = isRequired && errors.clientes;
    event.target.classList.toggle('error-border', isError);

    requiredFields.clientes = isError;
    setErrorVisible(isError);

    event.target.value = text;};
return (
  <div className='retoform2'>
    <div>
      <label htmlFor='clientes'>
        ¿Quiénes serán los usuarios? *
        <img src={adIcon} alt='' />
        <span>Para identificarlos mejor puedes ayudarte con las herramientas “Mapa de actores” o “Mapa de empatía”.</span>
      </label>
      <div className="input-container">
        <textarea
          id='clientes'
          placeholder='Identifica a los usuarios o clientes que se beneficiarán con esta solución...'
          {...register('clientes', {
            required: {
              value: isRequired ? true : false,
              message: isRequired ? 'El planteamiento de los usuarios es requerido' : '',
            },
            maxLength: {
              value: 500,
              message: 'El campo no puede sobrepasar los 50 caracteres',
            },
          })}
          onChange={handleTextareaChange}
          className={requiredFields.clientes ? 'error-border' : ''}
        ></textarea>
          <span className="char-count" style={{ color: maxLengthReached ? '#f66' : '#999' }}>
            <span style={{ fontSize: '12px' }}>{charCount}</span>
            <span style={{ fontSize: '12px' }}> / 500</span>
            <span style={{ fontSize: '12px' }}>{maxLengthReached && ' - El campo de caracteres ya es máximo'}</span>
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
  </div>
);
};


export { RetoForm2 };
