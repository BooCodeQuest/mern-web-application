import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className='p-5 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-8'>
  <h1 className='text-4xl font-semibold text-center my-8 text-gray-900'>Sign Up</h1>
  <form onSubmit={handleSubmit} className='space-y-6'>
    <input
      type='text'
      placeholder='Username'
      className='w-full border-2 p-4 rounded-md border-gray-300 bg-gray-50'
      id='username'
      onChange={handleChange}
    />
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
      {loading ? 'Loading...' : 'Sign Up'}
    </button>
  </form>
  <div className='text-center mt-5'>
    <p>Have an account?</p>
    <Link to={'/sign-in'}>
      <span className='text-blue-700 hover:text-blue-800'>Sign in</span>
    </Link>
  </div>
  {error && <p className='text-red-600 text-sm mt-2'>{error}</p>}
</div>

  );
}
