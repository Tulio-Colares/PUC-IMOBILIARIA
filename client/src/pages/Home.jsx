import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListItem from '../components/ListItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/server/listing/getToken?offer=true&limit=6');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/server/listing/getToken?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/server/listing/getToken?type=sale&limit=6');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 text-center max-w-6xl mx-auto'>
        <h1 className='text-slate-500 font-bold text-3xl lg:text-6xl'>
          Seja para morar ou alugar, 
          <br />
          aqui você encontra 
          <br />
          <span className='text-slate-700'>O lugar perfeito</span>
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          PUC Imóveis é o melhor lugar para encontrar o imóvel ideal para você
          <br />
          Nós temos uma ampla oferta de propriedades residenciais e comerciais
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Venha conferir!
        </Link>
        <p className='mt-5 text-slate-700'><strong><i>Atenção! Este é um site puramente acadêmico. Nenhum dos imóveis apresentados aqui é real!</i></strong></p>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[700px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3 text-center'>
              <h2 className='text-2xl font-semibold text-slate-600'>Ofertas Recentes</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Mostrar mais ofertas</Link>
            </div>
            <div className='flex flex-wrap gap-4 justify-center xl:justify-start'>
              {offerListings.map((listing) => (
                <ListItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3 text-center'>
              <h2 className='text-2xl font-semibold text-slate-600'>Para Alugar</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Mostrar mais lugares para alugar</Link>
            </div>
            <div className='flex flex-wrap gap-4 justify-center xl:justify-start'>
              {rentListings.map((listing) => (
                <ListItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3 text-center'>
              <h2 className='text-2xl font-semibold text-slate-600'>Para comprar</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Mostrar mais lugares para comprar</Link>
            </div>
            <div className='flex flex-wrap gap-4 justify-center xl:justify-start'>
              {saleListings.map((listing) => (
                <ListItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
