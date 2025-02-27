import './IdeaForm.css';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { IdeaForm1 } from '../IdeaForm1';
import { IdeaForm2 } from '../IdeaForm2';
import { IdeaForm3 } from '../IdeaForm3';
import { IdeaForm4 } from '../IdeaForm4';
import { IdeaForm5 } from '../IdeaForm5';
import { dataDecrypt } from '../../../util/encrypt';
import { postCreateIdea } from '../../../services/idea.services';
import { putUpdateIdea } from '../../../services/idea.services';
import { getNextStages } from '../../../services/estados.services';
import { postIdeaFile } from '../../../services/idea.services';
import { postNewStage } from '../../../services/estados.services';
import { SendModal } from "../SendModal"
import doubtFox from "../../../assets/img/doubtFox.png";
import sendedFox from "../../../assets/img/sendedFox.png";
import savedFox from "../../../assets/img/savedFox.png";
import errorFox from "../../../assets/icons/Error.svg";
import redWarning from "../../../assets/icons/redWarning.svg"
import { Comments } from '../../Comments/Comments';
import { useParams } from 'react-router-dom';
import { putCreateComment } from '../../../services/idea.services';
const IdeaForm = ({ idea }) => {

	const [coAutorList, setCoAutorList] = useState([]);
	const [productorList, setProductorList] = useState([]);
	const [coAutorId, setCoAutorId] = useState([]);
	const [productorId, setProductorId] = useState([]);
	const [isRequired, setIsRequired] = useState(false);
	const [showSendSave, setShowSendSave] = useState(true);
	const [getIdeaId, setGetIdeaId] = useState("");
	const [sendConfirmatioModal, setSendConfirmatioModal] = useState(false);
	const [sendDoneModal, setSendDoneModal] = useState(false);
	const [saveConfirmatioModal, setSaveConfirmatioModal] = useState(false);
	const [saveDoneModal, setSaveDoneModal] = useState(false);
	const [currentTab, setCurrentTab] = useState(1);
	const [queryId, setQueryId] = useState("");
	const [queryList, setQueryList] = useState([]);
	const [requiredFields, setRequiredFields] = useState({
		titulo: false,
		problema: false,
		clientes: false,
		beneficioC: false,
		beneficioU: false,
	});
	const { idReto } = useParams();
	useEffect(() => {
		setCoAutorId(coAutorList.map((coAutor) => (coAutor._id)))
		setProductorId(productorList.map((productor) => (productor._id)))
	}, [coAutorList, productorList])
	useEffect(() => {
		if (queryList.length > 0) {
			const firstObject = queryList[0];
			setQueryId(firstObject._id);
		}
	}, [queryList]);
	const navigate = useNavigate();




	const {
		register,
		control,
		watch,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm({
		defaultValues: {
			titulo: idea?.titulo || "",
			problema: idea?.problema || "",
			clientes: idea?.clientes || "",
			funcion: idea?.funcion || "",
			implementacion: idea?.implementacion || "",
			beneficioU: idea?.beneficioU || "",
			beneficioC: idea?.beneficioC || "",
			links: idea?.links || [{ title: "", enlace: "" }],
			pitch: idea?.pitch || "",
			archivos: idea?.archivos || [],
			descripcion: idea?.descripcion || "",
			toolkit: idea?.toolkit || "",
			toolkitArchivo: idea?.toolkitArchivo || "",
		}
	});
	const {
		fields: linksFields,
		append: linksAppend,
		remove: linksRemove
	} = useFieldArray({
		name: "links",
		control
	})
	const {
		fields: filesFields,
		append: filesAppend,
		remove: filesRemove
	} = useFieldArray({
		name: "archivos",
		control
	})

	const user = dataDecrypt(sessionStorage.getItem("user"));
	const onSave = handleSubmit(async (data, e) => {
		e.preventDefault();
		setIsRequired(false)
		const newData = {
			titulo: data.titulo,
			problema: data.problema,
			clientes: data.clientes,
			funcion: data.funcion,
			implementacion: data.implementacion,
			beneficioC: data.beneficioC,
			beneficioU: data.beneficioU,
			coAutor: coAutorId,
			productor: productorId,
			usuario_id: user.id,
			links: data.links,
			descripcion: data.descripcion,
			reto: queryId
		}
		if (idea) {
			const ideaId = idea._id;
			setGetIdeaId(ideaId)
			try {
				await putUpdateIdea(newData, ideaId)
				const dataPitch = {
					archivo: data.pitch[0],
					identificador: "pitch",
				};
				if (typeof dataPitch.archivo === 'object' && typeof dataPitch.archivo !== "string") {
					await postIdeaFile(dataPitch, ideaId);
				}
				const dataToolkit = {
					archivo: data.toolkitArchivo[0],
					identificador: "toolkit",
				}

				if (dataToolkit.archivo !== undefined && typeof dataPitch.archivo !== "string") {
					await postIdeaFile(dataToolkit, ideaId);
				}

				data.archivos.forEach(async file => {
					if (typeof file[0] === 'object') {
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if (archivo.archivo !== undefined && typeof dataPitch.archivo !== "string") {
							await postIdeaFile(archivo, ideaId);
						}
					}
				});
				setSaveConfirmatioModal(false)
				setSaveDoneModal(true)
			} catch (err) { console.log(err) }
		} else {
			if (data.titulo !== "") {
				try {
					const resCreateIdea = await postCreateIdea(newData);
					const ideaId = resCreateIdea._id;
					setGetIdeaId(ideaId)
					const dataPitch = {
						archivo: data.pitch[0],
						identificador: "pitch",
					};
					if (dataPitch.archivo !== undefined) {
						await postIdeaFile(dataPitch, ideaId);
					}
					const dataToolkit = {
						archivo: data.toolkitArchivo[0],
						identificador: "toolkit",
					}
					if (dataToolkit.archivo !== undefined) {
						await postIdeaFile(dataToolkit, ideaId);
					}
					data.archivos.forEach(async file => {
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if (archivo.archivo !== undefined) {
							await postIdeaFile(archivo, ideaId);
						}
					});
					setSaveConfirmatioModal(false)
					setSaveDoneModal(true)
				} catch (err) { console.log(err) }
			}
		}
	})
	const onSubmit = handleSubmit(async (data, e) => {
		e.preventDefault();
		setIsRequired(true)
		const newData = {
			titulo: data.titulo,
			problema: data.problema,
			clientes: data.clientes,
			funcion: data.funcion,
			implementacion: data.implementacion,
			beneficioC: data.beneficioC,
			beneficioU: data.beneficioU,
			coAutor: coAutorId,
			productor: productorId,
			usuario_id: user.id,
			links: data.links,
			descripcion: data.descripcion,
			reto: queryId
		}
		if (data.titulo === ""
			|| data.problema === ""
			|| data.clientes === ""
			|| data.funcion === ""
			|| data.implementacion === ""
			|| data.beneficioC === ""
			|| data.beneficioU === ""
		) {
			setShowSendSave(false)
		} else {
			if (idea) {
				const ideaId = idea._id;
				setGetIdeaId(ideaId)
				try {
					await putUpdateIdea(newData, ideaId)
					const state = await getNextStages(ideaId)
					await postNewStage({ estado: state[0].id_estado, idea: ideaId })
					const dataPitch = {
						archivo: data.pitch[0],
						identificador: "pitch",
					};
					if (dataPitch.archivo !== undefined && typeof dataPitch.archivo !== "string") {
						await postIdeaFile(dataPitch, ideaId);
					}
					const dataToolkit = {
						archivo: data.toolkitArchivo[0],
						identificador: "toolkit",
					}
					if (dataToolkit.archivo !== undefined && typeof dataToolkit.archivo !== "string") {
						await postIdeaFile(dataToolkit, ideaId);
					}
					data.archivos.forEach(async file => {
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if (archivo.archivo !== undefined && typeof archivo.archivo !== "string") {
							await postIdeaFile(archivo, ideaId);
						}
					});
					setSendConfirmatioModal(false)
					setSendDoneModal(true)

				} catch (err) { console.log(err) }
			} else {
				try {
					const res = await postCreateIdea(newData);
					setGetIdeaId(res._id)
					const state = await getNextStages(res._id)
					await postNewStage({ estado: state[0].id_estado, idea: res._id })
					const dataPitch = {
						archivo: data.pitch[0],
						identificador: "pitch",
					};

					if (dataPitch.archivo !== undefined) {
						await postIdeaFile(dataPitch, res._id);
					}
					const dataToolkit = {
						archivo: data.toolkitArchivo[0],
						identificador: "toolkit",
					}
					if (dataToolkit.archivo !== undefined) {
						await postIdeaFile(dataToolkit, res._id);
					}
					data.archivos.forEach(async file => {
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if (archivo.archivo !== undefined) {
							await postIdeaFile(archivo, res._id);
						}
					});
					setSendConfirmatioModal(false)
					setSendDoneModal(true)
				}
				catch (err) {
					console.log(err)
				}
			}
		}

	})
	const reloadPage = () => {
		console.log(getIdeaId)
		if (!!idea) {
			window.location.reload()

		} else {
			navigate(`/idea/${getIdeaId}`)
			window.location.reload()
		}
	}
	const handleConfirmSend = handleSubmit(async (data) => {
		if (
			data.titulo === ""
			|| data.problema === ""
			|| data.clientes === ""
			|| data.funcion === ""
			|| data.implementacion === ""
			|| data.beneficioC === ""
			|| data.beneficioU === ""
		) {
			setRequiredFields({
				titulo: data.titulo === "",
				problema: data.problema === "",
				clientes: data.clientes === "",
				funcion: data.funcion === "",
				implementacion: data.implementacion === "",
				beneficioC: data.beneficioC === "",
				beneficioU: data.beneficioU === "",
			});
			setShowSendSave(false)
		} else {
			setSendConfirmatioModal(true)
		}
	})
	const closeConfirmSend = () => {
		setSendConfirmatioModal(false)
		setSaveConfirmatioModal(false)
	}
	const handleConfirmSave = handleSubmit(async (data) => {
		if (
			data.titulo === ""
		) {
			setRequiredFields({
				titulo: data.titulo === "",
			});
			setShowSendSave(false)
		} else {
			setSaveConfirmatioModal(true)
		}
	})
	function switchTab(tabNumber) {
		setCurrentTab(tabNumber);
	}

	return (
		<div className='ideaform'>
			<h3 className='titulo'>¡Queremos Escucharte!</h3>
			<p className='sub'>
				Sabemos que las buenas ideas pueden ocurrir en cualquier lugar, por eso hemos creado este espacio para que entre todos las hagamos realidad
			</p>
			<div className="subtitulo">
				<h3>¡Empecemos!</h3>
				<p>
					A continuación vas a encontrar unas preguntas que te ayudarán a estructurar mejorar tu idea. El orden en que aparecen es la sugerencia de como deberías responderlas; pero, si prefieres hacerlo de otra manera no hay problema 🙂 
					
				</p>
				<a className="toolkitButton" href="https://innovacion.grupoasd.com.co/herramientas/" target="_blank">
					¡Apóyate del <b>Toolkit</b> para construir tu idea !
				</a>
			</div>

			<div className='tabs'>
				<div className='tab-buttons'>

						<button onClick={() => switchTab(1)} className={currentTab === 1 ? 'active' : ''}>
							¿De qué trata la idea? {(requiredFields.titulo || requiredFields.problema) && <img src={redWarning} alt="Icono de error" />}
						</button>
						<button onClick={() => switchTab(2)} className={currentTab === 2 ? 'active' : ''}>
							Detalles de la idea {(requiredFields.clientes || requiredFields.funcion || requiredFields.implementacion) && <img src={redWarning} alt="Icono de error" />}
						</button>
						<button onClick={() => switchTab(3)} className={currentTab === 3 ? 'active' : ''}>
							Beneficios {(requiredFields.beneficioC || requiredFields.beneficioU) && <img src={redWarning} alt="Icono de error" />}
						</button>
					<button onClick={() => switchTab(4)} className={currentTab === 4 ? 'active' : ''}>
						Participantes
					</button>
						<button onClick={() => switchTab(5)} className={currentTab === 5 ? 'active' : ''}>
							Adjuntos
						</button>
					{idea && idea.seccionComentarios && idea.seccionComentarios.length > 0 && (
						<button onClick={() => switchTab(6)} className={currentTab === 6 ? 'active' : ''}>
							Comentarios
						</button>
					)}

				</div>

				<div className='tab-content'>
					<div className={`ideaform-form ${currentTab === 1 ? '' : 'none'}`}>
						<IdeaForm1
							register={register}
							errors={errors}
							isRequired={isRequired}
							requiredFields={requiredFields}
							setQueryList={setQueryList}
							idea={idea}
							idReto={idReto}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 2 ? '' : 'none'}`}>
						<IdeaForm2
							register={register}
							errors={errors}
							isRequired={isRequired}
							requiredFields={requiredFields}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 3 ? '' : 'none'}`}>
						<IdeaForm3
							register={register}
							errors={errors}
							isRequired={isRequired}
							requiredFields={requiredFields}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 4 ? '' : 'none'}`}>
						<IdeaForm4
							setCoAutorList={setCoAutorList}
							setProductorList={setProductorList}
							idea={idea}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 5 ? '' : 'none'}`}>
						<IdeaForm5
							register={register}
							linksFields={linksFields}
							linksAppend={linksAppend}
							linksRemove={linksRemove}
							filesFields={filesFields}
							filesAppend={filesAppend}
							filesRemove={filesRemove}
							errors={errors}
							watch={watch}
							idea={idea}
							setValue={setValue}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 6 ? '' : 'none'}`}>
						<Comments 
						idea={idea} 
							putCreateComment={putCreateComment}
						/>
					</div>
				</div>
			</div>
			{
				showSendSave ? (
					<div className='buttonsEnd'>
						<button onClick={handleConfirmSave}>
							Guardar
						</button>
						<button onClick={handleConfirmSend}>
							Enviar
						</button>
					</div>
				) : (
					<div className='errorMsn1'>
						<p>
							Tienes algunos campos obligatorios sin llenar
							<img src={redWarning} alt="" />
						</p>
						<span onClick={() => setShowSendSave(true)}>
							Revisar
						</span>
						<img src={errorFox} alt="" />
					</div>

				)
			}
			{sendConfirmatioModal ? (
				<SendModal
					titulo={"¿Enviar idea? "}
					img={doubtFox}
					paragraf={"Si envias la idea, esta pasara a estado validación innovación y no podrá ser editada."}
					btn1={"No, cancelar"}
					btn2={"Sí, enviar idea"}
					fnct1={closeConfirmSend}
					fnct2={onSubmit}
				/>
			) : ""}
			{sendDoneModal ? (
				<SendModal
					titulo={"¡Se ha enviado tu idea! "}
					img={sendedFox}
					paragraf={"Tu idea está lista para ser revisada, en los próximos días puedes hacerle seguimiento a su avance."}
					btn2={"Entendido"}
					fnct2={reloadPage}
				/>
			) : ""}
			{saveConfirmatioModal ? (
				<SendModal
					titulo={"¿Guardar idea?"}
					img={doubtFox}
					paragraf={"Guarda la idea, si quieres seguir editandola "}
					btn1={"No, cancelar"}
					btn2={"Sí, guardar idea"}
					fnct1={closeConfirmSend}
					fnct2={onSave}
				/>

			) : ""}
			{saveDoneModal ? (
				<SendModal
					titulo={"Tu idea ha sido guardada "}
					img={savedFox}
					paragraf={"Tu idea está lista para ser revisada, en los próximos días puedes hacerle seguimiento a su avance."}
					btn2={"Entendido"}
					fnct2={reloadPage}
				/>
			) : ""}

		</div>
	);
};
export { IdeaForm };