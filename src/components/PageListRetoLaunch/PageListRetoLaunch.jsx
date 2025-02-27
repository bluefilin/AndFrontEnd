import { useState, } from 'react';
import './PageListRetoLaunch.css';

import { dataDecrypt } from '../../util/encrypt';
import { useNavigate } from 'react-router-dom';
const PageListRetoLaunch = ({ retosList, showChallengedInfo }) => {
  const user = dataDecrypt(sessionStorage.getItem('user'));
  const iduser = user.id;

 

  const navigate = useNavigate()
  const irAlReto = (id) => {
    navigate(`/reto/${id}`)
  }
  return (
  
      <div className='elementsListLaunch'>
          <div className='carrusel'>
            {retosList && retosList.map((reto, index) => (
              <div key={index} className='campainChallenge'>
                <figure>
                  <h4>{reto?.tipo_innovacion?.nombre}</h4>
                  <p><span></span>En {Math.ceil((new Date(reto.fechaFinal) - new Date()) / (1000 * 60 * 60 * 24))} días termina</p>
                </figure>
                <div className='campainChallengeContent'>
                  <p>{reto.titulo}</p>
                  <div className='bottones'>
                    <button onClick={() => irAlReto(reto._id)}>Ver reto 👀</button>
                  
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
  );
};

export { PageListRetoLaunch };
