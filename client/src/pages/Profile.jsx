import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-5 max-w-lg mx-auto'>
  <h1 className='text-4xl font-bold text-center mb-10' style={{color: '#333'}}>User Dashboard</h1>
  <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
    <div className='flex justify-center'>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type='file'
        ref={fileRef}
        hidden
        accept='image/*'
      />
      <img
        onClick={() => fileRef.current.click()}
        src={formData.avatar || currentUser.avatar || 'https://icons.iconarchive.com/icons/graphicloads/flat-finance/256/person-icon.png'} // Generic profile icon
        alt='profile'
        className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-gray-300'
        style={{filter: 'grayscale(100%)'}}
      />
    </div>
    <p className='text-center'>
      {fileUploadError ? (
        <span style={{color: '#cc0000'}}>
          Error Image upload (image must be less than 2 mb)
        </span>
      ) : filePerc > 0 && filePerc < 100 ? (
        <span style={{color: '#666'}}>{`Uploading ${filePerc}%`}</span>
      ) : filePerc === 100 ? (
        <span style={{color: '#333'}}>Image successfully uploaded!</span>
      ) : (
        ''
      )}
    </p>
    
    <Link
      className='rounded-full py-3 uppercase font-bold flex justify-center'
      to={'/create-listing'}
      style={{backgroundColor: '#333', color: '#fff', opacity: loading ? 0.8 : 1, transition: 'opacity 300ms'}}
    >
      + Create New Listing
    </Link>
  </form>
  <div className='flex justify-center gap-10 mt-10'>
    <span
      onClick={handleDeleteUser}
      className='cursor-pointer font-semibold'
      style={{color: '#cc0000'}}
    >
      Delete My Account
    </span>
    <span onClick={handleSignOut} className='cursor-pointer font-semibold' style={{color: '#333'}}>
      Sign Out
    </span>
  </div>

  <p className='text-center mt-10' style={{color: '#cc0000'}}>{error ? error : ''}</p>
  <p className='text-center mt-2' style={{color: '#333'}}>
    {updateSuccess ? 'Profile Updated Successfully!' : ''}
  </p>
  <div className='mt-5'>
    <button onClick={handleShowListings} className='w-full py-2 border-2 border-gray-300 font-semibold' style={{color: '#333'}}>
      Show My Listings
    </button>
  </div>
  <p className='text-center mt-5' style={{color: '#cc0000'}}>
    {showListingsError ? 'Failed to Show Listings' : ''}
  </p>

  {userListings && userListings.length > 0 && (
    <div className='flex flex-col gap-6 mt-10'>
      <h2 className='text-center text-2xl font-bold' style={{color: '#333'}}>
        My Listings
      </h2>
      {userListings.map((listing) => (
        <div
          key={listing._id}
          className='border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between'
        >
          <Link to={`/listing/${listing._id}`} className='flex items-center gap-4'>
            <img
              src={listing.imageUrls[0]}
              alt='Listing'
              className='h-20 w-20 object-cover rounded-full'
              style={{filter: 'grayscale(100%)'}}
            />
            <p className='font-semibold flex-1 truncate' style={{color: '#333'}}>
              {listing.name}
            </p>
          </Link>

          <div className='flex flex-col items-center gap-2'>
            <button
              onClick={() => handleListingDelete(listing._id)}
              className='text-xs font-bold py-1 px-3 rounded-full'
              style={{backgroundColor: '#cc0000', color: '#fff'}}
            >
              Delete
            </button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className='text-xs font-bold py-1 px-3 rounded-full' style={{backgroundColor: '#f0f0f0', color: '#333'}}>
                Edit
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


  );
}
