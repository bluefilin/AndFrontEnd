import "./PerfilCard.css";
import profilePhoto from "../../assets/img/defaultPhoto.jpg"
import { dataDecrypt } from "../../util/encrypt";
import { getUserAvatarUrl } from "../../services/users.services";
import { useState, useEffect } from "react";


const PerfilCard = () => {
  const user = dataDecrypt(sessionStorage.getItem('user'));
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user.foto) {
        const avatarUrl = await getUserAvatarUrl(user.foto);
        if (avatarUrl) {
          setAvatarUrl(avatarUrl);
        }
      }
    };

    fetchAvatar();
  }, [user.foto]);
  return (
    <>
      <div className="perfilCard">
        <figure>
          {avatarUrl ? (
            
            <img src={avatarUrl} alt="" />
          ) : (
            <img src={profilePhoto} alt="" />
          )}
        </figure>
        <div className="perfilDetails">
          <h3>{user.nombre.split(" ")[0]} {user.apellido.split(" ")[0]}</h3>
          <p>{user.cargo.toLowerCase()}</p>
          {/* <span>0 pts</span> */}
        </div>
      </div>
    </>
  );
};

export { PerfilCard };

