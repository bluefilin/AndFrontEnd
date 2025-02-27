import "./Idea.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { getUnitIdea } from "../../services/idea.services";
import { getNextStages } from "../../services/estados.services";
// import { getIdeaConfig } from "../../services/idea.services";
import { getTiposInnovacion } from "../../services/tiposInnovacion.services";
import { getFocos } from "../../services/focos.services";
import { ShowIdeas } from "../../components/IdeaComponent/ShowIdeas/ShowIdeas";
import { IdeasParam } from "../../components/IdeaComponent/IdeasParam/IdeasParam";
import { dataDecrypt } from "../../util/encrypt";


const Idea = () => {
  const { idIdea } = useParams(); 
  const [idea, setIdea] = useState("");
  const [stages, setStages] = useState([]);
  // const [ideaConfig, setIdeaConfig] = useState([]);
  const [focus, setFocus] = useState([])
  const [innovationTypes, setInnovationTypes] = useState([])
  const ideasArray = JSON.parse(sessionStorage.getItem('idsArray')) || [];
  const currentIndex = ideasArray.indexOf(idIdea);
  const history = useNavigate();

  const user = dataDecrypt(sessionStorage.getItem('user'))
  useEffect(() => {
    const fetchIdea = async () => {
      const ideaData = await getUnitIdea(idIdea);
      setIdea(ideaData);
    };
    fetchIdea();

    const fetchStages = async () =>{
      const nextStages = await getNextStages(idIdea);
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

    /* const fetchIdeaConfig = async () => {
      const ideaallConfig = await getIdeaConfig()
      setIdeaConfig(ideaallConfig)
    }
    fetchIdeaConfig() */

  }, [idIdea]);
  
  const handlePreviousClick = () => {
    if (currentIndex > 0) {
      const previousIdeaId = ideasArray[currentIndex - 1];
      history(`/idea/${previousIdeaId}`); 
    }
  };

  const handleNextClick = () => {
    if (currentIndex < ideasArray.length - 1) {
      const nextIdeaId = ideasArray[currentIndex + 1];
      history(`/idea/${nextIdeaId}`); 
    }
  };
  
  if (!idea) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <div className="ideaContent">
        <ShowIdeas 
          idea={idea}
          onPreviousClick={handlePreviousClick}
          onNextClick={handleNextClick}

        />
        {user.grupo === "innovacion" ? (
          <IdeasParam
            idea={idea}
            stages={stages}
            focus={focus}
            innovationTypes={innovationTypes}
          />
        ):""}
        
      </div>
    </div>
  );
};

export { Idea };
