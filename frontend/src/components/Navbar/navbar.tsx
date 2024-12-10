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
        <div className="z-20">
                <div className="navbar bg-sky-300 text-white fixed top-0 w-full gap-2 px-6 py-3 md:px-16">
                    <div className="navbar-start">
                        <div className="text-xl font-bold text-black">
                            <p>Codemy Notes</p>
                        </div>
                    </div>
                    <div className="navbar-end flex items-center">
                        <span className="text-black font-bold mr-4 ">{userName}</span>
                        <button
                            className="btn bg-red-500 border-none text-white hover:bg-red-700 px-4 py-2"
                            onClick={() => setShowLogoutPopup(true)} 
                        >
                            Logout
                        </button>
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
        </div>
    )
}