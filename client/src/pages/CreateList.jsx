import React from 'react'
import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateList() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className='container text-center mt-3'>
        <div className="row ">
            <h1 className='mb-3'>Criando uma listagem</h1>
            <div className='col' >

                {/* Dados básicos */}
                <input 
                  placeholder='Nome' 
                  id='name'
                  onChange={handleChange}
                  value={formData.name} 
                  className='w-100 mb-2 rounded' 
                  type="text"   
                  minLength='5'
                  maxLength='10' required
                />
                <textarea 
                  placeholder='Descrição'
                  id="description"
                  onChange={handleChange}
                  value={formData.description}
                  className='w-100 mb-2 rounded' 
                  type="text"  
                  rows='5'  required
                />
                <input 
                  placeholder='Endereço' 
                  id='address' 
                  onChange={handleChange}
                  value={formData.address}
                  className='w-100 rounded' 
                  type="text"  required
                />

                {/* Dados do Imóvel */}
                <div className='d-flex'>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange} checked={formData.type === 'rent'} className="form-check-input" type="checkbox" role="switch" id="rent"/>
                        <label className="form-check-label" htmlFor="rent">Alugar</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange} checked={formData.type === 'sell'} className="form-check-input" type="checkbox" role="switch" id="sell"/>
                        <label className="form-check-label" htmlFor="sell">Vender</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange} checked={formData.parking} className="form-check-input" type="checkbox" role="switch" id="parkingSpots"/>
                        <label className="form-check-label" htmlFor="parkingSpots">Vaga de garagem</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange} checked={formData.furnished} className="form-check-input" type="checkbox" role="switch" id="furnished"/>
                        <label className="form-check-label" htmlFor="furnished">Mobiliado</label>
                    </div>
                </div>
                <div class="form-check form-switch text-start m-4">
                    <input onChange={handleChange} checked={formData.offer} className="form-check-input" type="checkbox" role="switch" id="Offer"/>
                    <label className="form-check-label" htmlFor="Offer">Oferta</label>
                </div>

                {/* Dados a serem preenchidos */}
                <div className='d-flex '>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange} value={formData.bedrooms} className="form-input mx-1" type="number" id="Bedrooms" style={{ width: "50px" }}/>
                        <label className="form-label" htmlFor="CheckDefault">Quartos</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange} value={formData.bathrooms} className="form-input mx-1" type="number" id="bathrooms" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Banheiros</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange}
                          value={formData.regularPrice}
                          min='50' 
                          max='1000000' 
                          className="form-input mx-1" 
                          type="number" 
                          id="rentValue" 
                          style={{ width: "50px" }}
                        />
                        {formData.type === 'rent' && (
                          <span className='form-check-label'>($ / month)</span>
                        )}
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input onChange={handleChange}
                          value={formData.discountPrice}
                          className="form-input mx-1" 
                          type="number" 
                          id="rentDiscounted" 
                          style={{ width: "50px" }}
                        />
                         {formData.type === 'rent' && (
                          <span className='form-check-label'>($ / month)</span>
                        )}
                    </div>
                </div>

            </div>
            <div className="col">
                <p className=''>Imagens: 
                <span className=''>A primeira imagem será a capa (max 6)</span>
                </p>
                <div className=''>
                    <input className='' type="file" id='images' accept='image/*' multiple onChange={(e) => setFiles(e.target.files)}/>
                    <button className=''  type='button' disabled={uploading} onClick={handleImageSubmit}>Upload</button>
                </div>
                <button className=''>Criar Lista</button>
                {uploading ? 'Uploading...' : 'Upload'}

                <p className=''>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className=''
              >
                <img
                  src={url}
                  alt='listing image'
                  className=''
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className=''
                >
                  Deletar
                </button>
              </div>
            ))}
            <button
              disabled={loading || uploading}
              className=''
            >
              {loading ? 'Creating...' : 'Create listing'}
            </button>
            {error && <p className=''>{error}</p>}
          </div>
        </div>
    </form>
  )
}
