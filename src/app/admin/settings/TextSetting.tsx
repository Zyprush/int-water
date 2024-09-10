"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase"; // Adjust your Firebase config path

interface TextSettingProps {
  name: string;
  title: string;
}

const TextSetting: React.FC<TextSettingProps> = ({ name, title }): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newValue, setNewValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false); // Loading state for saving changes

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
    <div className="flex flex-col items-center justify-center border border-zinc-300 border-opacity-45 dark:border-zinc-700 rounded-lg p-3 w-auto shadow-md group cursor-help">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isEditing ? (
            <>
              <input
                type="text"
                value={newValue}
                placeholder={title}
                onChange={handleChange}
                className="sn-input"
                disabled={isSaving} // Disable input when saving
              />
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={handleCancel} 
                  className="btn btn-sm btn-outline text-secondary mt-3 rounded-sm" 
                  disabled={isSaving} // Disable cancel button when saving
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="btn btn-primary btn-sm rounded-sm mt-3 text-white" 
                  disabled={isSaving} // Disable save button when saving
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 justify-start max-w-80">
            <p className="font-bold text-primary text-xs border p-1 border-primary rounded mr-auto">{title}</p>
              <p className="text-sm ml-1">{value ? value : `No data for ${title}`}</p>
              <button 
                onClick={toggleEdit} 
                className="btn btn-primary btn-sm rounded-sm mt-3 text-white hidden group-hover:flex mx-auto"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TextSetting;
