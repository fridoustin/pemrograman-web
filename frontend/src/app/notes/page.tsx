'use client'

import { Navbar } from '@/components/Navbar/navbar';
import React, { useEffect, useState } from 'react';

const Notes = () => {

    interface Note {
        id: number;
        user_id: string;
        title: string;
        body: string;
    }

    const [notes, setNotes] = useState<Note[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', body: '' });
    const [userId, setUserId] = useState<string | null>(null);

    const getUserIdFromToken = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('Access token not found');
            return null;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            if (!response.ok) {
                console.error('Failed to fetch user data');
                return null;
            }
            const userData = await response.json();
            console.log(userData.id)
            return userData.id; // Asumsi id ada dalam response API
        } catch (error) {
            console.error('Failed to get user id:', error);
            return null;
        }
    };

    const fetchNotes = async (currentUserId: string | null) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('Access token not found');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            console.log("Response status:", response.status);
    
            if (!response.ok) {
                console.error('Failed to fetch notes');
                return;
            }
    
            const data: Note[] = await response.json();
    
            const filteredNotes = data.filter(note => note.user_id === currentUserId);
            setNotes(filteredNotes);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setIsLoading(false);
        }
    };

    const addNote = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('Access token not found');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newNote),
            });

            if (response.ok) {
                setNewNote({ title: '', body: '' }); // Clear the form
                setIsModalOpen(false); // Close the modal
                fetchNotes(userId); // Refresh the notes list
            } else {
                console.error('Failed to add note');
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const deleteNote = async (id: number) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('Access token not found');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remove the deleted note from the state
                setNotes(notes.filter(note => note.id !== id));
            } else {
                console.error('Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            const id = await getUserIdFromToken();
            //console.log(id)
            setUserId(id);
            fetchNotes(id)
        };
        initialize();
    }, []);

    return (
        <div>
            <Navbar />
            {/* Header Section */}
            <div className="text-black pt-6">
                <div className="container mx-auto flex justify-between items-center px-4 lg:px-8">
                    <h1 className="text-3xl text-black pt-20 font-bold">Notes</h1>
                    <button
                        className="bg-white text-black px-4 py-2 mt-20 rounded-lg shadow-md hover:bg-gray-200"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Note
                    </button>
                </div>
            </div>

            {/* Notes List Section */}
            <div className="container mx-auto mt-6 px-4 pb-8 lg:px-8">
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white shadow-lg rounded-lg p-6 max-w-full"
                            >
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <h2 className="text-xl font-bold text-center mb-4 text-black">
                                    {note.title}
                                </h2>
                                <p className="text-gray-700 text-center">{note.body}</p>
                                
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Note Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl text-black font-bold mb-4">Add New Note</h2>
                        <div className="mb-4">

                        <p className='text-black font-medium pb-1 pt-4'>Title</p>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            <input
                                type="text"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                className="grow text-black"
                                placeholder="Enter note title"
                            />
                        </label>
                        </div>
                        <div className="mb-4">

                            <p className='text-black font-medium pb-1 pt-4'>Body</p>
                            <label className="input input-bordered flex items-center gap-2 bg-white">
                                <input
                                    value={newNote.body}
                                    onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
                                    className="grow text-black"
                                    placeholder="Enter note body"
                                ></input>
                            </label>   
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                onClick={addNote}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
