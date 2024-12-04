import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateProduct = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    colors: [],
    images: [],
    sizes:[]
  });
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [colorInput, setColorInput] = useState(""); // For adding colors dynamically
  const [sizeInput, setSizeInput] = useState("");
  const navigate = useNavigate();

  const handleUploadImages = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const storage = getStorage(app);
    const newUploadProgress = Array(files.length).fill(0);
    const uploadedImages = [];

    files.forEach((file, index) => {
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          newUploadProgress[index] = progress.toFixed(0);
          setUploadProgress([...newUploadProgress]);
        },
        (error) => {
          toast.error(`Image ${file.name} upload failed`);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          uploadedImages.push(downloadURL);
          if (uploadedImages.length === files.length) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...uploadedImages], // Append new images to existing images
            }));
            setUploadProgress([]);
            toast.success("All images uploaded successfully!");
          }
        }
      );
    });
  };

  const handleAddColor = () => {
    if (colorInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.isAdmin) {
      toast.error("You are not authorized to create a product.");
      return;
    }

    try {
      const res = await fetch(`/api/v1/product/create-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }

      toast.success("Product created successfully!");
      navigate(`/`);
    } catch (error) {
      toast.error("Something went wrong while submitting the form");
    }
  };

  return (
    <div className="min-h-screen p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">
        Create a Product
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Name and Category */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Name"
            required
            id="name"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            <option value="laptop">Laptop</option>
            <option value="smartphone">Smartphone</option>
            <option value="cleaning">Cleaning</option>
          </Select>
        </div>

        {/* Price and Stock */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="number"
            placeholder="Price"
            required
            min="0"
            id="price"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
          <TextInput
            type="number"
            placeholder="Stock"
            required
            min="0"
            id="stock"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, stock: parseInt(e.target.value, 10) })
            }
          />
        </div>

        {/* Colors */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <TextInput
              type="text"
              placeholder="Add a color (e.g., red)"
              value={colorInput}
              className="flex-1"
              onChange={(e) => setColorInput(e.target.value)}
            />
            <Button type="button" onClick={handleAddColor}>
              Add Color
            </Button>
          </div>
          {formData.colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 rounded-full text-teal-700"
                >
                  {color}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <TextInput
              type="text"
              placeholder="Add a size (e.g., S, M, L)"
              value={sizeInput}
              className="flex-1"
              onChange={(e) => setSizeInput(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleAddSize}
            >
              Add Size
            </Button>
          </div>
          {formData.sizes?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 rounded-full text-teal-700"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="flex flex-col gap-4 border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleUploadImages}
          >
            {uploadProgress.length > 0 ? (
              <div className="flex gap-2">
                {uploadProgress.map((progress, index) => (
                  <CircularProgressbar
                    key={index}
                    value={progress}
                    text={`${progress}%`}
                    className="w-10 h-10"
                  />
                ))}
              </div>
            ) : (
              "Upload Images"
            )}
          </Button>
        </div>
        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Uploaded ${index + 1}`}
                className="w-32 h-32 object-cover"
              />
            ))}
          </div>
        )}

        {/* Description */}
        <ReactQuill
          theme="snow"
          placeholder="Write a description..."
          required
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, description: value })}
        />

        {/* Submit Button */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreateProduct;
