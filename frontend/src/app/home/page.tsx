'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {

    const router = useRouter();

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <section
                className="relative flex items-center justify-center h-screen bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/bg.jpeg')", // Ganti dengan path gambar Anda
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                
                {/* Content */}
                <div className="relative text-center text-white">
                    <h1 className="text-7xl font-bold">Welcome to Codemy Notes</h1>
                    <p className="text-xl mt-4 mb-6">Organize your thoughts and ideas in one place</p>
                    <button 
                        className="px-6 py-2 bg-white text-blue-500 rounded-md font-semibold hover:bg-gray-200"
                        onClick={() => router.push('/auth/signin')}
                    >
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
