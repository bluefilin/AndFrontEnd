import { useState, useEffect } from 'react';
import './RetoForm5.css';
import iconFileUpload from "../../../assets/icons/upLoadFile.svg";
import deleteIcon from "../../../assets/icons/delete.svg";
import adIcon from "../../../assets/icons/adIcon.svg"
import comentario from "../../../assets/icons/comment.svg"
import bx_link from "../../../assets/icons/bx_link.svg"
import subirArchivo from "../../../assets/icons/subirArchivo.svg"

const RetoForm5 = ({ register, linksFields, linksAppend, linksRemove, errors, filesFields, filesAppend, filesRemove, reto, setValue}) => {
    
    const [selectedFileName, setSelectedFileName] = useState(reto?.archivos.map((file) => file) || []);
    const [commentValue, setCommentValue] = useState(reto?.descripcion || "");
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (reto && reto.links) {
            reto.links.forEach((link, index) => {
                setValue(`links.${index}.title`, link.title);
                setValue(`links.${index}.enlace`, link.enlace);
            });
        }
    }, [reto, setValue]);

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
        <div className='retoform5'>
            <div className='column'>
                <div className='filesCards1'>
                    <label>
                        Agrega imágenes, videos o documentos 
                        <img src={adIcon} alt="" />
                        <span>Anexa archivos que expongan mejor el reto</span>
                    </label>
                    <p>Recuerda subirlos con un nombre descriptivo</p>
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
                    <div className="totalFiles1">
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
                <div className='links1'>
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
                                    <label htmlFor="linksTitle">Titula el link</label>
                                    <input
                                        type="text"
                                        id="linksTitle"
                                        autoComplete='off'
                                        placeholder='¿Cómo funcionan los BPO?'
                                        {...register(`links.${index}.title`)}
                                    //  onChange={(event) => handleLinksTitleChange(event, index)}
                                    />
                                    {/* <span>{linksTitleCharacterCount}/{maxLinksTitleChars}</span> */}
                                    <label htmlFor="linksLink">Agrega el link</label>
                                    <input
                                        type="text"
                                        id="linksLink"
                                        autoComplete='off'
                                        placeholder='¿Cómo funcionan los BPO?'
                                        {...register(`links.${index}.enlace`, {
                                            pattern: {
                                                value: /^(ftp|http|https):\/\/[^ "]+$/,
                                                message: "El enlace no es válido"
                                            }
                                        })
                                        }
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
        </div>
    );
};

export { RetoForm5 };
