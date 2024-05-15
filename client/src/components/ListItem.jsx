import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className=''>
      <Link to={`/list/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className=''
        />
        <div className=''>
          <p className=''>
            {listing.name}
          </p>
          <div className=''>
            <MdLocationOn className='' />
            <p className=''>
              {listing.address}
            </p>
          </div>
          <p className=''>
            {listing.description}
          </p>
          <p className=''>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('pt-BR')
              : listing.regularPrice.toLocaleString('pt-BR')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className=''>
            <div className=''>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} camas `
                : `${listing.bedrooms} cama `}
            </div>
            <div className=''>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} banheiros `
                : `${listing.bathrooms} banheiro `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}