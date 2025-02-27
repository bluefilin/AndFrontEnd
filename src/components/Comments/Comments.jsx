import { useState, useEffect } from "react";
import './Comments.css';
import { dataDecrypt } from "../../util/encrypt";

import { getUserAvatarUrl } from "../../services/users.services";
import profilePhoto from "../../assets/img/defaultPhoto.jpg";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getLabels } from "../../services/idea.services";
import { getStates } from "../../services/estados.services";
import axios from "axios";
import defaultFox from "../../assets/img/defaultPhoto.jpg"
import { getPhotoComment } from "../../services/users.services";


const Comments = ({ idea, putCreateComment }) => {
	const user = dataDecrypt(sessionStorage.getItem('user'));
	const [avatarUrl, setAvatarUrl] = useState('');
	const [toogleFilter, setToogleFilter] = useState(false);
	const [seeHideBlock, setSeeHideBlock] = useState(false);
	const [seeHideComments, setSeeHideComments] = useState({});
	const [comments, setComments] = useState('');
	const [labels, setLabels] = useState([]);
	const [showOptions, setShowOptions] = useState(false);
	const [firstHashtagWritten, setFirstHashtagWritten] = useState(false);
	const [selectedLabelId, setSelectedLabelId] = useState("");
	const [estados, setEstados] = useState([]);
	const [commentsBlock, setCommentsBlock] = useState([])
	const [userPhotoComment, setuserPhotoComment] = useState(false)

	useEffect(() => {
		const fetchLabels = async()=>{
			const resLabels = await getLabels();
			setLabels(resLabels);
		}
		const getEstados = async () => {
			const estados = await getStates("idea");
			setEstados(estados);
		  }
		fetchLabels();
		getEstados();
		setCommentsBlock(idea?.seccionComentarios?.slice().reverse())
	}, [])
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
	
	const actionToogleFilter = ()=>{
		setToogleFilter(!toogleFilter)
	}
	const actionToogleBlock =(blockId)=>{
		setSeeHideBlock((prevStates)=>({
			...prevStates,
			[blockId]: !prevStates[blockId],
		}));
	}
	const actionToogleComment =(commentId)=>{
		setSeeHideComments((prevStates) => ({
			...prevStates,
			[commentId]: !prevStates[commentId],
		  }));
	}
	const handleInputChange = (e) => {
	const value = e.target.value;
		setComments(value);

		if (value.includes('#') && !firstHashtagWritten) {
			setShowOptions(true);
			setFirstHashtagWritten(true);
		  } else if (!value.includes('#')) {
			setShowOptions(false);
			setFirstHashtagWritten(false);
		  }
	};
	const handleLabelClick = (label) => {
		setSelectedLabelId(label.nombre);
		setComments((prevValue) => prevValue.replace(/#\S*$/, `#${label.nombre} `));
		setShowOptions(false);
	};
	const filtrarGrupos = (e)=>{
		let grupo = e.target.value;
		if(grupo !== "todos"){
			const filteredGroup = idea?.seccionComentarios?.slice().reverse().filter((group) => group.grupo === grupo)
			setCommentsBlock(filteredGroup);
		}else{
			setCommentsBlock(idea?.seccionComentarios?.slice().reverse())
		}
	}
	const filstrarEstados = (e)=>{
		let estado = e.target.value;
		if(estado !== "todos"){
			const filteredStatus = idea?.seccionComentarios?.slice().reverse().filter((status) => status.estadoReporte === estado)
			setCommentsBlock(filteredStatus)
		}else{
			setCommentsBlock(idea?.seccionComentarios?.slice().reverse())
		}
	}
	const filterTags = (e)=>{
		let tag = e.target.value;
		if(tag !== "todas"){
			const filteredBlocks = idea?.seccionComentarios?.map((block) => {
				const filteredComments = block.comentarios.filter((comment) =>
				  comment.etiquetas.includes(tag)
				);
				if (filteredComments.length > 0) {
				  return {
					...block,
					comentarios: filteredComments,
				  };
				}
				return null;
			  }).filter(Boolean);
			  setCommentsBlock(filteredBlocks);
		}else{
			setCommentsBlock(idea?.seccionComentarios?.slice().reverse())
		}
	}
	const sendComment = async ()=>{
		let rol =""
		if(user?.grupo === "innovacion"){
			rol="Innovación"
		}else if(user?.grupo === "comite"){
			rol="Comité"
		}
		const dataComment ={
			comentario:{
				idComentario:"",
				etiquetas:[selectedLabelId],
				descripcion:comments,
				autorComentario:user.nombre.split(" ")[0] + " " + user.apellido.split(" ")[0],
				fechaComentario:new Date(),
				idusuario:user.id
			},
			seccionComentarios:{
				estadoReporte:idea.estado.nombre,
				grupo:rol,
				fechaSeccion:new Date()
			}
		}
		console.log(dataComment)
		const ideaId = idea._id;
		if(comments !== ""){
			try {
				const resCreateComment = await putCreateComment(dataComment, ideaId);
				console.log(resCreateComment)
				setComments('');
				window.location.reload();
			} catch (error) {
				console.log(error)
			}
		}else{
			console.log("No envio")
		}
		
	}

	const photoCondicional = async (idCommentsUser) => {
		try{
			const res = await getPhotoComment(idCommentsUser);
			if(res===200){
				setuserPhotoComment(true)
			}else{
				setuserPhotoComment(false)
			}
		}catch(err){
			console.log(err)
			return null;
		}
	}
	return(
		<>
		{idea !== undefined ? (
			<div className='comments'>
					{user.grupo === "innovacion" || user.grupo === "comite" ? (
				<div className='commentsTittle'>
					<h3>Comentarios</h3>
					<p onClick={actionToogleFilter}>Ver filtros</p>
				</div>
				):""}
				{user.grupo === "innovacion" || user.grupo === "comite" ? (
					<div  className="commentsInput">
						<figure>
							{avatarUrl ? (
								<img src={avatarUrl} alt="" />
							):(
								<img src={profilePhoto} alt="" />
							)}
						</figure>
						<textarea 
							value={comments}
							placeholder='Agrega un comentario...' 
							onChange={handleInputChange}>
						</textarea>
						<button type='button' onClick={sendComment}></button>
						{showOptions && (
							<div className="label-options">
								<ul>
									{labels.map((label, index) => (
									<li key={index} onClick={() => handleLabelClick(label)}>
										{label.nombre}
									</li>
									))}
								</ul>
							</div>
						)}
					</div>
				):""}
				
				{toogleFilter && (
					<div className="filterOptions">
						<select onChange={filterTags}>
							<option disabled selected value="">Etiqueta</option>
							<option value="todas">Todas</option>
							{labels.map((label)=>(
								<option key={label._id} value={label.nombre}>
									{label.nombre}
								</option>
							))}
						</select>
						<select onChange={filstrarEstados}>
							<option disabled selected value="">Estados</option>
							<option value="todos">Todos</option>
							{estados.map((estado)=>(
								<option key={estado._id} value={estado.nombre}>
									{estado.nombre}
								</option>
							))}

						</select>
						<select onChange={filtrarGrupos}>
							<option disabled selected value="">Área</option>
							<option value="todos">Todas las áreas</option>
							<option value="Innovación">Innovación</option>
							<option value="Comité">Comité</option>
						</select>
					</div>
				)}
				{ idea && commentsBlock !== 0 ? (
					<>
					{commentsBlock.map((block, index)=>(
						<div className="commentBlock" key={index}>
							<h4>
								{block.estadoReporte}  -  {block.grupo} - {format(new Date(block?.fechaSeccion), 'dd/MM/yy', { locale: es })} 
								<div onClick={()=>actionToogleBlock(block._id)}>
									{seeHideBlock[block._id] ? (
										<span>Ver menos <p> &lt;</p></span>
									):(
										<span>Ver más <p> &gt;</p></span>
									)}
									
								</div>
							</h4>
							{seeHideBlock[block._id] && (
								<>
									{block.comentarios.map((comment, index)=>(
										<div className="commentSingular" key={index}>
											<h5>{comment.autorComentario} - {format(new Date(comment.fechaComentario), 'dd/MM/yy', { locale: es })} - {format(new Date(comment.fechaComentario), 'hh:mm a', { locale: es })}
												<button 
												type="button"
												onClick={() => actionToogleComment(comment._id)}
												className={
													seeHideComments[comment._id]
													? "buttonplus"
													: "buttonless"
												}
												>  
												</button> 
											</h5>
											<figure onLoad={()=>photoCondicional(comment.idusuario)}>
												{userPhotoComment ? (
													<img 
													src={`${import.meta.env.VITE_REACT_APP_API_URL}api/usuarios/perfil/${comment.idusuario}`} 
													alt=""
													/> 
												) : (
													<img 
													src={defaultFox} 
													alt=""
													/> 
												)}
												
											</figure>
											<p>
											{seeHideComments[comment._id]
											? comment.descripcion
											: comment.descripcion.slice(0, 150) + "..."}
											</p>	
										</div>
									))}
									
								</>
								
								
							)}
							
						</div>
					))}
					</>
				):"Aún no hay comentarios"}
				
			</div>
		) : ""}
		</>
	) ;
};


export { Comments };