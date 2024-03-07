import React from 'react';
export default function About() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50' style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <div className='max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg'>
        <h1 className='text-3xl lg:text-4xl font-semibold text-center mb-8' style={{ color: '#333' }}>About BerlinApartments</h1>
        <p className='text-md lg:text-lg mb-6' style={{ color: '#666' }}>
          BerlinApartments is your premier destination for finding the best residential and commercial properties across Berlin. With an easy-to-use platform, we connect tenants with their future homes, and property owners with their ideal tenants.
        </p>
        <p className='text-md lg:text-lg' style={{ color: '#666' }}>
          Our extensive listings include a wide range of properties, from cozy studio apartments to spacious commercial spaces, ensuring that whether you're moving in or moving up, you'll find a place that feels like home.
        </p>
      </div>
    </div>
  )
}
