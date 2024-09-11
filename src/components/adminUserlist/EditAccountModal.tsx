import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { PencilIcon } from 'lucide-react';
import { EditUserModalProps, Users } from './types';



const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState<Users | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData && user) {
      try {
        const updatedFields: Partial<Users> = {};

        // Only add changed fields to updatedFields
        Object.keys(formData).forEach((key) => {
          if (formData[key as keyof Users] !== user[key as keyof Users]) {
            updatedFields[key as keyof Users] = formData[key as keyof Users];
          }
        });

        // Handle profile picture update
        if (profilePicFile) {
          // Delete old profile picture if it exists
          if (user.profilePicUrl) {
            const oldProfilePicRef = ref(storage, user.profilePicUrl);
            await deleteObject(oldProfilePicRef);
          }

          const profilePicRef = ref(storage, `profilePics/${user.id}`);
          const snapshot = await uploadBytes(profilePicRef, profilePicFile);
          updatedFields.profilePicUrl = await getDownloadURL(snapshot.ref);
        }

        // Handle password update
        if (isEditingPassword && oldPassword && newPassword && confirmPassword) {
          if (newPassword === confirmPassword) {
            // Here you should add logic to verify the old password
            // For now, we'll just update the password
            updatedFields.password = newPassword;
          } else {
            throw new Error('New password and confirm password do not match');
          }
        } else {
          // Remove password from updatedFields if not changing
          delete updatedFields.password;
        }

        // Only update if there are changed fields
        if (Object.keys(updatedFields).length > 0) {
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, updatedFields);
          onUpdate();
        }

        onClose();
      } catch (error) {
        console.error('Error updating user:', error);
        // Here you might want to show an error message to the user
      }
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">Edit User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.profilePicUrl || '/placeholder-avatar.png'}
                alt="Profile"
                className="w-64 h-64 rounded-full object-cover shadow-lg"
              />
              <label htmlFor="profilePic" className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100">
                <PencilIcon className="w-6 h-6 text-gray-600" />
              </label>
              <input
                type="file"
                id="profilePic"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Click the pencil icon to change profile picture</p>
          </div>

          <div className="md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="cellphoneNo">Cellphone No</label>
                <input
                  type="text"
                  id="cellphoneNo"
                  name="cellphoneNo"
                  value={formData.cellphoneNo}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isEditingPassword ? 'Cancel Password Change' : 'Change Password'}
              </button>
            </div>

            {isEditingPassword && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="oldPassword">Old Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-400 transition ease-in-out duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition ease-in-out duration-150"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;