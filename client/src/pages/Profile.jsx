import React from 'react'
import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  console.log(formData)

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {

    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  }

  return (
    <form onSubmit={handleSubmit} className='container mt-3'>
      <div className='row justify-content-center'>
        <div className='col-6 '>
          <h1 className='text-center'>Perfil</h1>

          <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />

          <img className='rounded my-4 mx-auto d-block pe-auto' width="200" height="200" 
            onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile'/>

          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className=''>
                A imagem precisa ter tamanho inferior a 2 mb
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-success text-center'>Imagem carregada com sucesso!</span>
            ) : ('')}
          </p>

          <div className="mb-3">
            <label htmlFor="exampleInputName1" className="form-label">Novo Nome de usuário</label>
            <input defaultValue={currentUser.username} onChange={handleChange} 
             type="text" className="form-control" id="username" aria-describedby="userNameHelp"/>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Novo Email</label>
            <input defaultValue={currentUser.email} onChange={handleChange} 
             type="email" className="form-control" id="email" aria-describedby="emailHelp"/>
            <div className="form-text">Nós nunca iremos compartilhar o seu email com ninguém!</div>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword" className="form-label">Nova Senha</label>
            <input onChange={handleChange} type="password" className="form-control" id="password"/>
          </div>

          <div className='text-center'>
            <button type="submit" className="btn btn-primary mt-3 w-25">Atualizar</button>
          </div>

          <div className='flex justify-between mt-5'>
            <span onClick={handleDeleteUser} className='btn btn-danger'>Deletar conta</span>
            <span onClick={handleSignOut} className='btn'>Sair</span>
            <p>{error ? error : ''}</p>
            <p>
              {updateSuccess ? 'Usuário atualizado com sucesso!' : ''}
            </p>
          </div>
        </div>
      </div>  
    </form>
  )
}