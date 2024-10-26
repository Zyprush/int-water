import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import useConsumerData from "@/hooks/useConsumerData";
import { currentTime } from "@/helper/time";

interface ReportIssueFormProps {
  onCancel: () => void;
}

const ReportIssueForm: React.FC<ReportIssueFormProps> = ({ onCancel }) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [otherIssue, setOtherIssue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const { consumerData, uid } = useConsumerData();

  const handleCheckboxChange = (issue: string) => {
    setSelectedIssues((prevIssues) =>
      prevIssues.includes(issue)
        ? prevIssues.filter((i) => i !== issue)
        : [...prevIssues, issue]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => {
        const combined = [...prev, ...newImages];
        return combined.slice(0, 5); // Limit to 5 images
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true at the start
    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
          const uploadResult = await uploadBytes(imageRef, image);
          return getDownloadURL(uploadResult.ref);
        })
      );

      // Save report to Firestore
      await addDoc(collection(db, "reports"), {
        submittedBy: consumerData?.applicantName,
        location: consumerData?.installationAddress,
        consumerID: uid,
        issues: selectedIssues,
        otherIssue,
        date,
        time,
        imageUrls,
        createdAt: currentTime,
        status: "unresolved",
      });

      alert("Issue reported successfully!");
      setSelectedIssues([]);
      setOtherIssue("");
      setDate("");
      setTime("");
      setImages([]);
      onCancel(); // Close the form
    } catch (error) {
      console.error("Error reporting issue: ", error);
      alert("Failed to report issue.");
    } finally {
      setLoading(false); // Set loading back to false after completion
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl text-primary font-semibold mb-4">Report Issue</h2>

      {/* Issues Checkbox */}
      <p className="text-lg mb-2 text-zinc-700">
        What are the existing issues occurring?
      </p>
      <div className="space-y-2">
        {[
          "Low Water Pressure",
          "Discoloration or Odor",
          "Water Interruptions",
          "Leakage",
          "Water Supply Shortage",
          "Illegal connection",
        ].map((issue, idx) => (
          <div key={idx} className="flex items-center">
            <input
              type="checkbox"
              id={issue}
              value={issue}
              checked={selectedIssues.includes(issue)}
              onChange={() => handleCheckboxChange(issue)}
              className="mr-2"
            />
            <label htmlFor={issue} className="text-sm text-zinc-600">
              {issue}
            </label>
          </div>
        ))}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="others"
            checked={selectedIssues.includes("Others")}
            onChange={() => handleCheckboxChange("Others")}
            className="mr-2"
          />
          <label htmlFor="others" className="text-sm text-zinc-600">
            Others:
          </label>
          <input
            type="text"
            value={otherIssue}
            onChange={(e) => setOtherIssue(e.target.value)}
            placeholder="Specify other issue"
            className="ml-2 p-2 border bg-zinc-50 rounded-lg w-full text-sm"
          />
        </div>
      </div>

      {/* Date and Time Inputs */}
      <div className="mt-8">
        <label className="block mb-1">
          Date and time when the issue started
        </label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded-lg w-1/2 text-sm bg-zinc-50"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border rounded-lg w-1/2 text-sm bg-zinc-50"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="mt-8">
        <label className="block mb-1">Pictures of the issue</label>
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(image)}
                alt={`Issue ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label
              htmlFor="image-upload"
              className="border rounded-lg p-4 w-16 h-16 flex items-center justify-center cursor-pointer"
            >
              <span className="text-2xl text-gray-400">+</span>
            </label>
          )}
          <input
            type="file"
            id="image-upload"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
        {images.length >= 5 && (
          <p className="text-sm text-gray-500 mt-2">
            Maximum number of images (5) reached
          </p>
        )}
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="mt-6 flex justify-end w-full gap-5">
        <button
          type="button"
          className="btn text-secondary btn-outline"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary text-white"
          disabled={loading} // Disable button if loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ReportIssueForm;
