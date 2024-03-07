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
      const res = await fetch(`/api/listing/get/${listingId}`);
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
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
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
          console.log(`Upload is ${progress}% done`);
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
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
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
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
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
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-5 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-8'>
    <h1 className='text-4xl font-bold text-center my-8 text-gray-900'>
      Update a Listing
    </h1>
    <form onSubmit={handleSubmit} className='space-y-6 px-8 py-4'>
      <div className='grid grid-cols-1 gap-6'>
      <p className='font-semibold mb-0 text-gray-800'>
          Name:
        </p>
        <input
          type='text'
          placeholder='Name'
          className='w-full border-2 p-4 rounded-md border-gray-300 bg-gray-50'
          id='name'
          maxLength='62'
          minLength='10'
          required
          onChange={handleChange}
          value={formData.name}
        />
        <p className='font-semibold mb-0 text-gray-800'>
          Description:
        </p>
        <textarea
          placeholder='Description'
          className='w-full border-2 p-4 rounded-md border-gray-300 bg-gray-50'
          id='description'
          required
          onChange={handleChange}
          value={formData.description}
          rows='4'
        />
        <p className='font-semibold mb-0 text-gray-800'>
          Address:
        </p>
        <input
          type='text'
          placeholder='Address'
          className='w-full border-2 p-4 rounded-md border-gray-300 bg-gray-50'
          id='address'
          required
          onChange={handleChange}
          value={formData.address}
        />
      </div>
      <div className='flex flex-wrap gap-4 mt-4'>
        {['sale', 'rent', 'parking', 'furnished'].map((field) => (
          <label key={field} className='flex items-center gap-2'>
            <input
              type='checkbox'
              id={field}
              className='w-6 h-6'
              onChange={handleChange}
              checked={formData[field]}
            />
            <span className='capitalize text-gray-800'>{field}</span>
          </label>
        ))}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4'>
      <p className='font-semibold text-gray-800'>
          Bedrooms:
        </p>
        <input
          type='number'
          placeholder='Bedrooms'
          className='p-4 border-2 rounded-md border-gray-300 bg-gray-50'
          id='bedrooms'
          min='1'
          required
          onChange={handleChange}
          value={formData.bedrooms}
        />
        <p className='font-semibold text-gray-800'>
          Bathrooms:
        </p>
        <input
          type='number'
          placeholder='Bathrooms'
          className='p-4 border-2 rounded-md border-gray-300 bg-gray-50'
          id='bathrooms'
          min='1'
          required
          onChange={handleChange}
          value={formData.bathrooms}
        />
        <p className='font-semibold text-gray-800'>
          Price:
        </p>
        <input
          type='number'
          placeholder='Price'
          className='p-4 border-2 rounded-md border-gray-300 bg-gray-50'
          id='regularPrice'
          min='50'
          required
          onChange={handleChange}
          value={formData.regularPrice}
        />
        {formData.offer && (
          <input
            type='number'
            placeholder='Discounted Price'
            className='p-4 border-2 rounded-md border-gray-300 bg-gray-50'
            id='discountPrice'
            min='0'
            required
            onChange={handleChange}
            value={formData.discountPrice}
          />
        )}
      </div>
      <div className='mt-6'>
        <p className='font-semibold mb-2 text-gray-800'>
          Images:
          <span className='font-normal text-gray-600 ml-2'>
            First image = cover (only 6 images)
          </span>
        </p>
        <div className='flex gap-4 items-center'>
          <input
            onChange={(e) => setFiles(e.target.files)}
            className='p-3 border-2 rounded w-full border-gray-300 bg-gray-50'
            type='file'
            id='images'
            accept='image/*'
            multiple
          />
          <button
            type='button'
            disabled={uploading}
            onClick={handleImageSubmit}
            className='p-3 bg-black text-white rounded hover:bg-gray-700 disabled:bg-gray-400'
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
      {imageUploadError && (
        <p className='text-red-500 text-sm mt-2'>{imageUploadError}</p>
      )}
      {formData.imageUrls.length > 0 && (
        <div className='flex flex-wrap gap-4 mt-4'>
          {formData.imageUrls.map((url, index) => (
            <div key={url} className='flex justify-between p-2 border-2 border-gray-200 rounded items-center'>
              <img
                src={url}
                alt='listing preview'
                className='w-20 h-20 object-cover rounded-md'
              />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='p-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        disabled={loading || uploading}
        className='w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded uppercase disabled:bg-gray-500'
      >
        {loading ? 'Updating...' : 'Update Listing'}
      </button>
      {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
    </form>
  </main>
  
  );
}
