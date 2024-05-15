import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '../components/ListItem';

export default function Research() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className=''>
      <div className=''>
        <form  onSubmit={handleSubmit} className=''>
          <div className=''>
            <label className=''>Termo de busca</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className=''
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className=''>
            <label className=''>Type:</label>
            <div className=''>
              <input type='checkbox' id='all' className='' onChange={handleChange} checked={sidebardata.type === 'all'}/>
              <span>Vendas e Aluguéis</span>
            </div>
            <div className=''>
              <input type='checkbox' id='rent' className='' onChange={handleChange} checked={sidebardata.type === 'rent'}/>
              <span>Aluguel</span>
            </div>
            <div className=''>
              <input type='checkbox' id='sale' className='' onChange={handleChange} checked={sidebardata.type === 'sale'}/>
              <span>Venda</span>
            </div>
            <div className=''>
              <input type='checkbox' id='offer' className='' onChange={handleChange} checked={sidebardata.offer}/>
              <span>Oferta</span>
            </div>
          </div>
          <div className=''>
            <label className=''>Amenidades:</label>
            <div className=''>
              <input type='checkbox' id='parking' className='' onChange={handleChange} checked={sidebardata.parking}/>
              <span>Estacionamento</span>
            </div>
            <div className=''>
              <input type='checkbox' id='furnished' className='' onChange={handleChange} checked={sidebardata.furnished}/>
              <span>Mobiliado</span>
            </div>
          </div>
          <div className=''>
            <label className=''>Organizar</label>
            <select id='sort_order' className='' onChange={handleChange} defaultValue={'created_at_desc'}>
              <option>Preço decrescente</option>
              <option>Preço crescente</option>
              <option>Mais recente</option>
              <option>Mais antigo</option>
            </select>
          </div>
          <button className=''>
            Buscar
          </button>
        </form>
      </div>
      <div className=''>
        <h1 className=''>Resultados:</h1>
        <div className=''>
          {!loading && listings.length === 0 && (
            <p className=''>Nenhuma listagem encontrada</p>
          )}
          {loading && (
            <p className=''>
              Carregando...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
}