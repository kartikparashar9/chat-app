import Modal from "../common/Modal";
import Input from "../common/Input";
import { useState } from "react";

const EditProfile = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    bio: "",
    avatar: null, // file
    preview: "", // image preview
  });

  if (!isOpen) return null;

  // handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setForm({
        ...form,
        avatar: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Edit Profile
      </h2>

      {/*  IMAGE UPLOAD */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 mb-2">
          <img
            src={
              form.preview ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <label className="cursor-pointer text-sm text-blue-500">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>
      </div>

      {/* FORM */}
      <div className="flex flex-col gap-3">
        <Input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="h-10 px-3 rounded-lg border dark:bg-gray-700"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <Input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="p-2 rounded-lg border dark:bg-gray-700"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-300 dark:bg-gray-600 rounded-lg"
        >
          Cancel
        </button>

        <button className="w-full py-2 bg-blue-500 text-white rounded-lg">
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditProfile;
