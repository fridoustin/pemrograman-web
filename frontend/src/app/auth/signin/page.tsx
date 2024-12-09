"use client"

import { Loader } from '@/components/loader'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import Link from 'next/link'
import { AuthContext } from '@/context/AuthContext'

const SignIn = () => {

    const { dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSignIn = async () => {
        setError('');
        setShowError(false);
        setIsLoading(true);
    
        if (!email || !password) {
            setError('Email dan password tidak boleh kosong');
            setShowError(true);
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
            console.log('API Response:', data);
    
            if (response.ok && data.token) {
                localStorage.setItem("access_token", data.token);
                dispatch({
                    type: 'LOGIN',
                    payload: { token: data.token },
                });
                router.push('/'); // Navigasi hanya dilakukan jika kredensial benar
            } else {
                // Tampilkan error jika login gagal
                setError(data.message || 'Login gagal, silakan periksa kembali email dan password Anda');
                setShowError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Terjadi kesalahan, silakan coba lagi nanti');
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeErrorPopup = () => {
        setShowError(false);
    };

    
    return (
        <main className="bg-sky-300 flex justify-center items-center min-h-screen p-6">
            <div className='card bg-white w-96 shadow-xl px-12 pt-12'>
                <h1 className='font-bold text-4xl flex justify-center pb-8 text-black'>Login</h1>

                <p className='text-black pb-1'>Email</p>
                <label className="input input-bordered flex items-center gap-2 bg-blue-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 ">
                        <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                <input 
                    type="text" 
                    className="grow text-black" 
                    placeholder="example@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </label>
                
                <p className='text-black pb-1 pt-4'>Password</p>
                <label className="input input-bordered flex items-center gap-2 bg-blue-100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input 
                    type="password" 
                    className="grow text-black" 
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </label>
                <button 
                    className='bg-blue-300 mt-8 rounded-xl text-black py-3 hover:bg-blue-400'
                    onClick={handleSignIn}
                    >
                        <p className='text-white'>Login</p>
                </button>
                <div className='flex justify-between py-6 px-4'>
                    <p className='text-black text-s'>Belum punya akun?</p>
                    <a className="link link-hover text-blue-500 hover:text-blue-600" href="/auth/signup">Buat akun</a>
                </div>
            </div>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader size="lg" /> 
                </div>
            )}

            {showError && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                    <p className="text-red-600 font-bold text-2xl mb-4">Error</p>
                    <p className="text-black pt-4">{error}</p>
                    <button
                    className="bg-red-500 text-white rounded-lg px-10 py-2 mt-10 hover:bg-red-600"
                    onClick={closeErrorPopup}
                    >
                    Close
                    </button>
                </div>
                </div>
            )}
        </main>
    )
}

export default SignIn