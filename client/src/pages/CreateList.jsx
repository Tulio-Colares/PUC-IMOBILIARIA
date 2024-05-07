import React from 'react'
import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';

export default function CreateList() {
    const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <section className='container text-center mt-3'>
        <div className="row ">
            <h1 className='mb-3'>Criando uma listagem</h1>
            <div className='col' >

                {/* Dados básicos */}
                <input className='w-100 mb-2 rounded' type="text" placeholder='Nome' id='name' maxLength='10' minLength='50' required/>
                <textarea className='w-100 mb-2 rounded' type="text" placeholder='Description' rows='5' id="description" required/>
                <input className='w-100 rounded' type="text" placeholder='Endereço' id='address' required/>

                {/* Dados do Imóvel */}
                <div className='d-flex'>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="rent"/>
                        <label className="form-check-label" htmlFor="rent">Alugar</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="sell"/>
                        <label className="form-check-label" htmlFor="sell">Vender</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="parkingSpots"/>
                        <label className="form-check-label" htmlFor="parkingSpots">Vaga de garagem</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-check-input" type="checkbox" role="switch" id="furnished"/>
                        <label className="form-check-label" htmlFor="furnished">Mobiliado</label>
                    </div>
                </div>
                <div class="form-check form-switch text-start m-4">
                    <input className="form-check-input" type="checkbox" role="switch" id="Offer"/>
                    <label className="form-check-label" htmlFor="Offer">Oferta</label>
                </div>

                {/* Dados a serem preenchidos */}
                <div className='d-flex '>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="Bedrooms" style={{ width: "50px" }}/>
                        <label className="form-label" htmlFor="CheckDefault">Quartos</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="bathrooms" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Banheiros</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="rentValue" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Preço Padrão (R$/mês)</label>
                    </div>
                    <div class="form-check form-switch text-start m-4">
                        <input className="form-input mx-1" type="number" id="rentDiscounted" style={{ width: "50px" }}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Desconto (R$/mês)</label>
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

                <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button className=''>
            Criar listagem
          </button>
            </div>
        </div>
    </section>
  )
}
