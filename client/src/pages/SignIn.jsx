import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-5 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-8'>
    <h1 className='text-4xl font-semibold text-center my-8 text-gray-900'>Sign In</h1>
    <form onSubmit={handleSubmit} className='space-y-6'>
      <input
        type='email'
        placeholder='Email'
        className='w-full border-2 p-4 rounded-md border-gray-300 bg-gray-50'
        id='email'
        onChange={handleChange}
      />
      <input
        type='password'
        placeholder='Password'
        className='w-full border-2 p-4 rounded-md border-gray-300 bg-gray-50'
        id='password'
        onChange={handleChange}
      />
      <button
        disabled={loading}
        className='w-full py-3 bg-black hover:bg-gray-700 text-white rounded-md uppercase disabled:bg-gray-500'
      >
        {loading ? 'Loading...' : 'Sign In'}
      </button>
    </form>
    <div className='mt-5 text-center'>
      <p>Don't have an account?</p>
      <Link to={'/sign-up'}>
        <span className='text-blue-700 hover:text-blue-800'>Sign up</span>
      </Link>
    </div>
    {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
  </div>
  
  );
}
