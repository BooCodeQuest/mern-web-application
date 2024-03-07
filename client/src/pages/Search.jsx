import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
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
  const [showMore, setShowMore] = useState(false);

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
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
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

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='max-w-6xl mx-auto my-8'>
    {/* Search Form */}
    <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
      <h2 className='text-2xl font-semibold mb-4'>Search Filters</h2>
      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <input
          type='text'
          id='searchTerm'
          placeholder='Search...'
          className='border-2 rounded-lg p-3'
          value={sidebardata.searchTerm}
          onChange={handleChange}
        />
        <div className='col-span-2 lg:col-span-1 flex flex-wrap gap-2 items-center justify-start'>
          {['all', 'rent', 'sale'].map(type => (
            <label key={type} className='flex items-center gap-2'>
              <input
                type='checkbox'
                id={type}
                className='w-5 h-5'
                onChange={handleChange}
                checked={sidebardata.type === type || sidebardata[type]}
              />
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </label>
          ))}
        </div>
        <div className='flex flex-wrap gap-2 items-center'>
          {['parking', 'furnished'].map(amenity => (
            <label key={amenity} className='flex items-center gap-2'>
              <input
                type='checkbox'
                id={amenity}
                className='w-5 h-5'
                onChange={handleChange}
                checked={sidebardata[amenity]}
              />
              <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
            </label>
          ))}
        </div>
        <select
          onChange={handleChange}
          defaultValue={'created_at_desc'}
          id='sort_order'
          className='border-2 rounded-lg p-3'
        >
          <option value='regularPrice_desc'>Price high to low</option>
          <option value='regularPrice_asc'>Price low to high</option>
          <option value='createdAt_desc'>Latest</option>
          <option value='createdAt_asc'>Oldest</option>
        </select>
        <button className='col-span-1 lg:col-span-3 bg-black text-white p-3 rounded-lg uppercase hover:bg-gray-700'>
          Search
        </button>
      </form>
    </div>
  
    {/* Listing Results */}
    <div>
      <h2 className='text-3xl font-semibold text-center mb-5'>Listing Results</h2>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {!loading && listings.length === 0 && <p>No listings found.</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)
        )}
      </div>
      {showMore && (
        <button
          onClick={onShowMoreClick}
          className='mt-5 bg-black text-white p-3 rounded-lg w-full uppercase hover:bg-gray-700'
        >
          Show more
        </button>
      )}
    </div>
  </div>
  
  );
}
