/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";

const ImgSetting: React.FC<{ fileName: string; name: string }> = ({
  fileName,
  name,
}): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetch
  const [uploading, setUploading] = useState<boolean>(false); // Loading state for upload

  // Fetch image URL when not editing
  useEffect(() => {
    if (!isEditing) {
      const fetchImageURL = async () => {
        setLoading(true);
        try {
          const storageRef = ref(storage, `settings/${fileName}`);
          const url = await getDownloadURL(storageRef);
          setImageURL(url);
          setPreview(url);
        } catch (error) {
          console.error("Error fetching image URL", error);
          setImageURL(null); // Handle errors or absence of image
        } finally {
          setLoading(false);
        }
      };

      fetchImageURL();
    }
  }, [isEditing, fileName]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        const storageRef = ref(storage, `settings/${fileName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setImageURL(url);
        setPreview(url); // Clear preview after successful upload
        setIsEditing(false);
        setFile(null); // Clear file state
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border min-h-44 w-44 bg-white rounded-lg gap-3 p-3 tooltip tooltip-top" data-tip={name}>
      {loading ? (
        <p className="font-semibold text-sm text-zinc-600">loading</p>
      ) : (
        <div className="flex flex-col gap-3">
          {isEditing ? (
            <div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mb-4 w-44 h-44 object-contain rounded-lg"
                />
              )}
          
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="text-xs border none-input"
                disabled={uploading}
              />
              <span className="flex gap-2 justify-center items-center mb-0 mt-auto ">
                {/* <button onClick={toggleEdit} className="bt-outline">
                  Cancel
                </button> */}
                <label htmlFor="file-upload" className="bt-outline">
                Upload
              </label>
                <button
                  onClick={handleUpload}
                  className="bt-primary"
                  disabled={uploading}
                >
                  {uploading ? "loading.." : "Update"}
                </button>
              </span>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="w-44 h-44 flex items-center justify-center">
                  <span>Loading...</span>
                  {/* You can replace this with a spinner */}
                </div>
              ) : imageURL ? (
                <img
                  src={imageURL}
                  alt="Uploaded"
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <span className="text-xs w-full h-44 font-semibold border rounded p-2 flex items-center justify-center">
                  <p className="text-center">No {name} uploaded</p>
                </span>
              )}
              <span className="flex gap-2 justify-center items-center">
                <button onClick={toggleEdit} className="bt-outline mx-auto">
                  Edit
                </button>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImgSetting;