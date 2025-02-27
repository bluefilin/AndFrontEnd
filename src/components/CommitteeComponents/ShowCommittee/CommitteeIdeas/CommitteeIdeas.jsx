import React, { useState, useEffect } from "react";
import "./CommitteeIdeas.css";
import defaultPhoto from "../../../../assets/img/defaultPhoto.jpg";
import editcommiteA from "../../../../assets/icons/editA.svg";
import editcommite from "../../../../assets/icons/edit.svg";
import { getUserAvatarUrl } from "../../../../services/users.services";
import agregarIdea from "../../../../assets/icons/AgregarIdeaComite.svg";
import removeIdea from "../../../../assets/icons/RemoveIdeaComite.svg";
import { IdeasCommittee } from "../CommitteeIdeas/IdeasModal/IdeasModal";
import { SendModal } from "../SendModal/SendModal";
import FoxAmarillo from "../../../../assets/img/savedFox.png";
import { putUpdateCommittee } from "../../../../services/committee.services";

const CommitteeIdeas = ({
  commiteContent,
  showSendSave,
  toogleIdeas,
  isIdeasIcon,
  selectedIdeas,
  setSelectedIdeas,
}) => {
  const [IdeaAvatarUrls, setIdeasAvatarUrls] = useState([]);
  const [ideasSelect, setIdeasSelect] = useState([]);
  const [isEditModeIdeas, setIsEditModeIdeas] = useState(false);
  const [isCheckedAllIdeas, setIsCheckedAllIdeas] = useState(false);
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  const [isAgregarIdeaVisible, setIsAgregarIdeaVisible] = useState(false);
  const [isRemoveIdeaVisible, setIsRemoveIdeaVisible] = useState(false);
  const [openIdeasCommittee, setOpenIdeasCommittee] = useState(false);

  const [saveConfirmatioModal, setSaveConfirmatioModal] = useState(false);

  const handleEditClickIdeas = () => {
    setIsEditModeIdeas((prevEditModeIdeas) => !prevEditModeIdeas);
    setIsCheckboxVisible(true);
    setIsAgregarIdeaVisible(true);
    setIsRemoveIdeaVisible(true);
  };

  useEffect(() => {
    const loadAvatarUrls = async () => {
      const IdeaUrls = await Promise.all(
        commiteContent.ideas.map(async (idea) => {
          if (idea.autor.foto !== "" && idea.autor.foto !== undefined) {
            return await getUserAvatarUrl(idea.autor.foto);
          } else {
            return null;
          }
        })
      );
      setIdeasAvatarUrls(IdeaUrls);
    };
    loadAvatarUrls();
  }, [commiteContent]);

  const handleCheckIdea = (index) => {
    const updatedCheckboxes = [...ideaCheckboxes];
    updatedCheckboxes[index] = !updatedCheckboxes[index];
    setIdeaCheckboxes(updatedCheckboxes);

    const idea = commiteContent.ideas[index];

    console.log("ID de la idea seleccionada:", idea);
    const updatedSelectedIdeas = [...selectedIdeas];

    if (updatedCheckboxes[index]) {
      updatedSelectedIdeas.push(idea);
    } else {
      const ideaIndex = updatedSelectedIdeas.findIndex(
        (selectedIdea) => selectedIdea.id === idea.id
      );
      if (ideaIndex !== -1) {
        updatedSelectedIdeas.splice(ideaIndex, 1);
      }
    }

    setSelectedIdeas(updatedSelectedIdeas);
    const selectedIdeasIds = updatedSelectedIdeas.map(
      (selectedIdea) => selectedIdea._id
    );
    console.log("IDs de las ideas seleccionadas:", selectedIdeasIds);
    setIdeasSelect(selectedIdeasIds);
  };

  const [ideaCheckboxes, setIdeaCheckboxes] = useState(
    new Array(commiteContent?.ideas?.length).fill(false)
  );

  const onRemove = async () => {
    try {
      if (ideasSelect.length > 0) {
        const currentIdeas = commiteContent.ideas;
        const updatedIdeas = currentIdeas.filter(
          (idea) => !ideasSelect.includes(idea._id)
        );
        const dataIdeas = {
          ideas: updatedIdeas,
        };
        await putUpdateCommittee(dataIdeas, commiteContent._id);
        setSelectedIdeas([]);
        reloadPage(true);
      } else {
        console.log("No hay ideas seleccionadas para eliminar del comité");
      }
    } catch (error) {
      console.error("Error al eliminar las ideas del comité:", error);
    }
  };

  const handleConfirmSave = () => {
    setSaveConfirmatioModal(true);
  };

  const handleOpenCommittee = () => {
    setOpenIdeasCommittee(true);
  };
  const openModal = () => {
    setOpenIdeasCommittee(false);
  };
  const closeModalReload = () => {
    setOpenIdeasCommittee(false);
    window.location.reload();
  };
  const closeConfirmSend = () => {
    setSaveConfirmatioModal(false);
  };
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <article className="ideasCommitteeContent">
       <div className="Header">
      <h3>Ideas *</h3>
      <span onClick={handleEditClickIdeas}>
      {commiteContent.estado === "652ed8d0d698f429de6e6e4b" ? null : (
        <img
          id="ideaIcon"
          src={isIdeasIcon ? editcommite : editcommiteA}
          alt=""
          onClick={toogleIdeas}
        />
      )}
      </span>
      </div>
      <div className="custom-container">
        <div className="text-cantidadIdeas">
          <p>{commiteContent?.ideas?.length} ideas</p>
        </div>
        <div className="SeccionVacia"></div>
        {isEditModeIdeas && (
          <div className="ContenedorIconosIdea">
            <input
              type="checkbox"
              className="inputCheckIdea"
              style={{ display: isCheckboxVisible ? "block" : "none" }}
              checked={isCheckedAllIdeas}
              disabled={
                !commiteContent?.ideas || commiteContent?.ideas.length === 0
              }
              onChange={() => {
                if (
                  !commiteContent?.ideas ||
                  commiteContent?.ideas.length === 0
                ) {
                  return;
                }

                const updatedCheckboxes = new Array(
                  commiteContent?.ideas?.length
                ).fill(!isCheckedAllIdeas);
                setIdeaCheckboxes(updatedCheckboxes);

                const updatedSelectedIdeas = isCheckedAllIdeas
                  ? []
                  : [...commiteContent.ideas];
                setSelectedIdeas(updatedSelectedIdeas);
                const selectedIdeasIds = updatedSelectedIdeas.map(
                  (selectedIdea) => selectedIdea._id
                );
                console.log(
                  "IDs de las ideas seleccionadas:",
                  selectedIdeasIds
                );
                setIdeasSelect(selectedIdeasIds);

                setIsCheckedAllIdeas(!isCheckedAllIdeas);
              }}
            />

            <img
              className="custom-image"
              src={agregarIdea}
              alt=""
              style={{ display: isAgregarIdeaVisible ? "block" : "none" }}
              onClick={handleOpenCommittee}
            />
            <img
              className="custom-image"
              src={removeIdea}
              alt=""
              style={{ display: isRemoveIdeaVisible ? "block" : "none" }}
              onClick={handleConfirmSave}
            />
            {showSendSave && (
              <>
                {openIdeasCommittee && (
                  <IdeasCommittee
                    closeModal={openModal}
                    closeModalReload={closeModalReload}
                    commiteContent={commiteContent}
                  />
                )}
                {saveConfirmatioModal && (
                  <SendModal
                    titulo={"¿Eliminar idea?"}
                    img={FoxAmarillo}
                    paragraf={
                      "Si eliminas esta idea no podrá ser evaluada en el comité que estas creando"
                    }
                    btn1={"No, cancelar"}
                    btn2={"Sí, eliminar Idea"}
                    fnct1={closeConfirmSend}
                    fnct2={onRemove}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="ideasCommittee"> 
        {commiteContent?.ideas?.map((idea, index) => (
          <div key={index} className="individualCommitteeIdea">
            <figure>
              {IdeaAvatarUrls[index] !== null ? (
                <img src={IdeaAvatarUrls[index]} alt="" />
              ) : (
                <img src={defaultPhoto} alt="" />
              )}
            </figure>
            <div className="CommitteeTexts">
              <h3>{idea.titulo}</h3>
              <p>
                Autor:{" "}
                <span>
                  {idea?.autor?.nombres.split(" ")[0]}{" "}
                  {idea?.autor?.apellidos.split(" ")[0]}
                </span>
              </p>
              <p>
                Tipo de innovación: <span>{idea?.tipo_innovacion?.nombre}</span>
              </p>
            </div>
            <div>
              {isEditModeIdeas && (
                <input
                  type="checkbox"
                  className="inputCheckIdea"
                  style={{ marginLeft: "0", transform: "scale(1.5)" }}
                  checked={ideaCheckboxes[index]}
                  onChange={() => handleCheckIdea(index)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
export default CommitteeIdeas;
