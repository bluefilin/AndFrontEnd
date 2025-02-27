import { useState, useEffect } from 'react';
import './RetosParam.css';
import { putUpdateReto } from '../../../services/reto.services';
import { getNextStages, postNewStage } from '../../../services/reto.services';
import trueUncheck from '../../../assets/icons/trueUncheck.svg';
import trueCheck from '../../../assets/icons/trueCheck.svg';
import falseUncheck from '../../../assets/icons/falseUncheck.svg';
import falseCheck from '../../../assets/icons/falseCheck.svg';
import { ModalReto } from '../ModalReto';
import { modalsInfo } from '../retoUtil.util';
import noApplyTrue from '../../../assets/icons/noApplyTrue.svg';
import noApplyFalse from '../../../assets/icons/noApplyFalse.svg';
import { useNavigate } from 'react-router-dom';
import { ThrowChallenge } from '../ThrowChallenge/ThrowChallenge';

const RetosParam = ({ stages, reto, focus, innovationTypes }) => {
  const [infoModal, setInfoModal] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [youMust, setYouMust] = useState(false)
  const [validationComplete, setValidationComplete] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    estado: reto?.estado?.nombre || '',
    tipo_innovacion: reto?.tipo_innovacion?.nombre || '',
    tipo_innovacion_id: reto?.tipo_innovacion?._id || '',
    foco: reto?.foco?.nombre || '',
    foco_id: reto?.foco?._id || '',
    validation: {
      estrategia: reto?.validacion[0]?.valor || '',
      cliente: reto?.validacion[1]?.valor || '',
      marca: reto?.validacion[2]?.valor || '',
      ventaja: reto?.validacion[3]?.valor || '',
      capacidad: reto?.validacion[4]?.valor || '',
    },
  });

  const navigate = useNavigate();
  const handleOptionChange = (type, value) => {
    if (type === 'focoType') {
      const selectedFoco = focus.find((f) => f._id === value);
      setSelectedOptions((prevData) => ({
        ...prevData,
        foco_id: value,
        foco: selectedFoco ? selectedFoco.nombre : '',
      }));
    } else if (type === 'innovationType') {
      const selectedInnovationType = innovationTypes.find((i) => i._id === value);
      setSelectedOptions((prevData) => ({
        ...prevData,
        tipo_innovacion_id: value,
        tipo_innovacion: selectedInnovationType ? selectedInnovationType.nombre : '',
      }));
    } else if (type === 'stage') {
      setSelectedOptions((prevNextState) => ({
        ...prevNextState,
        estado: value,
      }))
    }
  };
const handleRadioChange = (category, name, value) => {
  setSelectedOptions((prevSelectedOptions) => ({
    ...prevSelectedOptions,
    [category]: {
      ...prevSelectedOptions[category],
      [name]: value,
    },
  }));


};

  const handleSubmit = async () => {
    const idReto = reto._id;
    const validacion = [];
    if (selectedOptions.validation.estrategia) {
      validacion.push({
        nombre: 'Estrategia',
        valor: selectedOptions.validation.estrategia,
      });
    }

    if (selectedOptions.validation.cliente) {
      validacion.push({
        nombre: 'Cliente',
        valor: selectedOptions.validation.cliente,
      });
    }

    if (selectedOptions.validation.marca) {
      validacion.push({
        nombre: 'Marca',
        valor: selectedOptions.validation.marca,
      });
    }
    if (selectedOptions.validation.ventaja) {
      validacion.push({
        nombre: 'Ventajas',
        valor: selectedOptions.validation.ventaja,
      });
    }
    if (selectedOptions.validation.capacidad) {
      validacion.push({
        nombre: 'Capacidad',
        valor: selectedOptions.validation.capacidad,
      });
    }
    const data = {
      foco: reto?.foco?.nombre ? reto.foco._id : selectedOptions.foco_id,
      tipo_innovacion: reto?.tipo_innovacion?.nombre ? reto?.tipo_innovacion._id : selectedOptions.tipo_innovacion_id,
      validacion: validacion,
    }
    const nextState = {
      reto: idReto,
      estado: selectedOptions.estado,
    }
    const resUpdate = await putUpdateReto(data, idReto)

    const resNextState = await postNewStage(nextState)

  };

  const isFormValid = () => {
    // Campos requeridos para los radio buttons
    const requiredRadioFields = ['estrategia', 'cliente', 'marca', 'ventaja', 'capacidad'];
  
    // Campos requeridos para los select
    const requiredSelectFields = ['foco_id', 'tipo_innovacion_id'];
  
    // Verificar radio buttons
    const isRadioValid = requiredRadioFields.every(field => selectedOptions.validation[field]);
  
    // Verificar select options
    const isSelectValid = requiredSelectFields.every(field => selectedOptions[field]);
  
    // Devolver true si ambos son válidos
    if(isRadioValid && isSelectValid){
      setYouMust(false)
      return isRadioValid && isSelectValid;
    }
    
  };

  const saveChangesModal = (num) => {
    setInfoModal(num);
    setOpenModal(true);
  }
  const saveChanges = () => {
    // handleSubmit();
    // setOpenModal(true);
    // navigate("/lista_retos_usuarios");
    if(!isFormValid()){
      setOpenModal(false);
      setYouMust(true)
    }else{
    handleSubmit()
    .then(() => {
      setOpenModal(false);
      window.location.reload();
    })
    .catch(error => {
      console.log(error)
    });
    }
  }
  const sendFeedbackModal = (num) => {
    setInfoModal(num);
    setOpenModal(true);
  }
  const sendFeedback = () => {
    handleSubmit();
    setOpenModal(true);
    navigate("/lista_retos_usuarios");
  }
  const validateRetoModal = (num) => {
    setInfoModal(num);
    setOpenModal(true);
  }
  const validateReto = () => {
    handleSubmit()
      .then(() => {
        setOpenModal(false);
        window.location.reload();
      })
      .catch(error => {
        console.log(error)
      });
  }
  const launchChallengeModal = () => {
    setModalVisible(true);
  }
  const launchChallenge = () => {
    if(!isFormValid()){
      setModalVisible(false);
      setYouMust(true)
    }else{
    handleSubmit()
    .then(() => {
      setModalVisible(false)
      window.location.reload();
    })
    .catch(error => {
      console.log(error)
    });
    }

  }
  const ChallengeWithoutModal = (num) => {
    setInfoModal(num);
    setOpenModal(true);
  }
  const ChallengeWithout = () => {
    handleSubmit();
    setOpenModal(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }


  return (
    <div className="retosparam">
      {openModal ? (
        <ModalReto
          title={modalsInfo[infoModal].title}
          paragraph={modalsInfo[infoModal].paragraph}
          btn1={modalsInfo[infoModal].btn1}
          btn2={modalsInfo[infoModal].btn2}
          open={openModal}
          onClose={() => setOpenModal(false)}
          saveChanges={saveChanges}
          sendFeedback={sendFeedback}
          validateReto={validateReto}
          launchChallenge={launchChallenge}
          ChallengeWithout={ChallengeWithout}
        />
      ) : ""}

      <form>
        <div className="validateCriterion">
          <h3>Criterios de  validación</h3>
          <div>
            <p>Alineamiento Estratégico</p>
            <label htmlFor="estrategiaTrue">
              <input
                type="radio"
                id="estrategiaTrue"
                name="estrategia"
                value="true"
                onChange={() => handleRadioChange('validation', 'estrategia', "Cumple")}
              />
              <img
                src={selectedOptions.validation.estrategia === "Cumple" ? trueCheck : trueUncheck}
                alt="Alineamiento Estratégico - Verdadero"
              />
            </label>
            <label htmlFor="estrategiaFalse">
              <input
                type="radio"
                id="estrategiaFalse"
                name="estrategia"
                value="false"
                onChange={() => handleRadioChange('validation', 'estrategia', "No cumple")}
              />
              <img
                src={selectedOptions.validation.estrategia === "No cumple" ? falseCheck : falseUncheck}
                alt="Alineamiento Estratégico - Falso"
              />
            </label>
            <label htmlFor="estrategianoApply">
              <input
                type="radio"
                id="estrategianoApply"
                name="estrategia"
                value="noApply"
                onChange={() => handleRadioChange('validation', 'estrategia', "No aplica")}
              />
              <img
                src={selectedOptions.validation.estrategia === "No aplica" ? noApplyTrue : noApplyFalse}
                alt="Alineamiento Estratégico - Falso"
              />
            </label>
          </div>
          <div>
            <p>Necesidad del cliente</p>
            <label htmlFor="clienteTrue">
              <input
                type="radio"
                id="clienteTrue"
                name="cliente"
                value="true"
                onChange={() => handleRadioChange('validation', 'cliente', "Cumple")}
              />
              <img
                src={selectedOptions.validation.cliente === "Cumple" ? trueCheck : trueUncheck}
                alt="Necesidad del cliente - Verdadero"
              />
            </label>
            <label htmlFor="clienteFalse">
              <input
                type="radio"
                id="clienteFalse"
                name="cliente"
                value="false"
                onChange={() => handleRadioChange('validation', 'cliente', "No cumple")}
              />
              <img
                src={selectedOptions.validation.cliente === "No cumple" ? falseCheck : falseUncheck}
                alt="Necesidad del cliente - Falso"
              />
            </label>
            <label htmlFor="clienteApply">
              <input
                type="radio"
                id="clienteApply"
                name="cliente"
                value="noApply"
                onChange={() => handleRadioChange('validation', 'cliente', "No aplica")}
              />
              <img
                src={selectedOptions.validation.cliente === "No aplica" ? noApplyTrue : noApplyFalse}
                alt="Alineamiento Estratégico - Falso"
              />
            </label>
          </div>
          <div>
            <p>Marca</p>
            <label htmlFor="marcaTrue">
              <input
                type="radio"
                id="marcaTrue"
                name="marca"
                value="true"
                onChange={() => handleRadioChange('validation', 'marca', "Cumple")}
              />
              <img
                src={selectedOptions.validation.marca === "Cumple" ? trueCheck : trueUncheck}
                alt="Marca - Verdadero"
              />
            </label>
            <label htmlFor="marcaFalse">
              <input
                type="radio"
                id="marcaFalse"
                name="marca"
                value="false"
                onChange={() => handleRadioChange('validation', 'marca', "No cumple")}
              />
              <img
                src={selectedOptions.validation.marca === "No cumple" ? falseCheck : falseUncheck}
                alt="Marca - Falso"
              />
            </label>
            <label htmlFor="marcaApply">
              <input
                type="radio"
                id="marcaApply"
                name="marca"
                value="noApply"
                onChange={() => handleRadioChange('validation', 'marca', "No aplica")}
              />
              <img
                src={selectedOptions.validation.marca === "No aplica" ? noApplyTrue : noApplyFalse}
                alt="Alineamiento Estratégico - Falso"
              />
            </label>
          </div>
          <div>
            <p>Ventaja competitiva</p>
            <label htmlFor="ventajaTrue">
              <input
                type="radio"
                id="ventajaTrue"
                name="ventaja"
                value="true"
                onChange={() => handleRadioChange('validation', 'ventaja', "Cumple")}
              />
              <img
                src={selectedOptions.validation.ventaja === "Cumple" ? trueCheck : trueUncheck}
                alt="Ventaja competitiva - Verdadero"
              />
            </label>
            <label htmlFor="ventajaFalse">
              <input
                type="radio"
                id="ventajaFalse"
                name="ventaja"
                value="false"
                onChange={() => handleRadioChange('validation', 'ventaja', "No cumple")}
              />
              <img
                src={selectedOptions.validation.ventaja === "No cumple" ? falseCheck : falseUncheck}
                alt="Ventaja competitiva - Falso"
              />
            </label>
            <label htmlFor="ventajaApply">
              <input
                type="radio"
                id="ventajaApply"
                name="ventaja"
                value="noApply"
                onChange={() => handleRadioChange('validation', 'ventaja', "No aplica")}
              />
              <img
                src={selectedOptions.validation.ventaja === "No aplica" ? noApplyTrue : noApplyFalse}
                alt="Alineamiento Estratégico - Falso"
              />
            </label>
          </div>
          <div>
            <p>Capacidades</p>
            <label htmlFor="capacidadTrue">
              <input
                type="radio"
                id="capacidadTrue"
                name="capacidad"
                value="true"
                onChange={() => handleRadioChange('validation', 'capacidad', "Cumple")}
              />
              <img
                src={selectedOptions.validation.capacidad === "Cumple" ? trueCheck : trueUncheck}
                alt="Ventaja competitiva - Verdadero"
              />
            </label>
            <label htmlFor="capacidadFalse">
              <input
                type="radio"
                id="capacidadFalse"
                name="capacidad"
                value="false"
                onChange={() => handleRadioChange('validation', 'capacidad', "No cumple")}
              />
              <img
                src={selectedOptions.validation.capacidad === "No cumple" ? falseCheck : falseUncheck}
                alt="Ventaja competitiva - Falso"
              />
            </label>
            <label htmlFor="capacidadApply">
              <input
                type="radio"
                id="capacidadApply"
                name="capacidad"
                value="noApply"
                onChange={() => handleRadioChange('validation', 'capacidad', "No aplica")}
              />
              <img
                src={selectedOptions.validation.capacidad === "No aplica" ? noApplyTrue : noApplyFalse}
                alt="Alineamiento Estratégico - Falso"
              />
            </label>
          </div>
        </div>
        <div className="asignCriterion">
          <h3>Clasificación</h3>
          <select
            name=""
            id=""
            value={selectedOptions.foco_id || ''}
            onChange={(e) => handleOptionChange('focoType', e.target.value)}
          >
            <option style={{ display: "none" }}>
              {selectedOptions.foco || 'Focos'}
            </option>
            {focus.map((focus, index) => (
              <option key={index} value={focus._id}>
                {focus.nombre}
              </option>
            ))}
          </select>

          <select
            name=""
            id=""
            value={selectedOptions.tipo_innovacion_id || ''}
            onChange={(e) => handleOptionChange('innovationType', e.target.value)}
          >
            <option style={{ display: "none" }}>
              {selectedOptions.tipo_innovacion || 'Tipo de innovación'}
            </option>
            {innovationTypes.map((innova, index) => (
              <option key={index} value={innova._id}>
                {innova.nombre}
              </option>
            ))}
          </select>

          <select
            name=""
            id=""
            value={selectedOptions.estado || ''}
            onChange={(e) => handleOptionChange('stage', e.target.value)}
          >
            <option value="">{reto?.estado?.nombre}</option>
            {stages.map((stage, index) => (
              <option key={index} value={stage.id_estado}>
                {stage.nombre}
              </option>
            ))}
          </select>
          {youMust && (
          <p className="youMust">Debes diligenciar los criterios de validación y la clasificación</p>
        )}
        </div>
        {selectedOptions.estado === "17" ? (
          <button type="button" onClick={() => validateRetoModal(2)}>Validar</button>
        ) : ""}
        {selectedOptions.estado === "18" ? (
          <button type="button" onClick={() => sendFeedbackModal(1)}>Enviar a Ajustes</button>
        ) : ""}
        {selectedOptions.estado === "19" ? (
          <button type="button" onClick={() => saveChangesModal(0)}>Guardar cambios</button>
        ) : ""}

        <>
          {selectedOptions.estado === "22" ? (
            <button type="button" onClick={launchChallengeModal}>
              Lanzar reto
            </button>
          ) : (
            ""
          )}

          {modalVisible && (
            <ThrowChallenge
              onClose={() => setModalVisible(false)}
              reto={reto}
              launchChallenge={launchChallenge}
              youMust={youMust}
            />
          )}
        </>
        {selectedOptions.estado === "23" ? (
          <button type="button" onClick={() => ChallengeWithoutModal(4)}>Sin lanzar</button>
        ) : ""}
      </form>
    </div>
  );
};

export { RetosParam };