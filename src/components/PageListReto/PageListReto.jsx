import { useState, useEffect } from 'react';
import './PageListReto.css';
import fox from "../../assets/img/defaultPhoto.jpg";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { getUserAvatarUrl } from '../../services/users.services';
import { dataDecrypt } from '../../util/encrypt';

const PageListReto = ({ retosList, showChallengedInfo }) => {
  const itemsPerPage = 10; // Número de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [avatarUrls, setAvatarUrls] = useState([]);
  const totalPages = Math.ceil(retosList.length / itemsPerPage);
  const user = dataDecrypt(sessionStorage.getItem('user'));
  const iduser = user.id;

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, retosList.length);

  useEffect(() => {
    const loadAvatarUrls = async () => {
      const urls = await Promise.all(
        retosList.slice(startIndex, endIndex).map(async (reto) => {
          if (reto.autor.foto !== "" && reto.autor.foto !== undefined) {
            return await getUserAvatarUrl(reto.autor.foto);
          } else {
            return null;
          }
        })
      );
      setAvatarUrls(urls);
    };
    loadAvatarUrls();
  }, [retosList, startIndex, endIndex]);

  return (
    <>
      <p>
        {startIndex + 1} - {endIndex} de {retosList.length}
        <span
          onClick={prev}
          className={currentPage > 1 ? "prevNext" : "prevNextDisable"}
        >
          &lt;
        </span>
        <span
          onClick={next}
          className={currentPage < totalPages ? "prevNext" : "prevNextDisable"}
        >
          &gt;
        </span>
      </p>
      <div className='elementsList'>
        {retosList.slice(startIndex, endIndex).map((reto, index) => {
          // Verifica si el usuario actual (user) se encuentra en la lista de desafiados
          const isUserChallenged = reto.desafiados.includes(iduser);

          return (
            <Link to={`/reto/${reto._id}`} key={index}>
              <div className={`retoChallengeBox${isUserChallenged ? ' challenged' : ''}`}>
                <div>
                  {avatarUrls[index] !== null ? (
                    <img src={avatarUrls[index]} alt="" />
                  ) : (
                    <img src={fox} alt="" />
                  )}
                </div>
                <div>
                  <h3>{reto?.titulo}</h3>
                  <p><b>Autor: </b>{reto?.autor.nombres} {reto?.autor.apellidos}</p>
                  <p><b>Estado: </b>{reto?.estado.nombre}</p>
                </div>
                {showChallengedInfo && isUserChallenged && (
                  <div className="challenged-indicator">
                    Desafiado
                  </div>
                )}
                <div>
                  <span>Ajustes (1)</span>
                  <p><b>Fecha de creación: </b>{reto?.createdAt ? format(new Date(reto?.createdAt), 'dd/MMM/yy HH:mm', { locale: es }) : ''}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export { PageListReto };
