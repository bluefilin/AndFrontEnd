import { useState, useEffect } from 'react';
import './IdeasParam.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreateCommittee } from '../../CommitteeComponents/CreateCommittee';
import { putUpdateIdea } from '../../../services/idea.services';
import { getNextStages, postNewStage } from '../../../services/estados.services';
import { getCommitteeList } from '../../../services/committee.services';
import { getCommitteeType } from '../../../services/committee.services';
import { putIdeaToCommittee } from '../../../services/committee.services';
import trueUncheck from '../../../assets/icons/trueUncheck.svg';
import trueCheck from '../../../assets/icons/trueCheck.svg';
import falseUncheck from '../../../assets/icons/falseUncheck.svg';
import falseCheck from '../../../assets/icons/falseCheck.svg';
import { ModalIdea } from '../ModalIdea';
import { modalsInfo } from '../ideaUtil.util';
import noApplyTrue from '../../../assets/icons/noApplyTrue.svg';
import noApplyFalse from '../../../assets/icons/noApplyFalse.svg';
import { useNavigate } from 'react-router-dom';

const IdeasParam = ({ stages, idea, focus, innovationTypes }) => {
  const [committeeOpportunity, setCommitteeOpportunity] = useState([])
  const [committeeProject, setCommitteeProject] = useState([])
  const [infoModal, setInfoModal] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [getIdCommittee, setGetIdCommittee] = useState("");
  /* Cargar los valores del formualrio */
  const [selectedOptions, setSelectedOptions] = useState({
    estado: idea?.estado?.nombre || '',
    tipo_innovacion: idea?.tipo_innovacion?.nombre || '',
    tipo_innovacion_id: idea?.tipo_innovacion?._id || '',
    foco: idea?.foco?.nombre || '',
    foco_id: idea?.foco?._id || '',
    committee: '',
    validation: {
      estrategia: idea?.validacion[0]?.valor || '',
      cliente: idea?.validacion[1]?.valor || '',
      marca: idea?.validacion[2]?.valor || '',
      ventaja: idea?.validacion[3]?.valor || '',
      capacidad: idea?.validacion[4]?.valor || '',
    },
  });
  /* se necesita editar, que solo funcione para estados y comite */
  const [isOpen, setIsOpen] = useState({
    stage: false,
    innovationType: false,
    focoType: false,
    committee:false,
  });
  /* llama el Listado de los comites */
  const [openCreateCommittee, setOpenCreateCommittee] = useState(false);
  const [youMust, setYouMust] = useState(false)

  useEffect(() => {
    const getCommitteeOpportunity = async()=>{
      const resOpportunity = await getCommitteeType("Comité Creado", "Comité Oportunidad");
      setCommitteeOpportunity(resOpportunity)
    }
    // Tener cuidado si cambian alguno de los strings
    const getCommitteeProject = async()=>{
      const resProject = await getCommitteeType("Comité Creado", "Comité Proyecto");
      setCommitteeProject(resProject)
    }
    getCommitteeOpportunity()
    getCommitteeProject()
  }, [])

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
  }};

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

  const handleRadioChange = (category, name, value) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [category]: {
        ...prevSelectedOptions[category],
        [name]: value,
      },
    }));
  }; 
  const toggleOptions = (type) => {
    setIsOpen((prevIsOpen) => ({
      ...prevIsOpen,
      [type]: !prevIsOpen[type]
    }));
  };
  const handleOpenModal = (committee, num) =>{
    setInfoModal(num);
    setOpenModal(true);
    setGetIdCommittee(committee);
  } 
  const addToCommittee = async()=>{
    const committeId = getIdCommittee._id;
    const idIdea = {
      idea:idea._id,
      estadoIdea:selectedOptions.estado
    }
    await putIdeaToCommittee(committeId, idIdea)
    const resStates =await getNextStages(idea._id)
    setOpenModal(false);
    window.location.reload()
  }
  const handleSubmit = async () => {
    const idIdea = idea._id;
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
    const data ={
      foco:idea?.foco?.nombre ? idea.foco._id : selectedOptions.foco_id,
      tipo_innovacion:idea?.tipo_innovacion?.nombre ? idea?.tipo_innovacion._id : selectedOptions.tipo_innovacion_id,
      validacion:validacion,
    }
    const nextState = {
      idea:idIdea,
      estado: selectedOptions.estado,
    }
    const resUpdate = await putUpdateIdea(data, idIdea)
    const resNextState = await postNewStage(nextState)

    // Aquí puedes manejar los datos del formulario, incluidos los valores seleccionados
  };
  const handleOpenCommittee = ()=>{
    setOpenCreateCommittee(true);
  }
  // abre el modal de confirmación
  const closeModal = ()=> {
    setOpenCreateCommittee(false)
  }
  // cerrar la modal
  const closeModalReload = ()=>{
    setOpenCreateCommittee(false)
    window.location.reload()
  }
  // cerrar modal y recatrgar la pagina
  const openSubmitModal =(num)=>{
    setInfoModal(num);
    setOpenModal(true);
  }
  // abrir modales de confirmacion
  const saveChanges =()=>{
    handleSubmit();
    setOpenModal(true);
    window.location.reload();
  }
  
  const sendFeedback =()=>{
    handleSubmit();
    setOpenModal(true);
    navigate("/lista_ideas_usuarios");
  }
  
  const validateIdea =()=>{
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
  return (
    <div className="ideasparam">
      {openModal ? (
        <ModalIdea
          title={modalsInfo[infoModal].title}
          paragraph={modalsInfo[infoModal].paragraph}
          btn1={modalsInfo[infoModal].btn1}
          btn2={modalsInfo[infoModal].btn2}
          open={openModal}
          onClose={()=> setOpenModal(false)}
          addToCommittee={addToCommittee}
          getIdCommittee={getIdCommittee}
          saveChanges={saveChanges}
          sendFeedback={sendFeedback}
          validateIdea={validateIdea}
        />
      ):""}
      
      {openCreateCommittee && 
      <div className='modal'>
        <div className='modalCreateCommittee'>
        <span className='iconClose' onClick={closeModal} >X</span>
        <CreateCommittee
          closeModal={closeModal}
          closeModalReload={closeModalReload}
        />
        </div>
        </div>
      }
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
      {/* Clasificación */}
        <div className="asignCriterion">
          <h3>Clasificación</h3>
          <select
            name=""
            id=""
            value={selectedOptions.foco_id || ''}
            onChange={(e) => handleOptionChange('focoType', e.target.value)}
          >
            <option style={{display:"none"}}>
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
            value={ selectedOptions.tipo_innovacion_id || ''}
            onChange={(e) => handleOptionChange('innovationType', e.target.value)}
          >
            <option style={{display:"none"}}>
              { selectedOptions.tipo_innovacion ||  'Tipo de innovación'}
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
            <option value="">{idea?.estado?.nombre  }</option>
            {stages?.map((stage, index) => (
              <option key={index} value={stage?.id_estado}>
                {stage?.nombre}
              </option>
            ))}
          </select>
        </div>
        
        {youMust && (
          <p className="youMust">Debes diligenciar los criterios de validación y la clasificación</p>
        )}

        {selectedOptions.estado  === "5" ? (
          <div className={`custom-select ${isOpen.committee ? 'open' : ''}`}>
            <div className="select-header" onClick={() => toggleOptions('committee')}>
              {selectedOptions.committee
                ? ''
                : 'Comité'}
            </div>
            {isOpen.committee && (
              <ul className="custom-options">
                {committeeOpportunity.map((committee) => (
                  <li
                    key={committee._id}
                    //className={`option ${foco[0] === selectedOptions.focoType ? 'selected' : ''}`}
                    onClick={() => handleOpenModal(committee, 0)}
                  >
                    <p>Comité del {format(new Date(committee?.fechaInicio), 'dd/MM/yy', { locale: es })}</p>
                    
                  </li>
                ))}
                <li>
                  <div onClick={handleOpenCommittee}>
                    <p>Crear comité</p>
                    <span> </span>
                  </div>
                </li>
              </ul>
            )}
          </div>
        ): ("")}
         {selectedOptions.estado  === "8" ? (
            <div className={`custom-select ${isOpen.committee ? 'open' : ''}`}>
            <div className="select-header" onClick={() => toggleOptions('committee')}>
              {selectedOptions.committee
                ? ''
                : 'Comité'}
            </div>
            {isOpen.committee && (
              <ul className="custom-options">
                {committeeProject.map((committee) => (
                  <li
                    key={committee._id}
                    //className={`option ${foco[0] === selectedOptions.focoType ? 'selected' : ''}`}
                    onClick={() => handleOpenModal(committee, 0)}
                  >
                    <p>Comité del {format(new Date(committee?.fechaInicio), 'dd/MM/yy', { locale: es })}</p>
                    
                  </li>
                ))}
                <li>
                  <div onClick={handleOpenCommittee}>
                    <p>Crear comité</p>
                    <span> </span>
                  </div>
                </li>
              </ul>
            )}
          </div>
        ):""}
        {selectedOptions.estado  === "1" ? (
          <button type="button" onClick={()=>openSubmitModal(2)}>Enviar a Ajustes</button>
        ):""}
        {selectedOptions.estado  === "3" ? (
          <button type="button" onClick={()=>openSubmitModal(1)}>Guardar cambios</button>
        ):""}
        {selectedOptions.estado  === "4" ? (
          <button type="button" onClick={()=>openSubmitModal(3)}>Validar</button>
        ):""}
        {selectedOptions.estado  === "7" ? (
          <button type="button" onClick={()=>openSubmitModal(4)}>Crear caso de negocio</button>
        ):""}
        {idea && idea.estado.id_estado === "3" && selectedOptions.estado  === "" ? (
          <button type="button" onClick={()=>openSubmitModal(1)}>Guardar cambios</button>
        ):""}
       {selectedOptions.estado  === "10" ? (
          <button type="button" onClick={()=>openSubmitModal(5)}>Convertir a Desarrollo</button>
        ):""}
        {selectedOptions.estado  === "9" ? (
          <button type="button" onClick={()=>openSubmitModal(6)}>Enviar a Ajustes</button>
        ):""}
      </form>
    </div>
  );
};

export { IdeasParam };