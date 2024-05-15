import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
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
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/server/list/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

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
          setImageUploadError('Falha no upload da imagem (max de 2mb por imagem');
          setUploading(false);
        });
    } else {
      setImageUploadError('Você só pode fazer upload de até 6 imagens por listagem');
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
          console.log(`Progresso do upload em ${progress}%`);
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

  const handleChange = (e) => {
    if (e.target.id === 'sell' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'
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
        return setError('Você deve fazer upload de pelo menos uma imagem');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Preço com desconto deve ser menor do que o preço normal');
      setLoading(true);
      setError(false);
      const res = await fetch(`/server/list/update/${params.listingId}`, {
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
      navigate(`/list/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className=''>
      <h1 className=''>
        Atualizar uma listagem
      </h1>
      <form onSubmit={handleSubmit} className=''>
        <div className=''>
          <input
            type='text'
            placeholder='Name'
            className=''
            id='name'
            minLength='10'
            maxLength='62'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className=''
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className=''
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className=''>
            <div className=''>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sell'}
              />
              <span>Vender</span>
            </div>
            <div className=''>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Alugar</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className=''
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Vaga de estacionamento</span>
            </div>
            <div className=''>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Mobiliado</span>
            </div>
            <div className=''>
              <input
                type='checkbox'
                id='offer'
                className=''
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Oferta</span>
            </div>
          </div>
          <div className=''>
            <div className=''>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className=''
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Camas</p>
            </div>
            <div className=''>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className=''
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Banheiros</p>
            </div>
            <div className=''>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className=''
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className=''>
                <p>Preço Normal</p>
                <span className=''>(R$ / mês)</span>
              </div>
            </div>
            {formData.offer && (
              <div className=''>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className=''
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className=''>
                  <p>Preço com desconto</p>
                  <span className=''>(R$ / mês)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=''>
          <p className=''>
            Imagens:
            <span className=''>
              A primeira imagem será a de capa (max 6)
            </span>
          </p>
          <div className=''>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className=''
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className=''
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className=''>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
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
            {loading ? 'Updating...' : 'Update listing'}
          </button>
          {error && <p className=''>{error}</p>}
        </div>
      </form>
    </main>
  );
}