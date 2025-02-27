import "./reto.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { getUnitReto } from "../../services/reto.services";
import { getNextStages } from "../../services/reto.services";
// import { getRetoConfig } from "../../services/reto.services";
import { getTiposInnovacion } from "../../services/tiposInnovacion.services";
import { getFocos } from "../../services/focos.services";
import { ShowRetos } from "../../components/RetoComponent/ShowRetos/ShowRetos";
import { RetosParam } from "../../components/RetoComponent/RetosParam/RetosParam";
import { dataDecrypt } from "../../util/encrypt";


const Reto = () => {
  const { idReto } = useParams(); 
  const [reto, setReto] = useState("");
  const [stages, setStages] = useState([]);
  // const [retoConfig, setRetoConfig] = useState([]);
  const [focus, setFocus] = useState([])
  const [innovationTypes, setInnovationTypes] = useState([])
  const retosArray = JSON.parse(sessionStorage.getItem('idsArray')) || [];
  const currentIndex = retosArray.indexOf(idReto);
  const history = useNavigate();

  const user = dataDecrypt(sessionStorage.getItem('user'))
  useEffect(() => {
    const fetchReto = async () => {
      const retoData = await getUnitReto(idReto);
      setReto(retoData);
    };
    fetchReto();

    const fetchStages = async () =>{
      const nextStages = await getNextStages(idReto);
      setStages(nextStages)
    }
    fetchStages();

    const fetchFocus = async ()=>{
      const resFocus = await getFocos()
      setFocus(resFocus)
    }
    fetchFocus();

    const fetchInnovatypes = async ()=>{
      const resInnovaTypes = await getTiposInnovacion()
      setInnovationTypes(resInnovaTypes)
    }
    fetchInnovatypes();

    /* const fetchRetoConfig = async () => {
      const retoallConfig = await getRetoConfig()
      setRetoConfig(retoallConfig)
    }
    fetchRetoConfig() */

  }, [idReto]);
  
  const handlePreviousClick = () => {
    if (currentIndex > 0) {
      const previousRetoId = retosArray[currentIndex - 1];
      history(`/reto/${previousRetoId}`); 
    }
  };

  const handleNextClick = () => {
    if (currentIndex < retosArray.length - 1) {
      const nextRetoId = retosArray[currentIndex + 1];
      history(`/reto/${nextRetoId}`); 
    }
  };
  
  if (!reto) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <div className="retoContent">
        <ShowRetos 
          reto={reto}
          onPreviousClick={handlePreviousClick}
          onNextClick={handleNextClick}

        />
        {user.grupo === "innovacion" ? (
          <RetosParam
          reto={reto}
            stages={stages}
            focus={focus}
            innovationTypes={innovationTypes}
          />
        ):""}
        
      </div>
    </div>
  );
};
export { Reto };
