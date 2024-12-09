'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Navbar = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            // Memanggil endpoint untuk mendapatkan data user
            fetch("http://127.0.0.1:8000/api/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.name) {
                        setIsLoggedIn(true);
                        setUserName(data.name);
                    } else {
                        setIsLoggedIn(false);
                        setUserName(null);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setIsLoggedIn(false);
                });
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                await fetch("http://127.0.0.1:8000/api/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    },
                });
                localStorage.removeItem("access_token");
                setIsLoggedIn(false);
                setUserName(null);
                router.push("/auth/signin");
            } catch (error) {
                console.error("Logout failed:", error);
            }
        }
    };

    return (
        <div className="drawer z-20">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="navbar bg-sky-300 text-white fixed top-0 w-full gap-2 px-8 py-4 md:px-28">
                    <div className="navbar-start">
                        <label
                        htmlFor="my-drawer-3"
                        aria-label="open sidebar"
                        className="lg:hidden btn btn-ghost"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                        </label>
                        <div className="text-xl font-bold text-black">
                            <p>Codemy Notes</p>
                        </div>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                        <li><a href="/">Home</a></li>
                        <li><a href="/notes">Notes</a></li>
                        </ul>
                    </div>
                    <div className="navbar-end pr-8">
                    {isLoggedIn ? (
                            <>
                                <span className="text-black font-bold mr-4 ">{userName}</span>
                                <button
                                    className="btn bg-red-500 border-none text-white hover:bg-red-700"
                                    onClick={() => setShowLogoutPopup(true)} 
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <a className="btn bg-slate-200 text-black border-none shadow-md hover:bg-slate-400" href="/auth/signin">Login</a>
                        )}
                    </div>
                </div>
            </div>

            {showLogoutPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-xl text-black font-bold mb-4">Konfirmasi Logout</h2>
                        <p className="text-black">Apakah Anda yakin ingin logout?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="btn bg-gray-300 border-none text-black hover:bg-gray-400 px-4 py-2 rounded"
                                onClick={() => setShowLogoutPopup(false)} // Tutup pop-up
                            >
                                Batal
                            </button>
                            <button
                                className="btn bg-red-500 border-none text-white hover:bg-red-700 px-4 py-2 rounded"
                                onClick={() => {
                                    handleLogout();
                                    setShowLogoutPopup(false);
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="drawer-side">
                <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
                ></label>
                <ul className="menu min-h-full w-60 bg-black/[0.9] pt-14 text-white font-bold">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/program">Program</a></li>
                    <li><a href="/event">Event</a></li>
                    <li><a href="/membership">Membership</a></li>
                </ul>
            </div>
        </div>
    )
}