import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className='shadow-md' style={{backgroundColor: '#fff'}}>
    <div className='flex items-center justify-between max-w-6xl mx-auto p-3'>
      <div style={{flex: 1}}>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl' style={{color: '#333'}}>
            BerlinApartments
          </h1>
        </Link>
      </div>
  
      <form
        onSubmit={handleSubmit}
        className='flex items-center' style={{backgroundColor: '#f0f0f0', borderRadius: '20px', padding: '8px 12px', flex: 'none', maxWidth: '420px', position: 'relative'}}
      >
        <button type="submit" style={{position: 'absolute', left: '10px', background: 'none', border: 'none'}}>
          <FaSearch style={{color: '#333'}} />
        </button>
        <input
          type='text'
          placeholder='Search...'
          className='bg-transparent focus:outline-none flex-grow pl-10 pr-2' // Padding added to not overlap text with the icon
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{color: '#333'}}
        />
      </form>
  
      <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
        <ul className='flex gap-4 justify-end'>
          <Link to='/'>
            <li className='hover:underline' style={{color: '#333'}}>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hover:underline' style={{color: '#333'}}>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar || 'https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png'}
                alt='profile'
                style={{filter: 'grayscale(100%)'}}
              />
            ) : (
              <div className='flex items-center'>
                <img
                  src='https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png'
                  alt='Sign in'
                  className='h-7 w-7 object-cover rounded-full mr-2'
                  style={{filter: 'grayscale(100%)'}}
                />
                <span className='hover:underline' style={{color: '#333'}}>Sign in</span>
              </div>
            )}
          </Link>
        </ul>
      </div>
    </div>
  </header>
  


  );
}
