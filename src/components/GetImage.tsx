/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const GetImage: React.FC<{ storageLink: string }> = ({
  storageLink,
}): JSX.Element => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetch

  // Fetch image URL when not editing
  useEffect(() => {
    const fetchImageURL = async () => {
      setLoading(true);
      try {
        const storageRef = ref(storage, `${storageLink}`);
        const url = await getDownloadURL(storageRef);
        setImageURL(url);
      } catch (error) {
        console.error("Error fetching image URL", error);
        setImageURL(null); // Handle errors or absence of image
      } finally {
        setLoading(false);
      }
    };

    fetchImageURL();
  }, [storageLink]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {loading ? (
        <p className="font-semibold text-xs text-zinc-600 my-auto">loading</p>
      ) : (
        <img src={imageURL || ""} alt={storageLink} className="w-full h-full object-contain" />
      )}
    </div>
  );
};

export default GetImage;