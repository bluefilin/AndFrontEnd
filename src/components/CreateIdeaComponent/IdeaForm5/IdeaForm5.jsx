import './IdeaForm5.css';
import { useState, useEffect } from 'react';
import iconFileUpload from "../../../assets/icons/upLoadFile.svg";
import deleteIcon from "../../../assets/icons/delete.svg";
import adIcon from "../../../assets/icons/adIcon.svg"
import comentario from "../../../assets/icons/comment.svg"
import bx_link from "../../../assets/icons/bx_link.svg"
import subirArchivo from "../../../assets/icons/subirArchivo.svg"

const IdeaForm5 = ({
	register, linksFields, linksAppend, linksRemove, errors, filesFields, filesAppend, filesRemove, idea, setValue
}) => {
	const [selectedFileName, setSelectedFileName] = useState(idea?.archivos.map((file) => file) || []);
	const [selectedFilePitch, setSelectedFilePitch] = useState(idea?.pitch || '');
	const [toolkitFile, setToolkitFile] = useState(idea?.toolkit || "")
	const [commentValue, setCommentValue] = useState(idea?.descripcion || ""); 
	const [hasUploadedFile, ] = useState(false); 
	const [showComments, setShowComments] = useState(false);
	useEffect(() => {
		if (idea && idea.links) {
			idea.links.forEach((link, index) => {
				setValue(`links.${index}.title`, link.title);
				setValue(`links.${index}.enlace`, link.enlace);
			});
		}
	}, [idea, setValue]);

	const handleFileChange = (event, index) => {
		const selectedFile = event.target.files[0];
		const newSelectedFileNames = [...selectedFileName];

		if (selectedFile) {
			newSelectedFileNames[index] = selectedFile.name;
		} else {
			newSelectedFileNames[index] = '';
		}

		setShowComments(true);
		setSelectedFileName(newSelectedFileNames);

	};
	const handleFilePitch = (e) => {
		setSelectedFilePitch(e.target.files[0].name)
	}
	const handleFileToolkit = (e) => {
		setToolkitFile(e.target.files[0].name)
	}
	const handleFileRemove = (index) => {
		const newSelectedFileNames = [...selectedFileName];
		newSelectedFileNames.splice(index, 1);
		setSelectedFileName(newSelectedFileNames);
		setShowComments(false);
	};

	const handleCommentDelete = () => {
		setCommentValue(""); 
	};
	return (
		<div className='ideaform5'>
			<div className='toolKit'>
				<label>
					Sube tu herramienta de innovación *
					<img src={adIcon} alt="" />
					<span>Puedes realizar la herramienta digitalmente o hacerla a mano y convertilar en un archivo PDF</span>
				</label>
				<p>
					Anexa el documento en el que aplicaste al menos una herramienta de innovación
				</p>
				<div className='toolkitButton'>
					<label htmlFor='toolkit' className={toolkitFile ? "toolkitLoaded" : "toolkitNoLoaded"}>
						{toolkitFile ? (<p>&#10004;</p>) : (<img src={iconFileUpload} alt="" />)}

						{toolkitFile ? toolkitFile : "Subir un archivo"}
					</label>
					<input
						type="file"
						id="toolkit"
						accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
						{...register("toolkitArchivo")}
						onChange={(e) => handleFileToolkit(e)}
					/>
				</div>


				{errors?.toolkit && <p>{errors?.toolkit?.message}</p>}
			</div>
			<div className='pitch'>
				<label>
					Puedes agregar un video con el pitch de tu idea innovadora *
					<img src={adIcon} alt="" />
					<span>Un elevador pitch es una presentación de máximo 2 minutos en la que explicas tu idea de una manera ágil, clara y concisa. Ejemplo</span>
				</label>
				<p>
					Explica tu idea con tus propias palabras, ¡Queremos verte!
				</p>
				<div className='pitchButton'>
					<label htmlFor='pitch' className={selectedFilePitch ? "pitchLoaded" : "pitchNoLoaded"}>
						{selectedFilePitch ? (<p>&#10004;</p>) : (<img src={iconFileUpload} alt="" />)}
						{selectedFilePitch ? selectedFilePitch : "Subir un archivo"}
					</label>
					<input
						type="file"
						id="pitch"
						{...register("pitch")}
						accept="video/*"
						onChange={(e) => handleFilePitch(e)}
					/>

				</div>

			</div>
			<div className='FilesA'>
				<label htmlFor="filesArray">
					Agrega imágenes, videos o documentos
					<img src={adIcon} alt="" />
					<span>Anexa archivos que expongan mejor el reto</span>
				</label>
				<p> Recuerda subirlos con un nombre descriptivo</p>
				<div className='filesCards'>
					{selectedFileName.length === 0 ? (
						<button type='button' className='addFileButton' onClick={() => filesAppend(null)}>
							<i>
								<img src={subirArchivo} alt="Icono de archivo" />
							</i>
							<span>Subir un Archivo</span>
						</button>
					) : (
						<button type='button' className='addFileButtonA' onClick={() => filesAppend(null)}>
							<span>+</span> Añadir
						</button>
					)}
					<div className="totalFiles">
						{selectedFileName.filter(name => name).length} archivos subidos
					</div>
					{
						filesFields.map((file, index) => (
							<div key={file.id} className='singleFileCard'>
								<div className='fileCardFile'>
									<label htmlFor={`files${index}`} className={selectedFileName[index]?.split('_')[1] || selectedFileName[index] ? "filesLoaded" : "filesNoLoaded"}>
										<span>{selectedFileName[index]?.split('_')[1] || selectedFileName[index] ? (<p className='check'>&#10004;</p>) : (<img src={iconFileUpload} alt="" />)}</span>
										<p>{selectedFileName[index]?.split('_')[1] || selectedFileName[index] || "Subir un archivo"}</p>
										<button className='deletebutton' type='button' onClick={() => {
											filesRemove(index);
											handleFileRemove(index);
										}}><img src={deleteIcon} alt="" /></button>
									</label>

									<input
										type="file"
										accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,video/*"
										id={`files${index}`}
										{...register(`archivos.${index}`)}
										onChange={(event) => handleFileChange(event, index)}
									/>
								</div>
							</div>
						))
					}
					<div className='Coments' style={{ display: showComments ? 'block' : 'none' }}>
						<label htmlFor="filesDescription">Comentarios</label>
						<div className='area'>
							<textarea
								className='pl'
								placeholder='Indica si quieres que vean algo en especial de tu archivo, por ejemplo: “leer de la página 16 a la 24”'
								id="filesDescription"
								{...register("descripcion")}
								value={commentValue}
								onChange={(e) => setCommentValue(e.target.value)}
							></textarea>
							<span className='commentIcon'><img src={comentario} alt="" /></span>
							<button
								className='deleteButtonC'
								type='button'
								onClick={handleCommentDelete}
							>
								<img src={deleteIcon} alt="" />
							</button>
						</div>
					</div>

				</div>
			</div>
			<div className='links'>
				<div className='linksInfo'>
					<div>
						<label htmlFor='linksArray'>
							Agrega información adicional
							<img src={adIcon} alt="" />
							<span>Anexa archivos que expongan mejor el reto</span>
						</label>
						<p>Tambien; puedes añadir links que complementen tu reto</p>
						<button type='button' onClick={() => linksAppend({ title: "", enlace: "" })}>
							<i>
								<img src={bx_link} alt="Icono de archivo" />
							</i>
							<span>Subir un link</span>
						</button>

					</div>
				</div>


				{
					linksFields.map((field, index) => {
						return (
							<div key={field.id} className='linksInputs'>
								<label htmlFor="linksTitle">Titula tu link  </label>
								<input
									type="text"
									id="linksTitle"
									autoComplete='off'
									placeholder='¿Como funcionan los BPO?'
									{...register(`links.${index}.title`)}
								/>
								<label htmlFor="linksLink">Agrega el link</label>
								<input
									type="text"
									id="linksLink"
									autoComplete='off'
									placeholder='Agregar enlace...'
									{...register(`links.${index}.enlace`, {
										pattern: {
											value: /^(ftp|http|https):\/\/[^ "]+$/,
											message: "El enlace no es valido"
										}
									})}

								/>
								<button type='button' onClick={() => linksRemove(index)}>
									<img src={deleteIcon} alt="" />
								</button>
								{errors?.[`links`]?.[index]?.[`enlace`]?.[`message`]}


							</div>
						);
					})
				}

			</div>


		</div>
	);
};

export { IdeaForm5 };