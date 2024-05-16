import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/server/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
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
    <div>
      <h1>
        Encontre o Lugar ideal para você!
      </h1>
      <div>
        Encontre com facilidade o que você desejar
        <br />
        Várias opções de imóveis para comprar e alugar, seja para morar, lazer ou uso profissional, tudo em um só lugar!
      </div>
      <Link
        to={'/search'}
      >
        Vamos começar
      </Link>
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
              key={listing._id}
            ></div>
          </SwiperSlide>
        ))}
    </Swiper>

    <div>
      {offerListings && offerListings.length > 0 && (
        <div >
          <div >
            <h2>Ofertas recentes</h2>
            <Link to={'/search?offer=true'}>Mostrar mais ofertas</Link>
          </div>
          <div>
            {offerListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}
      {rentListings && rentListings.length > 0 && (
        <div>
          <div>
            <h2>Locais recentes para alugar</h2>
            <Link to={'/search?type=rent'}>Mostrar mais</Link>
          </div>
          <div >
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}
      {saleListings && saleListings.length > 0 && (
        <div>
          <div>
            <h2>Ofertas de aluguel recentes</h2>
            <Link to={'/search?type=sale'}>Mostrar mais opções à venda</Link>
          </div>
          <div>
            {saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}