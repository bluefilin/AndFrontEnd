import { useState } from 'react';
import './ThrowChallenge.css';
import { useEffect } from 'react';
import { getAllUsers } from '../../../services/users.services';
import { putUpdateReto } from '../../../services/reto.services';
import redWarning from "../../../assets/icons/redWarning.svg";
import errorFox from "../../../assets/img/errorFox.png"
import photo from "../../../assets/img/defaultPhoto.jpg";
import lanzarRetoImg from "../../../assets/img/lanzarRetoImg.png"
import { getUserAvatarUrl } from '../../../services/users.services';
const ThrowChallenge = ({ reto, onClose, launchChallenge, youMust }) => {
  const [initialDate, setInitialDate] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [initialHour, setInitialHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [confidencialidad, setConfidencialidad] = useState('Publico');
  const [validateButtons, setValidateButtons] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [nuevoHorario, setNuevoHorario] = useState(false);
  const [horarioPredeterminado, setHorarioPredeterminado] = useState(false);
  useEffect(() => {
    const getUserCommite = async () => {
      const usersCommite = await getAllUsers();
      setResults(usersCommite)
    }
    getUserCommite()
    if (reto && (reto.visualizadores.length > 0)) {
      setSelectedItems(reto.visualizadores)
    }
  }, [])


  const createNewCommittee = async (e) => {
    e.preventDefault()
    try {
      const visualizadoresIDs = selectedItems.map(item => item._id);

      const RetoData = {
        fechaInicio: new Date(`${initialDate} ${initialHour}`),
        fechaFinal: new Date(`${endDate} ${endHour}`),
        visualizadores: visualizadoresIDs,
        confidencialidad: confidencialidad
      };
      if (initialDate === ""
      || endDate === "" || initialHour === "" || endHour === "") {
      setValidateButtons(false)
    }
    else {
      launchChallenge("22");
      putUpdateReto(RetoData, reto._id);
      setValidateButtons(true);
      // onClose()
    }
     
    } catch (err) {
      console.error('Error al lanzar el reto:', err);
    }
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;

    if (value === 'Nuevo horario') {
      setNuevoHorario(true);
      setHorarioPredeterminado(false);
    } else if (value === 'Horario predeterminado') {
      setNuevoHorario(false);
      setHorarioPredeterminado(true);

      setInitialHour('06:00');
      setEndHour('23:59');
    }
  };

  const handleInputChange = event => {
    setQuery(event.target.value);
  };
  const handleItemClick = async (item) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem._id === item._id);
    if (!isSelected) {
      try {
        const avatarUrl = await getUserAvatarUrl(item.foto);
        const updatedItem = { ...item, avatarUrl };
        const updatedItems = [...selectedItems, updatedItem];
        setSelectedItems(updatedItems);
        setQuery("");
      } catch (error) {
        console.error('Error al obtener la URL del avatar:', error);
      }
    }
  };
  const onDeleteTask = (id) => {
    const temp = selectedItems.filter(item2 => item2._id !== id)
    setSelectedItems(temp)
  };

  const filteredResults = results.filter(usuariosSerchList => {
    const itemIsSelected = selectedItems.find(selectedItem => selectedItem._id === usuariosSerchList._id);
    const matchesQuery = (
      (usuariosSerchList.nombres && usuariosSerchList.nombres.toLowerCase().includes(query.toLowerCase())) ||
      (usuariosSerchList.apellidos && usuariosSerchList.apellidos.toLowerCase().includes(query.toLowerCase()))
    );
    return matchesQuery && !itemIsSelected;
  }
  );

  return (
    <div className='ThrowChallenge'>
      <div className='modalCreateThrowChallenge'>
        <span className='iconClose' onClick={onClose} >X</span>
        <h2 className='createThrowChallengeTitle'>Lanzar Reto</h2>
        <p className='createThrowChallengeSubtitle'>Selecciona la fecha y el tipo de reto </p>
        <div className='Imagen cuadrar'>
          <h1>{reto.titulo}</h1>
          <img className='FotoReto' src={lanzarRetoImg} alt="" />
        </div>
        <div className='committee'>
          <h2 className='subtitleModal'>Fecha del reto * </h2>
          <p>
            Indica el plazo en el que el reto estará abierto para recibir las ideas que ayudarán a resolverlo.
          </p>

          <div className='committeDate'>
            <div className="committeTime">
              <input
                type="date"
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
              />
              <label htmlFor="date">Fecha inicio</label>
            </div>
            <div className="committeTime">
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <label htmlFor="date">Fecha final</label>
              </div>
            </div>
          </div>
          <div className="committeeType">
            <h2 className='subtitleModal'>¿Agregar horario? </h2>
            <p>Si prefieres no hacerlo, se dejará el horario predeterminado de 6:00 am hasta las 11:59 pm </p>
            <div className='radiosCommitte' >
              <label htmlFor="cOportunity">
                <input
                  type="radio"
                  name="typeCommite"
                  id="predeterminado"
                  value="Nuevo horario"
                  checked={nuevoHorario}
                  onChange={handleRadioChange}
                />
                Sí, agrega un nuevo horario
              </label>
              <label htmlFor="committeeType">
                <input
                  type="radio"
                  name="typeCommitee"
                  id="predeterminado"
                  value="Horario predeterminado"
                  checked={horarioPredeterminado}
                  onChange={handleRadioChange}
                />
                No, dejar horario predeterminado
              </label>
            </div>
            {nuevoHorario && (
              <div className="committeDate">
                <div className="committeTime">
                  <input
                    type="time"
                    value={initialHour}
                    onChange={(e) => setInitialHour(e.target.value)}
                  />
                  <label htmlFor="time">Hora inicio</label>
                </div>
                <div className="committeTime">
                  <div>
                    <input
                      type="time"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                    />
                    <label htmlFor="time">Hora final</label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="committeeConfidentiality">
            <h2 className="subtitleModal">Confidencialidad</h2>
            <p>
              Indica si el reto es público o privado. Recuerda que los retos privados son visibles únicamente para las personas seleccionadas.
            </p>
            <div className="radiosCommitte">
              <label htmlFor="Rpublic">
                <input
                  type="radio"
                  name="Publico"
                  id="Rpublic"
                  value="Publico"
                  checked={confidencialidad === 'Publico'}
                  onChange={() => setConfidencialidad('Publico')}
                />
                Publico
              </label>
              <label htmlFor="Rprivate">
                <input
                  type="radio"
                  name="Privado"
                  id="Rprivate"
                  value="Privado"
                  checked={confidencialidad === 'Privado'}
                  onChange={() => setConfidencialidad('Privado')}
                />
                Privado
              </label>
            </div>
          </div>


          {confidencialidad === 'Privado' && (
            <div>
              <div className="ctContentAdd" id="genteExtra">
                <input
                  id="coautores"
                  type="search"
                  placeholder="Estos usuarios solo podran ver tu reto..."
                  autoComplete='off'
                  onChange={handleInputChange}
                  value={query}
                />
              </div>

              <div className="ctContentUsers">
                {query.length > 0 && (
                  <ul>
                    {filteredResults.map((usuariosSerchList, index) => (
                      <li key={index} onClick={() => handleItemClick(usuariosSerchList)}>
                        {usuariosSerchList.nombres} {usuariosSerchList.apellidos}
                      </li>
                    ))}
                  </ul>
                )}
                {selectedItems.length > 0 && (
                  <div className="ctContentUsers">
                    {selectedItems.map(usuariosCardlist => (
                      <div className="ctcUser" key={usuariosCardlist._id}>
                        <figure>
                          {usuariosCardlist.foto !== "" && usuariosCardlist.foto !== undefined ? (
                            <img src={usuariosCardlist.avatarUrl} alt="" />
                          ) : (
                            <img src={photo} alt="" />
                          )}
                        </figure>
                        <div>
                          <h1>{usuariosCardlist?.nombres?.split(" ")[0]} {usuariosCardlist?.apellidos?.split(" ")[0]}</h1>
                          <h2>{usuariosCardlist.cargo}</h2>
                          <button onClick={() => onDeleteTask(usuariosCardlist._id)}>x</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {validateButtons ? (
            <div className='createChallengeButtons'>
              <button className='button buttonOutline' onClick={onClose}>Cancelar</button>
              <button className='button buttonFill' onClick={createNewCommittee}>¡Lanzar reto!</button>
            </div>
          ) : (
            <div className='errorMsn1'>
              <p>
                Tienes que llenar todos los campos
                <img src={redWarning} alt="" />
              </p>
              <span onClick={() => setValidateButtons(true)}>
                Revisar
              </span>
              <img src={errorFox} alt="" />
            </div>
          )
          }

        </div>
      </div>
    </div>
  );
};
export { ThrowChallenge };

