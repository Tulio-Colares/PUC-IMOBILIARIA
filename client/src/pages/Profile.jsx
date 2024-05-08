import React from 'react'
import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';


export default function Profile() {

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
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

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

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

          <div className='text-center mb-4'>
            <button type="submit" className="btn btn-primary mt-3 w-25">Atualizar</button>
          </div>

          <div className="text-center mb-3">
            <Link className='btn btn-success w-25' to={"/create-list"}>
              Criar lista
            </Link>
          </div>

          <div className='text-center mb-3 ' >
            <span onClick={handleDeleteUser} className='btn btn-danger w-25 mx-3'>Deletar conta</span>
            <span onClick={handleSignOut} className='btn btn-secondary w-25 mx-3'>Sair</span>
          </div>

          <div className="text-center mb-3">
            <p>{error ? error : ''}</p>
              <p>
                {updateSuccess ? 'Usuário atualizado com sucesso!' : ''}
              </p>

              <button onClick={handleShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>

      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button className='text-red-700 uppercase'>Delete</button>
                <button className='text-green-700 uppercase'>Edit</button>
              </div>
            </div>
          ))}
        </div>}
          </div>

        </div>
      </div>  
    </form>
  )
}