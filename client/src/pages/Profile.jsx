import React from 'react'
import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {

  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {setFileUploadError(true)},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  return (
    <form className='container mt-3'>
      <div className='row justify-content-center'>
        <div className='col-6 '>
          <h1 className='text-center'>Perfil</h1>
          <input
          onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
          <img className='rounded my-4 mx-auto d-block pe-auto' width="200" height="200" 
            onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' style={{ "hover": "pointer" }}/>
          <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              A imagem precisa ter tamanho inferior a 2 mb
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-success text-center'>Imagem carregada com sucesso!</span>
          ) : ('')}
        </p>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Novo Nome de usuário</label>
            <input type="text" className="form-control" id="exampleUserName" aria-describedby="userNameHelp"/>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Novo Email</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">Nós nunca iremos compartilhar o seu email com ninguém!</div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Nova Senha</label>
            <input type="password" className="form-control" id="exampleInputPassword1"/>
          </div>
          <div className='text-center'>
            <button type="submit" className="btn btn-primary mt-3 w-25">Atualizar</button>
          </div>
        </div>
      </div>
</form>
  )
}