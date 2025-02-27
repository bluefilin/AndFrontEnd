import './RetoForm.css';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { RetoForm1 } from '../RetoForm1/RetoForm1';
import { RetoForm2 } from '../RetoForm2/RetoForm2';
import { RetoForm3 } from '../RetoForm3/RetoForm3';
import { RetoForm4 } from '../RetoForm4/RetoForm4';
import { dataDecrypt } from '../../../util/encrypt';
import { postCreateReto } from '../../../services/reto.services';
import { postRetoFile } from '../../../services/reto.services';
import { putUpdateReto } from '../../../services/reto.services';
import { getNextStages } from '../../../services/reto.services';
import { postNewStage } from '../../../services/reto.services';
import { useNavigate } from 'react-router-dom';
import { RetoForm5 } from '../RetoForm5';
// import { postRetoFile } from '../../../services/reto.services';
import {SendModal} from "../SendModal"
import doubtFox from "../../../assets/img/doubtFox.png";
import sendedFox from "../../../assets/img/sendedFox.png";
import savedFox from "../../../assets/img/savedFox.png";
import redWarning from "../../../assets/icons/redWarning.svg"
import errorFox from "../../../assets/icons/Error.svg"
import { Comments } from '../../Comments/Comments';
import { putCreateComment } from '../../../services/reto.services';
const RetoForm = ({reto}) => {
	const [coAutorList, setCoAutorList] = useState([]);
	const [desafiadosList, setdesafiadosList] = useState([]);
  	const [desafiadosId, setdesafiadosId] = useState([]);
	const [coAutorId, setCoAutorId] = useState([]);
	const [isRequired, setIsRequired] = useState(false);
	const [showSendSave, setShowSendSave] = useState(true);
	const [getRetoId , setGetRetoId] = useState("");
	const [sendConfirmatioModal, setSendConfirmatioModal] = useState(false);
	const [sendDoneModal, setSendDoneModal] = useState(false);
	const [saveConfirmatioModal, setSaveConfirmatioModal] = useState(false);
	const [saveDoneModal, setSaveDoneModal] = useState(false);
	const [currentTab, setCurrentTab] = useState(1);
	const [requiredFields, setRequiredFields] = useState({
		titulo: false,
		problema: false,
		clientes: false,
		beneficioC: false,
		beneficioU: false,
	});	  

	useEffect(() => {
		setCoAutorId(coAutorList.map((coAutor)=>(coAutor._id)))
		setdesafiadosId(desafiadosList.map((desafiados) => desafiados._id));
	}, [coAutorList, desafiadosList]);

	const navigate = useNavigate();
	
	const { 
		register, 
		control,
		watch,
		handleSubmit,
		setValue,
		formState: {errors}
	} = useForm({
	  defaultValues: {
      titulo: reto?.titulo || "",
      problema: reto?.problema || "",
      clientes: reto?.clientes || "",
      usuarios: reto?.usuarios || "",
      beneficioU: reto?.beneficioU || "",
      beneficioC: reto?.beneficioC || "",
	  links:reto?.links || [{title:"", enlace:""}],
	  descripcion: reto?.descripcion || "",
      archivos: reto?.archivos || [],
		}
	});
	const { 
		fields:linksFields, 
		append:linksAppend, 
		remove:linksRemove 
	} = useFieldArray({
		name:"links",
		control
	})
	const { 
		fields:filesFields, 
		append:filesAppend, 
		remove:filesRemove 
	} = useFieldArray({
		name:"archivos",
		control
	})
	const user = dataDecrypt(sessionStorage.getItem("user"));
	const onSave = handleSubmit(async (data, e)=>{
		e.preventDefault();
		setIsRequired(false)
		const newData = {
      titulo: data.titulo,
      problema: data.problema,
      usuarios: data.usuarios,
      clientes: data.clientes,
      beneficioU: data.beneficioU,
      beneficioC: data.beneficioC,
	  coAutor:coAutorId,
	  desafiados: desafiadosId,
      usuario_id: user.id,
	  links:data.links,
	  descripcion: data.descripcion,
      
		}
		if(reto){
			const retoId = reto._id;
			setGetRetoId(retoId)
			try{
				await putUpdateReto(newData, retoId)		
				data.archivos.forEach(async file=>{
					if(typeof file[0] === 'object'){
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if(archivo.archivo !== undefined){
							await postRetoFile(archivo, retoId);
						}
					}
				});
				setSaveConfirmatioModal(false)
				setSaveDoneModal(true)
			}catch(err){console.log(err)}
		}else{
			if(data.titulo !== ""){
				try{
					const resCreateReto = await postCreateReto(newData);
          const retoId = resCreateReto._id;
					setGetRetoId(retoId)
					
					data.archivos.forEach(async file=>{
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if(archivo.archivo !== undefined){
							await postRetoFile(archivo, retoId);
						}
					});
					setSaveConfirmatioModal(false)
					setSaveDoneModal(true)
				}catch(err){console.log(err)}
			}
		}
	})
	const onSubmit = handleSubmit( async (data, e)=>{
		e.preventDefault();
		setIsRequired(true)
		const newData = {
			titulo: data.titulo,
			problema: data.problema,
			usuarios: data.usuarios,
			clientes: data.clientes,
			beneficioU: data.beneficioU,
			beneficioC: data.beneficioC,
			descripcion: data.descripcion,
			desafiados: desafiadosId,
			coAutor:coAutorId,
			links:data.links,
			usuario_id: user.id
		}
		if(data.titulo === "" 
		|| data.problema === "" 
		|| data.clientes === "" 
		|| data.beneficioC === ""
		|| data.beneficioU === ""
		){
			setShowSendSave(false) 
		 }else{
			if(reto){
				const retoId = reto._id;
				setGetRetoId(retoId)
				try{
				    await putUpdateReto(newData, retoId);
					const state = await getNextStages(retoId);    
					await postNewStage({estado:state[0].id_estado, reto:retoId});
					data.archivos.forEach(async file=>{
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if(archivo.archivo !== undefined){
							await postRetoFile(archivo, retoId);
						}
					});
					setSendConfirmatioModal(false)
					setSendDoneModal(true)

				}catch(err){console.log(err)}
			}else{
				try{
					const res = await postCreateReto(newData);
					setGetRetoId(res._id)
					const state = await getNextStages(res._id)
					await postNewStage({estado:state[0].id_estado, reto:res._id})
					
					data.archivos.forEach(async file=>{
						let archivo = {
							archivo: file[0],
							identificador: "archivo",
						}
						if(archivo.archivo !== undefined){
							await postRetoFile(archivo, res._id);
						}
					});
					setSendConfirmatioModal(false)
					setSendDoneModal(true)
				}
				catch(err){
					console.log(err)
				}
			}
		}
		
	})
	const reloadPage =()=>{
		navigate(`/reto/${getRetoId}`)
		window.location.reload();
	}
	const handleConfirmSend = handleSubmit( async (data, e)=>{
		if(
			data.titulo === "" 
		|| data.problema === "" 
		|| data.clientes === "" 
		|| data.beneficioC === ""
		|| data.beneficioU === ""
		){
			setRequiredFields({
				titulo: data.titulo === "",
				problema: data.problema === "",
				clientes: data.clientes === "",
				beneficioC: data.beneficioC === "",
				beneficioU: data.beneficioU === "",
			});
			setShowSendSave(false);
		}else{
			setSendConfirmatioModal(true)
		}
	})
	const closeConfirmSend = () => {
		setSendConfirmatioModal(false)
		setSaveConfirmatioModal(false)
	}
	const handleConfirmSave = handleSubmit( async (data, e)=>{
		if(
			data.titulo === "" 
		){
			setRequiredFields({
				titulo: data.titulo === "",
			});
			setShowSendSave(false)
		}else{
			setSaveConfirmatioModal(true)
		}
	})
	function switchTab(tabNumber) {
		setCurrentTab(tabNumber);
	}


	return (
		<div className='retoform'>
			<h3 className='titulo'>¡Queremos Escucharte!</h3>
			<p className='sub'>
				Convierte ese problema en un reto, desafía las posibilidades y dale la oportunidad a tus compañeros de utilizar esa creatividad en beneficio de todos.
			</p>
			<div className="subtitulo">
				<h3>¡Empecemos!</h3>
				<p>
					A continuación vas a encontrar unas preguntas que te ayudarán a estructurar mejorar tu reto. El orden en que aparecen es la sugerencia de como deberías responderlas; pero, si prefieres hacerlo de otra manera no hay problema 🙂
				</p>
				<a className="toolkitButton" href="https://innovacion.grupoasd.com.co/herramientas/" target="_blank">
					¡Apóyate del <b>Toolkit</b> para construir tu reto !
				</a>
			</div>
			
			<div className='tabs'>
				<div className='tab-buttons'>
					<button onClick={() => switchTab(1)} className={currentTab === 1 ? 'active' : ''}>
							¿De qué trata el reto? {(requiredFields.titulo || requiredFields.problema) && <img src={redWarning} alt="Icono de error" />}
					</button>

					<button onClick={() => switchTab(2)} className={currentTab === 2 ? 'active' : ''}>
						Beneficios {(requiredFields.beneficioC || requiredFields.beneficioU) && <img src={redWarning} alt="Icono de error" />}
					</button>
					<button onClick={() => switchTab(3)} className={currentTab === 3 ? 'active' : ''}>
						Desafiados
					</button>
					<button onClick={() => switchTab(4)} className={currentTab === 4 ? 'active' : ''}>
						Adjuntos
					</button>{reto && reto.seccionComentarios && reto.seccionComentarios.length > 0 && (
						<button onClick={() => switchTab(6)} className={currentTab === 6 ? 'active' : ''}>
							Comentarios
						</button>
					)}
				</div>
				
				<div className='tab-content'>
									<div className={`ideaform-form ${currentTab === 1 ? '' : 'none'}`}>
						<RetoForm1
							register={register}
							errors={errors}
							isRequired={isRequired}
							requiredFields={requiredFields}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 2 ? '' : 'none'}`}>
						<RetoForm2
							register={register}
							errors={errors}
							isRequired={isRequired}
							requiredFields={requiredFields}
						/>
						<RetoForm3
							register={register}
							errors={errors}
							isRequired={isRequired}
							requiredFields={requiredFields}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 3 ? '' : 'none'}`}>
						<RetoForm4
							setCoAutorList={setCoAutorList}
							setdesafiadosList={setdesafiadosList}
							reto={reto}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 4 ? '' : 'none'}`}>
						<RetoForm5
							register={register}
							linksFields={linksFields}
							linksAppend={linksAppend}
							linksRemove={linksRemove}
							filesFields={filesFields}
							filesAppend={filesAppend}
							filesRemove={filesRemove}
							errors={errors}
							watch={watch}
							reto={reto}
							setValue={setValue}
						/>
					</div>
					<div className={`ideaform-form ${currentTab === 6 ? '' : 'none'}`}>
						<Comments
							idea={reto}
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
							<button type="button" onClick={handleConfirmSend}>	
								Enviar
							</button>
						</div>
					):(
						<div className='errorMsn1'>
							<p>
								Tienes algunos campos obligatorios sin llenar 
								<img src={redWarning} alt="" />
							</p>
							<span onClick={()=>setShowSendSave(true)}>
								Revisar
							</span>
							<img src={errorFox} alt="" />
						</div>						
					)
				}
				{sendConfirmatioModal ? (
					<SendModal
						titulo={"¿Enviar reto? "}
						img={doubtFox}
						paragraf={"Si envías el reto, este pasara a estado validación innovación y no podrá ser editado."}
						btn1={"No, cancelar"}
						btn2={"Sí, enviar reto"} 
						fnct1={closeConfirmSend}
						fnct2={onSubmit}
					/>
				):""}	
				{sendDoneModal?(
					<SendModal
						titulo={"¡Se ha enviado tu reto! "}
						img={sendedFox}
						paragraf={"Tu reto está listo para ser revisado, en los próximos días puedes hacerle seguimiento a su avance."}
						btn2={"Entendido"}
						fnct2={reloadPage} 
					/>
				):""}
				{saveConfirmatioModal ? (
					<SendModal
						titulo={"¿Guardar reto?"}
						img={doubtFox}
						paragraf={"Guarda el reto, si quieres seguir editandolo "}
						btn1={"No, cancelar"}
						btn2={"Sí, guardar reto"}
						fnct1={closeConfirmSend}
						fnct2={onSave}
					/>
				):""}
				{saveDoneModal?(
					<SendModal
						titulo={"Tu reto ha sido guardado "}
						img={savedFox}
						paragraf={"Tu reto está lista para ser revisado, en los próximos días puedes hacerle seguimiento a su avance."}
						btn2={"Entendido"}
						fnct2={reloadPage}
					/>
				):""}
			
		</div>	
	);
};
export { RetoForm };