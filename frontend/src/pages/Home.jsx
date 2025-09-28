import React from 'react';

const Home = () => (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to the Rating System
        </h1>
        <p className="text-gray-600 text-lg mb-8 text-center max-w-md">
            Easily rate and review stores
        </p>
        <a href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded font-bold text-base hover:bg-blue-700 transition"
        >
            Get Started
        </a>
    </div>
);

export default Home;
