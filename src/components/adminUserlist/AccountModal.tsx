import React, { useRef, useState } from 'react';
import { auth, db, storage } from '../../../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface AddNewUserModal {
    isOpen: boolean;
    onClose: () => void;
}

interface UserForm {
    name: string;
    address: string;
    cellphoneNo: string;
    position: string;
    email: string;
    password: string;
    role: string;
    updatedAt: string;
    profilePic: File | null;
    scanner: boolean;
}

const AddNewConsumerModal: React.FC<AddNewUserModal> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<UserForm>({
        name: '',
        address: '',
        cellphoneNo: '',
        position: '',
        email: '',
        password: '',
        role: '',
        updatedAt: new Date().toISOString().split('T')[0],
        profilePic: null,
        scanner: false
    });

    const [repeatPassword, setRepeatPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /*const handleScannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({
            ...prevState,
            scanner: e.target.checked
        }));
    };*/

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prevState => ({
                ...prevState,
                profilePic: e.target.files![0]
            }));
        }
    };

    const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== repeatPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        setPasswordError("");
        setIsLoading(true);
    
        const currentUser = auth.currentUser;
    
        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;
    
            let profilePicUrl = '';
            if (formData.profilePic) {
                try {
                    const storageRef = ref(storage, `profilePics/${user.uid}`);
                    await uploadBytes(storageRef, formData.profilePic);
                    profilePicUrl = await getDownloadURL(storageRef);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            }
    
            // Generate a new Firestore document with a unique ID
            const docRef = doc(collection(db, 'users'), user.uid); // Using user.uid as the document ID
    
            // Prepare user data for Firestore
            const userData = {
                id: docRef.id,
                name: formData.name,
                address: formData.address,
                cellphoneNo: formData.cellphoneNo,
                position: formData.position,
                email: formData.email,
                role: formData.role,
                uid: user.uid,
                updatedAt: new Date().toISOString().split('T')[0],
                profilePicUrl,
                scanner: formData.role === 'scanner' // Set scanner based on role
            };
    
            // Save user data to Firestore with the explicit ID
            await setDoc(docRef, userData);
    
            console.log("Document written with ID: ", docRef.id);
            onClose();
        } catch (e) {
            console.error("Error adding document or creating user: ", e);
        } finally {
            if (currentUser) {
                await auth.updateCurrentUser(currentUser);
            }
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add New Consumer</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter address"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cellphoneNo" className="block text-sm font-medium text-gray-700">Cellphone No</label>
                            <input
                                type="text"
                                id="cellphoneNo"
                                name="cellphoneNo"
                                value={formData.cellphoneNo}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter cellphone no"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='position' className="block text-sm font-medium text-gray-700">Position</label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter position"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            >
                                <option value="">Select a role</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                                <option value="scanner">Scanner</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='repeat-password' className="block text-sm font-medium text-gray-700">Repeat Password</label>
                            <input
                                type="password"
                                id="repeat-password"
                                name="repeat-password"
                                value={repeatPassword}
                                onChange={handleRepeatPasswordChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Repeat password"
                                required
                            />
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                        <div>
                            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            <input
                                type="file"
                                id="profilePic"
                                name="profilePic"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                accept="image/*"
                            />
                        </div>
                        {/* Add the scanner switch */}
                        {/** 
                        <div className="col-span-2">
                            <label htmlFor="scanner" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="scanner"
                                        name="scanner"
                                        className="sr-only"
                                        checked={formData.scanner}
                                        onChange={handleScannerChange}
                                    />
                                    <div className={`block bg-gray-600 w-14 h-8 rounded-full ${formData.scanner ? 'bg-blue-600' : ''}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${formData.scanner ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                                <div className="ml-3 text-gray-700 font-medium">
                                    Assign as Scanner
                                </div>
                            </label>
                        </div>
                         */}
                    </div>

                    <div className="flex justify-end space-x-2 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default AddNewConsumerModal;