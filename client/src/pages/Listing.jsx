import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaMapMarkerAlt, FaBed, FaBath, FaCar, FaCouch, FaShareAlt } from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='p-3 max-w-4xl mx-auto'>
    {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
    {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
    {listing && !loading && !error && (
      <div>
        {/* Swiper for Images */}
        <Swiper navigation style={{ '--swiper-navigation-color': '#FFF', '--swiper-pagination-color': '#FFF' }}>
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  height: '550px',
                  filter: 'grayscale(100%)'
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
  
        {/* Share Button */}
        <div className='fixed top-[13%] right-[3%] z-10 bg-white shadow p-2 rounded-full' style={{color: '#333'}}>
          <FaShareAlt 
            className='text-lg cursor-pointer'
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          />
        </div>
        {copied && (
          <p className='fixed top-[23%] right-[5%] z-10 bg-white shadow p-2 rounded-md'>
            Link copied!
          </p>
        )}
  
        {/* Listing Details */}
        <div className='mt-10 p-4 bg-white shadow rounded-lg'>
          <h1 className='text-3xl font-bold'>{listing.name}</h1>
          <div className='text-gray-800 text-lg mt-2'>{listing.type === 'rent' ? 'For Rent' : 'For Sale'} - €{listing.offer ? listing.discountPrice.toLocaleString() : listing.regularPrice.toLocaleString()}{listing.type === 'rent' && ' / month'}</div>
          {listing.offer && <div className='mt-1 text-gray-600'>€{+listing.regularPrice - +listing.discountPrice} OFF</div>}
          
          <div className='mt-4'>
            <p className='text-gray-800'><FaMapMarkerAlt className='inline mr-2'/> {listing.address}</p>
            <p className='mt-4'>{listing.description}</p>
          </div>
  
          {/* Icons and Info */}
          <div className='flex items-center gap-4 mt-4'>
            <p><FaBed/> {listing.bedrooms} {listing.bedrooms > 1 ? 'Beds' : 'Bed'}</p>
            <p><FaBath/> {listing.bathrooms} {listing.bathrooms > 1 ? 'Baths' : 'Bath'}</p>
            <p><FaCar/> {listing.parking ? 'Parking available' : 'No Parking'}</p>
            <p><FaCouch/> {listing.furnished ? 'Furnished' : 'Unfurnished'}</p>
          </div>
  
       
      
        </div>
      </div>
    )}
  </main>
  

  );
}
