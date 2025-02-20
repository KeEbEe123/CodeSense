"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Input } from "@heroui/react";
import { DatePicker, Button } from "@heroui/react";

interface CertificationFormProps {
  userId: string;
  onAdd: (certification: any) => void;
  certificationToEdit?: any;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  userId,
  onAdd,
  certificationToEdit,
}) => {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (certificationToEdit) {
      setName(certificationToEdit.name || "");
      setIssuer(certificationToEdit.issuer || "");
      setDate(certificationToEdit.date || "");
      if (certificationToEdit.imageUrl) {
        setPreview(certificationToEdit.imageUrl);
      }
    }
  }, [certificationToEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData();
    formData.append("oldName", certificationToEdit?.name || "");
    formData.append("oldIssuer", certificationToEdit?.issuer || "");
    formData.append("userId", session?.user?.email || "");
    formData.append("name", name);
    formData.append("issuer", issuer);
    formData.append("date", date);
    if (image) formData.append("image", image);

    try {
      const endpoint = certificationToEdit
        ? `/api/editCertification`
        : "/api/addCertification";

      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(
        certificationToEdit
          ? "Certification updated successfully!"
          : "Certification added successfully!"
      );
      setName("");
      setIssuer("");
      setDate("");
      setImage(null);
      setPreview(null);
      onAdd(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent bg-gradient-to-bl from-gray-800 to-background p-4 rounded-xl font-pop space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="py-2 text-white">
          <Input
            classNames={{
              label: "text-white",
              input: "text-white placeholder-white",
            }}
            label="Enter certification name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
            variant="underlined"
          />
        </div>
        <div className="py-2 text-white">
          <Input
            classNames={{
              label: "text-white",
              input: "text-white placeholder-white",
            }}
            label="Enter issuer name"
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            isRequired
            variant="underlined"
          />
        </div>
        <div className="py-2">
          <DatePicker
            variant="underlined"
            label="Date of Issue"
            onChange={(date) => setDate(date?.toString() || "")}
            isRequired
            classNames={{
              label: "text-white",
              input: "text-white placeholder-white",
            }}
          />
        </div>
        <div className="py-2">
          <label className="text-white block mb-2">
            Upload Certificate Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
        <Button
          type="submit"
          className="bg-primary text-lg text-background px-4 py-2 rounded hover:rounded-full shadow-glow hover:bg-primary/80 mt-4 transition-all duration-300"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : certificationToEdit
            ? "Update Certification"
            : "Add Certification"}
        </Button>
      </form>
      {success && <p className="text-green-500 mt-4">{success}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CertificationForm;
