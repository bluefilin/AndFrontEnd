/* eslint-disable react/prop-types */

import './IdeasModal.css';
import { getStates } from '../../../../../services/estados.services';
import { getFocos } from '../../../../../services/focos.services';
import { dataDecrypt } from '../../../../../util/encrypt';
import { SendModal } from '../../SendModal/SendModal';
import FoxAmarillo from "../../../../../assets/img/savedFox.png";
import FoxVerde from '../../../../../assets/icons/GuardarFox2Verde.svg';
import Filtros from "../../../../../assets/icons/Filtros.svg";
import { useEffect, useState, useRef } from "react";
import { getIdeasById } from "../../../../../services/idea.services";
import { PageListIdeasModal } from "../PageListIdeasModal/PageListIdeasModal"   
import { getTiposInnovacion } from "../../../../../services/tiposInnovacion.services";
import { putUpdateCommittee } from '../../../../../services/committee.services';
import { IdeaServices } from '../../../../../services/idea.services';
import CommitteeIdeas from '../CommitteeIdeas';
const IdeasCommittee = ({ 
    commiteContent, 
    closeModal,
    //dataIdeas,
    //setDataIdeas,    
  
  }) => {	
  const [estados, setEstados] = useState([]);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [focos, setFocos] = useState([]);
  const [tiposInnovacion, setTiposInnovacion] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [arrayIds, setArrayIds] = useState([]);  
	const [saveDoneModal, setSaveDoneModal] = useState(false);
  const [saveConfirmatioModal, setSaveConfirmatioModal] = useState(false);
  const [misIdeas, setMisIdeas] = useState([]);  
  const [filter, setFilter] = useState("");  
  const [ideasFiltradas, setideasFiltradas] = useState([]);  
  
  const calendarRef = useRef(null);

  console.log(commiteContent.ideas)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const getIdeasId = async () => {
      const ideas = await IdeaServices();
      setMisIdeas(ideas);
    };
    const getEstados = async () => {
      const estados = await getStates("idea");
      setEstados(estados);
    }
    const getFocus = async () => {
      const focos = await getFocos();
      setFocos(focos);
    }
    const getTipoInnovacion = async () => {
      const tiposInnovacion = await getTiposInnovacion();
      setTiposInnovacion(tiposInnovacion);
    }
    getIdeasId();
    getEstados();
    getFocus();
    getTipoInnovacion();
  }, []);  

  const handleFilter = (e) => {
    const search = e.target.value.toLowerCase();
    setFilter(search);
  };

  useEffect(() => {
    const filteredIdeas = misIdeas.filter((idea) => {
      const lowerFilter = filter.toLowerCase();
      
      return (
        (idea?.autor?.nombres?.toLowerCase().includes(lowerFilter) ||
        idea?.autor?.apellidos?.toLowerCase().includes(lowerFilter) ||
        idea?.titulo?.toLowerCase().includes(lowerFilter) ||
        idea?.estado?.nombre?.toLowerCase().includes(lowerFilter)) &&
        idea?.estado?.nombre?.toLowerCase() === "idea validada"
      );
    });
    setFilteredIdeas(filteredIdeas);
  }, [filter, misIdeas]);
  

  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  const filterIdeasEstado = (event) => {
    let criterio = event.target.value;
    if (criterio != "todos") {
      const ideasFiltered = misIdeas.filter(
        (idea) => 
          idea.estado?.nombre == "Idea validada"
        );
        
      setFilteredIdeas(ideasFiltered);
    } else {
      setFilteredIdeas(misIdeas.estado.nombre == "Idea validada");
    }
  }   
  
  const handleConfirmSave = () => {
    setSaveConfirmatioModal(true)
  };
  const closeSaveModal = () => {
    setSaveConfirmatioModal(false);
  };

  console.log(commiteContent.ideas);
  console.log(selectedIdeas);

  const onSave = async () => {
    try {
      if (selectedIdeas.length > 0) {
        // Obtiene las ideas actuales del comité
        const currentIdeas = commiteContent.ideas;
        const ids = currentIdeas.map(idea => idea._id);
        console.log(ids);
        const updatedIdeas = [...ids, ...selectedIdeas];
  
        // Crea el objeto de datos con las ideas actualizadas
        const dataIdeas = {
          ideas: updatedIdeas
        };
        // Llama al servicio para asociar las ideas al comité
        await putUpdateCommittee(dataIdeas, commiteContent._id);
        console.log(dataIdeas);
        console.log('Ideas asociadas al comité exitosamente', dataIdeas);
  
        // Restablece el estado de las ideas seleccionadas
        setSelectedIdeas([]);
        setSaveDoneModal(true);
      } else {
        console.log('No hay ideas seleccionadas para agregar al comité');
      }
    } catch (error) {
      console.error('Error al asociar las ideas al comité:', error);
      // Puedes manejar el error según tus necesidades
    }


  };
  const ideasNoRepetidas = filteredIdeas.filter((idea) => 
      !commiteContent.ideas.some((commiteIdea) => commiteIdea._id === idea._id)
    );

	const reloadPage = () => {
    window.location.reload();
  };	  
  console.log(commiteContent);

	return (
		<>
			<div className='modalIdeas'>
				<div className='modalIdeasCommittee'>
					<span className='iconCloseIdeas' onClick={closeModal} >X</span>
					<h2 className='ideasComiteTitle'>
            Ideas guardadas
          </h2>
					<p className='ideasComiteSubtitle'>
            Estás ideas ya están validadas y listas para ser asignadas a un comité
          </p>

          
          <div class="contenedorListIdeas">
            <PageListIdeasModal
              ideasList={ideasNoRepetidas}
              selectedIdeas={selectedIdeas}
              setSelectedIdeas={setSelectedIdeas}
            /> 
          </div>													
          <div className='buttonEndIdeaComite'>
            <button className='btn10' onClick={closeModal}>No, cancelar</button>
            <button className='btn11' onClick={handleConfirmSave} >Sí, agregar</button>
          </div>
          <section>
            {saveConfirmatioModal && (
              <SendModal
                titulo={'¿Guardar cambios?'}
                img={FoxAmarillo}
                paragraf={'Si guardas los cambios, puedes continuar editando en otro momento'}
                btn1={'No, cancelar'}
                btn2={'Sí, guardar'}
                fnct1={closeSaveModal}
                fnct2={onSave}
              />
            )}
            {saveDoneModal && (
              <SendModal
                titulo={"¡Se han agregado las ideas!"}
                img={FoxVerde}
                paragraf={"Se han agregado las ideas seleccionadas, continúa agendando el comité"}
                btn2={"¡Listo!"}
                fnct2={reloadPage}
              />
            )}
          </section>
					</div>
				</div>			          
		</>
	);
};
export { IdeasCommittee };