import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase';

const ReportIssueForm: React.FC = () => {
    const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
    const [otherIssue, setOtherIssue] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleCheckboxChange = (issue: string) => {
        setSelectedIssues((prevIssues) =>
            prevIssues.includes(issue) ? prevIssues.filter((i) => i !== issue) : [...prevIssues, issue]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Upload image to Firebase Storage
            let imageUrl = '';
            if (image) {
                const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = `images/${Date.now()}_${image.name}`;
            }

            // Save report to Firestore
            await addDoc(collection(db, 'reports'), {
                issues: selectedIssues,
                otherIssue,
                date,
                time,
                imageUrl,
                createdAt: new Date()
            });

            alert("Issue reported successfully!");
        } catch (error) {
            console.error("Error reporting issue: ", error);
            alert("Failed to report issue.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Report Issue</h2>

            <p className="text-lg mb-2">What are the existing issues occurring?</p>
            <div className="space-y-2">
                {['Low Water Pressure', 'Discoloration or Odor', 'Water Interruptions', 'Leakage', 'Water Supply Shortage', 'Illegal connection'].map(
                    (issue, idx) => (
                        <div key={idx} className="flex items-center">
                            <input
                                type="checkbox"
                                id={issue}
                                value={issue}
                                onChange={() => handleCheckboxChange(issue)}
                                className="mr-2"
                            />
                            <label htmlFor={issue}>{issue}</label>
                        </div>
                    )
                )}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="others"
                        onChange={() => handleCheckboxChange('Others')}
                        className="mr-2"
                    />
                    <label htmlFor="others">Others:</label>
                    <input
                        type="text"
                        value={otherIssue}
                        onChange={(e) => setOtherIssue(e.target.value)}
                        placeholder="Specify other issue"
                        className="ml-2 p-2 border rounded-lg w-full"
                    />
                </div>
            </div>

            {/* Date and Time Inputs */}
            <div className="mt-4">
                <label className="block mb-1">Date and time when the issue started</label>
                <div className="flex space-x-2">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-2 border rounded-lg w-1/2"
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="p-2 border rounded-lg w-1/2"
                    />
                </div>
            </div>

            {/* Image Upload */}
            <div className="mt-4">
                <label className="block mb-1">Picture of the issue</label>
                <div className="flex items-center space-x-4">
                    <label
                        htmlFor="image-upload"
                        className="border rounded-lg p-4 flex items-center justify-center cursor-pointer"
                    >
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Issue"
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="text-gray-500">No image selected</div>
                        )}
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <span className="text-xl font-semibold text-gray-400">+</span>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default ReportIssueForm;
