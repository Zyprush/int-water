import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { PencilIcon } from 'lucide-react';
import { EditUserModalProps, UsersEdit } from './types';

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState<UsersEdit | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
        const updatedFields: Partial<UsersEdit> = {};

        // Only add changed fields to updatedFields
        Object.keys(formData).forEach((key) => {
          if (formData[key as keyof UsersEdit] !== user[key as keyof UsersEdit]) {
            updatedFields[key as keyof UsersEdit] = formData[key as keyof UsersEdit];
          }
        });

        // Handle profile picture update
        if (profilePicFile) {
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
            updatedFields.password = newPassword;
          } else {
            throw new Error('New password and confirm password do not match');
          }
        } else {
          delete updatedFields.password;
        }

        if (Object.keys(updatedFields).length > 0) {
          const userRef = doc(db, 'users', user.id);
          await updateDoc(userRef, updatedFields);
          onUpdate();
        }

        onClose();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
          {isEditing ? 'Edit Staff Details' : 'View Staff Details'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.profilePicUrl || '/placeholder-avatar.png'}
                alt="Profile"
                className="w-64 h-64 rounded-full object-cover shadow-lg"
              />
              {isEditing && (
                <>
                  <label htmlFor="profilePic" className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100">
                    <PencilIcon className="w-6 h-6 text-gray-600" />
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                  disabled={!isEditing}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isEditingPassword ? 'Cancel Password Change' : 'Change Password'}
                </button>

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
              </>
            )}
          </div>
        </form>

        <div className="mt-6 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user); // Reset form data
                  setIsEditingPassword(false);
                }}
                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
