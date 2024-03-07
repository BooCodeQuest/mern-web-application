import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
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
  <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
    <h1 className='font-bold text-3xl lg:text-6xl' style={{ color: '#333' }}>
      Discover Your Ideal Space
    </h1>
    <div className='text-xs sm:text-sm' style={{ color: '#666' }}>
      Explore Berlin Apartments - Your gateway to contemporary living spaces.
    </div>
  </div>
  {/* listing results for offer, sale and rent */}
  <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
    {offerListings && offerListings.length > 0 && (
      <div>
        <div className='my-3'>
          <h2 className='text-2xl font-semibold' style={{ color: '#333' }}>Featured Offers</h2>
          <Link className='text-sm hover:underline' to={'/search?offer=true'} style={{ color: '#333' }}>View all offers</Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {offerListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}
    {rentListings && rentListings.length > 0 && (
      <div>
        <div className='my-3'>
          <h2 className='text-2xl font-semibold' style={{ color: '#333' }}>Properties for Rent</h2>
          <Link className='text-sm hover:underline' to={'/search?type=rent'} style={{ color: '#333' }}>View rental properties</Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {rentListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}
    {saleListings && saleListings.length > 0 && (
      <div>
        <div className='my-3'>
          <h2 className='text-2xl font-semibold' style={{ color: '#333' }}>Properties for Sale</h2>
          <Link className='text-sm hover:underline' to={'/search?type=sale'} style={{ color: '#333' }}>View properties for sale</Link>
        </div>
        <div className='flex flex-wrap gap-4'>
          {saleListings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))}
        </div>
      </div>
    )}
  </div>
</div>
  )}
  