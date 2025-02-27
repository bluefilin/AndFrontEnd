import React, { useState, useEffect } from "react";
import "./ShowCommittee.css";
import { CommitteeDetails } from "./CommitteeDetails/CommitteeDetails";
import CommitteeIdeas from "./CommitteeIdeas/CommitteeIdeas";
import { getUserAvatarUrl } from "../../../services/users.services";
import { getUsersCommitte } from "../../../services/users.services";
import { SendModal } from "./SendModal";
import FoxAzul from "../../../assets/img/savedFox.png";
import FoxVerde from "../../../assets/img/sendedFox.png";
import FoxAmarillo from "../../../assets/img/doubtFox.png";
import { CommitteeDate } from "../ShowCommittee/CommitteeDate/CommiteeDate";
import { putUpdateCommittee } from "../../../services/committee.services";
import { postNewStageCommitte } from "../../../services/committee.services";
import { Await } from "react-router-dom";

const ShowCommittee = ({ commiteContent }) => {
  const formatTime = (timeString, typeFormat) => {
    const date = new Date(timeString);
    const horaFormateada = `${
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
    }:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
    }`;
    return horaFormateada;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const fechaFormateada = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
    return fechaFormateada;
  };

  const [selectedUsers, setSelectedUsers] = useState([]); // guarda los invitados
  const [showSendSave, setShowSendSave] = useState(false); // mostrar guardar cambios

  const [saveConfirmatioModal, setSaveConfirmatioModal] = useState(false);
  const [saveDoneModal, setSaveDoneModal] = useState(false);
  const [committes, setcommittes] = useState([]);
  const [sendConfirmatioModal, setSendConfirmatioModal] = useState(false);
  const [sendDoneModal, setSendDoneModal] = useState(false);
  const [IdeaAvatarUrls, setIdeasAvatarUrls] = useState([]); // imagenes de invitados (revisar despues)
  const [MembersAvatarUrls, setMembersAvatarUrls] = useState([]);
  const [allUsersUrl, setAllUsersUrl] = useState([]);
  const [date, setDate] = useState(formatDate(commiteContent.fechaInicio));
  const [initialHour, setInitialHour] = useState(() => {
    if (commiteContent && commiteContent.fechaInicio) {
      const hourInit =
        typeof commiteContent.fechaInicio === "string"
          ? new Date(commiteContent.fechaInicio)
          : commiteContent.fechaInicio;
      const formatNumber = (num) => (num < 10 ? `0${num}` : num);
      return `${formatNumber(hourInit.getHours())}:${formatNumber(
        hourInit.getMinutes()
      )}`;
    } else {
      return "";
    }
  });
  const [endHour, setEndHour] = useState(() => {
    if (commiteContent && commiteContent.fechaInicio) {
      const hourInit =
        typeof commiteContent.fechaInicio === "string"
          ? new Date(commiteContent.fechaInicio)
          : commiteContent.fechaInicio;

      const formatNumber = (num) => (num < 10 ? `0${num}` : num);

      return `${formatNumber(hourInit.getHours())}:${formatNumber(
        hourInit.getMinutes()
      )}`;
    } else {
      return "";
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isComiteSaved, setIsComiteSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIdeas, setSelectedIdeas] = useState([]); 
  const [isDateIcon, setIsDateIcon] = useState(true);
  const [isDetalleIcon, setIsDetalleIcon] = useState(true);
  const [isIdeasIcon, setIsIdeasIcon] = useState(true);
  const [Programar, setProgramar] = useState(false);
  const [isEditModeIdeas, setIsEditModeIdeas] = useState(false);
  const [format, setFormat] = useState("yyyy-MM-dd"); 
  const [confidencialidad, setConfidencialidad] = useState(false);
  const [editableConfidencialidad, setEditableConfidencialidad] = useState(
    commiteContent?.confidencialidad
  );

  const handleConfirmSave = () => {
    const updatedCommiteContent = { ...commiteContent };
    updatedCommiteContent.confidencialidad = editableConfidencialidad;
    try {
      setIsComiteSaved(true);
      setSaveConfirmatioModal(true);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    } finally {
      setIsEditing(false);
      setIsEditMode(false);
      setIsEditModeIdeas(false);
      setIsEditingDate(false);
    }
  };

  const closeConfirmSend = () => {
    setSaveConfirmatioModal(false);
    setSendConfirmatioModal(false);
    setProgramar(false)
  };

  useEffect(() => {
    const getUserCommite = async () => {
      const usersCommite = await getUsersCommitte();
      setcommittes(usersCommite);
      const allUserIds = usersCommite.map((user) => user._id);
      setSelectedUsers(allUserIds);
    };
    getUserCommite();

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
      const MembersUrls = await Promise.all(
        commiteContent.integrantes.map(async (integrantes) => {
          if (integrantes.foto !== "" && integrantes.foto !== undefined) {
            return await getUserAvatarUrl(integrantes.foto);
          } else {
            return null;
          }
        })
      );
      console.log(committes);
      const users = await Promise.all(
        committes.map(async (integrantes) => {
          if (integrantes.foto !== "" && integrantes.foto !== undefined) {
            return await getUserAvatarUrl(integrantes.foto);
          } else {
            return null;
          }
        })
      );
      setAllUsersUrl(users);
      setIdeasAvatarUrls(IdeaUrls);
      setMembersAvatarUrls(MembersUrls);
    };
    loadAvatarUrls();
  }, [commiteContent]);

  const onSave = async () => {
    const dateT = new Date(`${date}T${initialHour}`);
    const datet = new Date(`${date}t${endHour}`);

    const dataDate = {
      tipo: "Comité Proyecto",
      fechaInicio: dateT,
      fechaFinalizacion: datet,
      integrantes: selectedUsers,
      comentarios: [],
      archivos: [],
      confidencialidad: confidencialidad,
      ideas: selectedIdeas,
    };
    try {
      const res = await putUpdateCommittee(dataDate, commiteContent._id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    setSaveDoneModal(true);
  };

  useEffect(() => {
    if (commiteContent && confidencialidad !== undefined) {
      const updatedCommiteContent = { ...commiteContent, confidencialidad };

      if (isEditMode) {
        putUpdateCommittee(commiteContent._id, updatedCommiteContent)
          .then((updatedData) => {
            console.log("Comité actualizado en la base de datos:", updatedData);
          })
          .catch((error) => {
            console.error(
              "Error al actualizar el comité en la base de datos:",
              error
            );
          });
      }
    }
  }, [confidencialidad, commiteContent, isEditMode]);
  console.log('Confidencialidad: ',commiteContent.confidencialidad);
  console.log('Ideas: ', commiteContent.ideas);
  console.log('Integrantes: ', commiteContent.integrantes);
  console.log(commiteContent.fechaFinalizacion);
  console.log(commiteContent.tipo);
    
  const onSubmit = async () => {
    try {
      const insert = {
        comite: commiteContent._id,
        estado: "14",
      };
      const newDate = {
        tipo: commiteContent.tipo,
        fechaInicio: commiteContent.fechaInicio,
        fechaFinalizacion: commiteContent.fechaFinalizacion,
        integrantes: commiteContent.integrantes,
        comentarios: [],
        archivos: [],
        confidencialidad: commiteContent.confidencialidad,
        ideas: commiteContent.ideas,
      };
      try {
        const res = await putUpdateCommittee(newDate, commiteContent._id);
        console.log(res);
      } catch (error) {
        console.log(error);
      }      
      await postNewStageCommitte(insert);
      setSendDoneModal(true);
    } catch (error) {
      console.error("Error al programar el comité:", error);
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const handleConfirmSend = async () => {
    const updatedDataCommiteContent = { ...commiteContent };
    updatedDataCommiteContent.confidencialidad = editableConfidencialidad;

    try {
      setIsComiteSaved(true);
      setSaveConfirmatioModal(true);

      setSendConfirmatioModal(true);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    } finally {
      setIsEditing(false);
      setIsEditMode(false);
      setIsEditModeIdeas(false);
      setIsEditingDate(false);
    }
  };

  const toggleIcon = (iconType) => {
    switch (iconType) {
      case "date":
        setIsDateIcon(!isDateIcon);
        break;
      case "details":
        setIsDetalleIcon(!isDetalleIcon);
        break;
      case "ideas":
        setIsIdeasIcon(!isIdeasIcon);
        break;
      default:
        setIsDateIcon(false);
        setIsDetalleIcon(false);
        setIsIdeasIcon(false);
    }
    setShowSendSave(isDateIcon || isDetalleIcon || isIdeasIcon);
  };
  const toggleIconAndButtons = (iconType) => {
    toggleIcon(iconType);
  };
  const toogleDatePen = () => {
    toggleIconAndButtons("date");
  };
  const toogleDetails = () => {
    toggleIconAndButtons("details");
  };
  const toogleIdeas = () => {
    toggleIconAndButtons("ideas");
  };
  useEffect(() => {
    if (!isDateIcon || !isDetalleIcon || !isIdeasIcon) {
      setShowSendSave(true);
    } else {
      setShowSendSave(false);
    }
  }, [isDateIcon, isDetalleIcon, isIdeasIcon]);
  const posponer = async () => {
    try {
      const insert = {
        comite: commiteContent._id,
        estado: "13",
      };
      await postNewStageCommitte(insert);;
     setProgramar(false)
     window.location.reload();
    } catch (error) {

  
      console.error("Error al programar el comité:", error);
    }
  };
  return (
    <div className="showcommittee">
      <section className="date-ideas-details">
        <CommitteeDate
          format={format}
          setFormat={setFormat}
          CommitteeDate={CommitteeDate}
          setDate={setDate}
          date={date}
          setInitialHour={setInitialHour}
          initialHour={initialHour}
          setEndHour={setEndHour}
          endHour={endHour}
          commiteContent={commiteContent}
          setShowSendSave={setShowSendSave}
          showSendSave={showSendSave}
          toogleDatePen={toogleDatePen}
          isDateIcon={isDateIcon}
        />
        <section>
          <CommitteeIdeas
            commiteContent={commiteContent}
            setShowSendSave={setShowSendSave}
            showSendSave={showSendSave}
            toogleIdeas={toogleIdeas}
            isIdeasIcon={isIdeasIcon}
            selectedIdeas={selectedIdeas}
            setSelectedIdeas={setSelectedIdeas}
          />
        </section>
      </section>
      <section>
        <CommitteeDetails
          commiteContent={commiteContent}
          confidencialidad={confidencialidad}
          setConfidencialidad={setConfidencialidad}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          MembersAvatarUrls={MembersAvatarUrls}
          setMembersAvatarUrls={setMembersAvatarUrls}
          setShowSendSave={setShowSendSave}
          showSendSave={showSendSave}
          onSave={onSave}
          toogleDetails={toogleDetails}
          isDetalleIcon={isDetalleIcon}
          allUsersUrl={allUsersUrl}
        />
        <div className="buttonEnd">
          {showSendSave ? (
            <button
              className={`btn1 ${isEditing ? "isEditing" : ""} ${
                isEditModeIdeas ? "isEditModeIdeas" : ""
              } ${isEditingDate ? "isEditingDate" : ""}`}
              onClick={handleConfirmSave}
            >
              Guardar Cambios
            </button>
          ) : (
            ""
          )}
          {commiteContent.estado === "652ed8d0d698f429de6e6e4b" ? (
         
              <button
                className={`btn1 ${isEditing ? "isEditing" : ""} ${
                  isEditModeIdeas ? "isEditModeIdeas" : ""
                } ${isEditingDate ? "isEditingDate" : ""}`}
                onClick={setProgramar}
              >
                Posponer comité
              </button>
          
          ) : (
              <button
                className={`btn2 ${isEditing ? "isEditing" : ""} ${
                  isEditModeIdeas ? "isEditModeIdeas" : ""
                } ${isEditingDate ? "isEditingDate" : ""}`}
                onClick={handleConfirmSend}
              >
                Programar Comité
              </button>
          )}
         
        </div>

        {saveConfirmatioModal ? (
          <SendModal
            titulo={"¿Guardar cambios?"}
            img={FoxAzul}
            paragraf={
              "Si guardas los cambios, puedes continuar editando en otro momento"
            }
            btn1={"No, cancelar"}
            btn2={"Sí, guardar"}
            fnct1={closeConfirmSend}
            fnct2={onSave}
          />
        ) : (
          ""
        )}
        {saveDoneModal ? (
          <SendModal
            titulo={"¡Guardado!"}
            img={FoxVerde}
            paragraf={
              "Los cambios han sido guardados, puedes continuar editando en otro momento."
            }
            btn2={"Entendido"}
            fnct2={reloadPage}
          />
        ) : (
          ""
        )}
        {sendConfirmatioModal ? (
          <SendModal
            titulo={"¿Programar comité? "}
            img={FoxAmarillo}
            paragraf={
              "Si programas el comité, los miembros del comité recibiran la información y solo se podrá posponerlo."
            }
            btn1={"No, cancelar"}
            btn2={"Sí, programar"}
            fnct1={closeConfirmSend}
            fnct2={onSubmit}
          />
        ) : (
          ""
        )}
        {sendDoneModal ? (
          <SendModal
            titulo={"¡Se ha enviado la programación! "}
            img={FoxVerde}
            paragraf={
              "Se ha enviado la programación a los participantes del comité."
            }
            btn2={"¡Listo!"}
            fnct2={reloadPage}
          />
        ) : (
          ""
        )}
          {Programar ? (
          <SendModal
            titulo={"¿Posponer comité?"}
            img={FoxAmarillo}
            paragraf={
              "Pospón el comité únicamente si es una indicación de presidencia."
            }
            btn1={"No, cancelar"}
            btn2={"Sí, posponer"}
            fnct1={closeConfirmSend}
            fnct2={posponer}
          />
        ) : (
          ""
        )}
      </section>
    </div>
  );
};
export { ShowCommittee };
