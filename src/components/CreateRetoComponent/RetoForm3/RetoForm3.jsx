import React, { useState } from 'react';
import './RetoForm3.css';
import adIcon from '../../../assets/icons/adIcon.svg';
import redWarning from "../../../assets/icons/redWarning.svg"
const RetoForm3 = ({ register, errors, isRequired, requiredFields }) => {

  const [charCountbeneU, setCharCountbeneU] = useState(0);
  const [maxLengthReachedbeneU, setMaxLengthReachedbeneU] = useState(false);
  const [charCountbeneC, setCharCountbeneC] = useState(0);
  const [maxLengthReachedbeneC, setMaxLengthReachedbeneC] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

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
    <div className='retoform3'>
      <div>
        <label htmlFor='beneU'>
          ¿Cuáles serán los beneficios para los usuarios *
          <img src={adIcon} alt='' />
          <span>La herramienta “Mapa de impacto” te puede ayudar a definirlos mejor.</span>
        </label>
        <div className="input-container">
          <textarea
            id='beneU'
            placeholder='Cuéntanos cómo la solución a este reto ayudará a los usuarios o clientes...'
            {...register('beneficioU', {
              required: {
                value: isRequired ? true : false,
                message: isRequired ? 'Los beneficios de los usuarios son requeridos' : '',
              },
              maxLength: {
                value: 500,
                message: 'El campo no puede sobrepasar los 50 caracteres',
              },
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
        <label htmlFor='beneC'>
          ¿Cuáles son los beneficios para Grupo ASD? *
          <img src={adIcon} alt='' />
          <span>La herramienta “Mapa de impacto” te puede ayudar a definirlos mejor.</span>
        </label>
        <div className="input-container">
          <textarea
            id='beneC'
            placeholder='Cuéntanos cómo solucionar este reto beneficiara a nuestra organización...'
            {...register('beneficioC', {
              required: {
                value: isRequired ? true : false,
                message: isRequired ? 'Los beneficios de la compañía son requeridos' : '',
              },
              maxLength: {
                value: 500,
                message: 'El campo no puede sobrepasar los 50 caracteres',
              },
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

export { RetoForm3 };


