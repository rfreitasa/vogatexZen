import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { API } from '../../config/api';
import { toast } from "react-toastify";


import './styles.css';

export function Dropzone(props)  {
    const fileInputRef = useRef();
    const modalImageRef = useRef();
    const modalRef = useRef();
    const progressRef = useRef();
    const uploadRef = useRef();
    const uploadModalRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const token = sessionStorage.getItem('token');

 
    useEffect(() => {
        if(props.files_svd.length > 0){
            setSelectedFiles(props.files_svd);
        }
    }, []);

    useEffect(() => {
        let filteredArr = selectedFiles.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
              return acc.concat([current]);
            } else {
                //console.log(acc);
                return acc;
            }
        
        }, []);
        props.parentFiles(filteredArr);
        setValidFiles([...filteredArr]);
        
    }, [selectedFiles]);

    const preventDefault = (e) => {
        e.preventDefault();
        // e.stopPropagation();
    }

    const dragOver = (e) => {
        preventDefault(e);
    }

    const dragEnter = (e) => {
        preventDefault(e);
    }

    const dragLeave = (e) => {
        preventDefault(e);
    }

    const fileDrop = (e) => {
        preventDefault(e);
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
    }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const handleFiles = (files) => {
        for(let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                
                //props.parentFiles(files);
                console.log(selectedFiles);
            } else {
                files[i]['invalid'] = true;
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                console.log(selectedFiles);
                setErrorMessage('Tipo Não permitido');
                setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
            }
        }
    }

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png','doc/docx', 'image/gif', 'image/x-icon','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/docx','application/pdf','text/plain','application/msword','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }

        return true;
    }

    const fileSize = (size) => {
        if (size === 0) {
          return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = async (name) => {
        var answer = window.confirm(
            "Tem certeza que deseja excluir esse arquivo?"
          );
          if (answer) {
                    
                        const index = validFiles.findIndex(e => e.name === name);
                        const index2 = selectedFiles.findIndex(e => e.name === name);
                        const index3 = unsupportedFiles.findIndex(e => e.name === name);
                        validFiles.splice(index, 1);
                        selectedFiles.splice(index2, 1);
                        setValidFiles([...validFiles]);
                        setSelectedFiles([...selectedFiles]);
                        if (index3 !== -1) {
                            unsupportedFiles.splice(index3, 1);
                            setUnsupportedFiles([...unsupportedFiles]);
                        }

                        if(props.edit===true){
                            //edit true - remove from server  
                                console.log(`${API.cliente_files_delete}/${props.id}/${name}`)
                                try {
                                    const response = await axios.delete(
                                            `${API.cliente_files_delete}/${props.id}/${name}`,
                                            {
                                                headers: {
                                                    "x-access-token": token
                                                }
                                            }
                                        );
                                    if(response.status==204){
                                            toast.error("Não foi possível remover seu arquivo.");
                                    }else{
                                            toast.success("Arquivo removido com sucesso.");
                                    }
                                } catch (err) {
                                    toast.error("Ocorreu algum erro!");
                                }
                            }
          }
        
    }

    const openImageModal = (file) => {


        const reader = new FileReader();
        modalRef.current.style.display = "block";
        console.log(file);

        reader.readAsDataURL(file);
        reader.onload = function(e) {
                    
                const link = document.createElement('a');
                link.href = e.target.result;
                link.setAttribute('download', file.name);
                document.body.appendChild(link);// Append to html page
                link.click();//Force download
                link.parentNode.removeChild(link);//Clean up and remove the link

                /*
                console.log(e.target.result);
                modalImageRef.current.style.backgroundImage = `url(${e.target.result})`;                
                window.open(e.target.result);
                */
        }
    }

    const closeModal = () => {
        modalRef.current.style.display = "none";
        modalImageRef.current.style.backgroundImage = 'none';
    }

    const uploadFiles = async () => {
        uploadModalRef.current.style.display = 'block';
        uploadRef.current.innerHTML = 'Salvando arquivos...';
        for (let i = 0; i < validFiles.length; i++) {
            const formData = new FormData();
            formData.append('image', validFiles[i]);
            formData.append('key', '');

            axios.post('https://apissss.imgbb.com/1/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    progressRef.current.innerHTML = `${uploadPercentage}%`;
                    progressRef.current.style.width = `${uploadPercentage}%`;

                    if (uploadPercentage === 100) {
                        uploadRef.current.innerHTML = 'File(s) Uploaded';
                        validFiles.length = 0;
                        setValidFiles([...validFiles]);
                        setSelectedFiles([...validFiles]);
                        setUnsupportedFiles([...validFiles]);
                    }
                },
            })
            .catch(() => {
                uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
                progressRef.current.style.backgroundColor = 'red';
            })
        }
    }

    const closeUploadModal = () => {
        uploadModalRef.current.style.display = 'none';
    }


    return (
        <>
            <div className="containerfile">
            {/*    {unsupportedFiles.length === 0 && validFiles.length ? <button className="file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button> : ''} 
            */} 
               {unsupportedFiles.length ? <p>Remova os arquivos com formato não suportados.</p> : ''}
              
            <div className="drop-container"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={fileInputClicked}
                >
                    <div className="drop-message">
                        Clique ou arraste seus arquivos aqui.
                    </div>
                    <input
                        ref={fileInputRef}
                        className="file-input"
                        type="file"
                        multiple
                        onChange={filesSelected}
                    />
                </div>
                <div className="file-display-container" style={{height:"auto"}}>
                    {
                        validFiles.map((data, i) => 
                            <div className="file-status-bar" key={i}>
                                <div onClick={!data.invalid ? () => openImageModal(data) : () => removeFile(data.name)}>
                                    <div className="file-type-logo"></div>
                                    <div className="file-type">{fileType(data.name)}</div>
                                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                                </div>
                                <div className="file-remove" onClick={() => removeFile(data.name)}><DeleteIcon/></div>
                                 <div className="file-download" onClick={() => openImageModal(data)}><CloudDownloadIcon/></div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="modal" ref={modalRef}>
            </div>

            <div className="upload-modal" ref={uploadModalRef}>
                <div className="overlay"></div>
                <div className="close" onClick={(() => closeUploadModal())}>X</div>
                <div className="progress-container">
                    <span ref={uploadRef}></span>
                    <div className="progress">
                        <div className="progress-bar" ref={progressRef}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dropzone;












/*import React, { Component } from "react";

import Dropzone from "react-dropzone";

import { DropContainer, UploadMessage } from "./styles";

export default class Upload extends Component {
  renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <UploadMessage>Arraste arquivos aqui...</UploadMessage>;
    }

    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
    }

    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>;
  };

  render() {
    const { onUpload } = this.props;

    return (
      <Dropzone accept="image/*" onDropAccepted={onUpload}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <DropContainer
            {...getRootProps()}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
          >
            <input {...getInputProps()} />
            {this.renderDragMessage(isDragActive, isDragReject)}
          </DropContainer>
        )}
      </Dropzone>
    );
  }
}*/