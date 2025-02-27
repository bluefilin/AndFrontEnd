import { useState, useEffect } from 'react';
import { getActivities } from '../../services/activities.services';
import './PointsAdmin.css';
import { CreateActivityModal } from '../../components/PointsComponents/CreateActivityModal';

const PointsAdmin = () => {
    const [activities, setActivities] = useState([])
    const [modalAdd, setModalAdd] = useState(false)
    const [unitActivity, setUnitActivity] = useState([])

    useEffect(() => {
        const fetchActivities = async ()=>{
            const res = await getActivities();
            setActivities(res)
        }
        fetchActivities()
    }, [])
    const handleModalAdd = ()=>{
        setModalAdd(true);
    }
    const closeModalAdd = ()=>{
        setModalAdd(false);
    }
    const updateActivity =(activity)=>{
        setUnitActivity(activity)
        setModalAdd(true);
    }
	return (
        <div className='pointsAdmin'>
            <h2>Administra los puntos</h2>
            <button type='button' onClick={handleModalAdd}>
                Add
            </button>
            {modalAdd && (
                <CreateActivityModal
                    closeModalAdd={closeModalAdd}
                    unitActivity={unitActivity}
                />
            )}
            <table>
                <thead>
                    <tr>
                        <th>Actividad</th>
                        <th>Descripción</th>
                        <th>Participantes</th>
                        <th>Puntos</th>
                        <th>Criterio</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        activities.map((activity, index)=>(
                            <tr key={index}>
                                <td>{activity.tipo}</td>
                                <td>{activity.resumen}</td>
                                <td>{activity.participantes.map((card)=>(card.nombres))}</td>
                                <td>{activity.puntos}</td>
                                <td>{activity.criterios}</td>
                                <td>{activity.fecha}</td>
                                <td><button type="button" onClick={()=>updateActivity(activity)}>Actualizar</button></td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        </div>
    );
};

export{ PointsAdmin };