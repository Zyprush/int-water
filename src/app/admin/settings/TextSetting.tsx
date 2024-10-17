"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase"; // Adjust your Firebase config path
import useUserData from "@/hooks/useUserData";

interface TextSettingProps {
  name: string;
  title: string;
}

const TextSetting: React.FC<TextSettingProps> = ({
  name,
  title,
}): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newValue, setNewValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false); // Loading state for saving changes
  const { userData } = useUserData();
    
  
  // Fetch setting value by name from Firestore on component mount
  useEffect(() => {
    const fetchSetting = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", name);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setValue(docSnap.data().value);
        } else {
          setValue(null); // No data for this name
        }
      } catch (error) {
        console.error("Error fetching setting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [name]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setNewValue(value || ""); // Set initial value in input when editing starts
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true); // Set saving state to true
    try {
      await setDoc(doc(db, "settings", name), { value: newValue });
      setValue(newValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving setting:", error);
    } finally {
      setIsSaving(false); // Set saving state back to false after saving
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewValue(value || "");
  };
  return (
    <div className="flex flex-col items-center justify-apart border-t w-full border-zinc-400 border-opacity-45 dark:border-zinc-700 p-5 group">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isEditing ? (
            <div className="flex w-full justify-between items-center">
              <p className="font-semibold text-primary text-sm dark:text-zinc-200">
                {title}
              </p>
              <input
                type="text"
                value={newValue}
                placeholder={title}
                onChange={handleChange}
                className="sn-input mx-auto"
                disabled={isSaving} // Disable input when saving
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="btn btn-sm btn-outline text-secondary rounded-sm ml-auto"
                  disabled={isSaving} // Disable cancel button when saving
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm rounded-sm text-white"
                  disabled={isSaving} // Disable save button when saving
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-between items-center">
              <p className="font-semibold text-primary text-sm mr-auto dark:text-zinc-200">
                {title}
              </p>
              <p className="ml-1 max-w-80 text-center">
                {value ? value : `No data for ${title}`}
              </p>
              {userData?.role === "admin" && (
                <button
                  onClick={toggleEdit}
                  className="btn btn-outline btn-sm rounded-sm text-primary mx-auto hover:text-secondary ml-auto mr-0 dark:text-zinc-300"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TextSetting;
