import { useState, useEffect } from "react"
import { postActivities } from "../../../services/activities.services"
import { getAllUsers } from '../../../services/users.services';
import {putActivities} from "../../../services/activities.services"
import "./CreateActivityModal.css"

const CreateActivityModal = ({closeModalAdd, unitActivity})=>{
    const [form, setForm] = useState(() => {
        if (unitActivity && unitActivity.fecha) {
          const fechaObj = typeof unitActivity.fecha === 'string' ? new Date(unitActivity.fecha) : unitActivity.fecha;
          const formatNumber = (num) => (num < 10 ? `0${num}` : num);
          return {
            tipo: unitActivity.tipo,
            resumen: unitActivity.resumen,
            criterios: unitActivity.criterios,
            puntos: unitActivity.puntos,
            dia: fechaObj.toISOString().split('T')[0],
            hora: `${formatNumber(fechaObj.getHours())}:${formatNumber(fechaObj.getMinutes())}`
          };
        } else {
          return {
            tipo: "",
            resumen: "",
            criterios: "",
            puntos: 0,
            dia: "",
            hora: ""
          };
        }
      });
    const [activityUsers, setActivityUsers] = useState([])
    const [userToAdd, setUserToAdd] = useState("")
    const [selectedItems, setSelectedItems] = useState([]);
    const [toSaveList, setToSaveList] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            setActivityUsers(users)
        }
        fetchUsers();
        if(unitActivity.tipo && unitActivity.participantes.length >0)
        {
            setSelectedItems(unitActivity.participantes)
        }
    }, [])
    
    useEffect(() => {
        setToSaveList(selectedItems)
    }, [selectedItems, setToSaveList])
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({...form,[name]:value});
    };

    const newActivities = async()=>{
        const data = {
            tipo:form.tipo,
            resumen:form.resumen,
            criterios:form.criterios,
            participantes:toSaveList,
            puntos:form.puntos,
            fecha: new Date(`${form.dia} ${form.hora}`)
        }
        console.log(data)
        if(!unitActivity.tipo){
            try{
                const fetch = await postActivities(data)
                console.log(fetch)
                window.location.reload();
            }catch(err){
                console.log(err)
            }
        }else{
             try{
                const fetch = await putActivities(unitActivity._id, data)
                console.log(fetch)
                window.location.reload();
            }catch(err){
                console.log(err)
            }
        }
       
        /*  */
    }
    const handleSearchUser = event => {
		setUserToAdd(event.target.value);
	};
	const handleItemClick = async (item) => {
		if (!selectedItems.find((selectedItem) => selectedItem._id === item._id)) {
			try {
				/* const avatarUrl = await getUserAvatarUrl(item.foto);
				item.avatarUrl = avatarUrl; */
				setSelectedItems([...selectedItems, item]);
			} catch (error) {
				console.error("Error al obtener la URL del avatar:", error);
			}
			setUserToAdd("");
		}
	};
	const onDeleteTask = (id) => {
		const temp = selectedItems.filter(item2 => item2._id !== id)
		setSelectedItems(temp)
	};
	const filteredResults = activityUsers.filter(autorSearchList => {
        const itemIsSelected = selectedItems.find(selectedItem => selectedItem._id === autorSearchList._id);
        return ((autorSearchList?.nombres && autorSearchList?.nombres.toLowerCase().includes(userToAdd?.toLowerCase()))
          || (autorSearchList?.apellidos && autorSearchList?.apellidos.toLowerCase().includes(userToAdd?.toLowerCase())))
          && !itemIsSelected;
    });
    return(
        <div className="createActivityModal">
            <form>
                <label htmlFor="activity">Nombre de la actividad</label>
                <input 
                    type="text" 
                    id="activity"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleInputChange}
                    autoComplete="off"
                />

                <label htmlFor="desciption">Descripción</label>
                <textarea 
                    id="desciption"
                    value={form.resumen}
                    name="resumen"
                    onChange={handleInputChange}
                ></textarea>

                <label htmlFor="resume">Criterios</label>
                <textarea 
                    id="resume"
                    value={form.criterios}
                    name="criterios"
                    onChange={handleInputChange}
                ></textarea>

                <label htmlFor="addPeople">Agregar participantes</label>
                <input 
                    type="search"
                    autoComplete="off"
                    onChange={handleSearchUser}
					value={userToAdd}
                />
                {userToAdd.length > 0 && (
                    <ul>
                        {filteredResults.map((userList, index)=>(
                            <li key={index} onClick={()=>handleItemClick(userList)}>
                                {userList.nombres} {userList.apellidos} 
                            </li>
                        ))}
                    </ul>
                )}
                {selectedItems.length > 0 && (
                    <>
                        {selectedItems.map((user, index)=>(
                            <div key={index}>
                                <p>{user.nombres}</p>
                                <p onClick={() => onDeleteTask(user._id)}>x</p>
                            </div>
                        ))}
                    </>
                )}
                <label htmlFor="points">Puntos</label>
                <input 
                    type="number"
                    id="points"
                    name="puntos"
                    value={form.puntos}
                    onChange={handleInputChange} 
                />

                <label htmlFor="date">Día</label>
                <input 
                    type="date" 
                    id="date"
                    name="dia"
                    value={form.dia}
                    onChange={handleInputChange} 
                />
                <label htmlFor="hour">Hora</label>
                <input 
                    type="time" 
                    id="hour"
                    name="hora"
                    value={form.hora}
                    onChange={handleInputChange}
                />
                <div>
                    <button type='button' onClick={closeModalAdd}>Cerrar</button>
                    <button type="button" onClick={newActivities}>{!unitActivity.tipo?"Enviar":"Actualizar"}</button>
                </div>
                
                
            </form>
            
        </div>
    )
}
export {CreateActivityModal}