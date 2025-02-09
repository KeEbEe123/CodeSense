"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Input } from "@heroui/react";
import { DatePicker, Button } from "@heroui/react";
interface CertificationFormProps {
  userId: string;

  onAdd: (certification: any) => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  userId,
  onAdd,
}: {
  userId: string;
  onAdd: (cert: any) => void;
}) => {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { status, data: session } = useSession();

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const newCertification = { name, issuer, date };
    onAdd(newCertification);
    userId = session?.user?.email || "";
    try {
      const response = await axios.post("/api/addCertification/", {
        userId,
        certification: { name, issuer, date },
      });

      setSuccess("Certification added successfully!");
      setName("");
      setIssuer("");
      setDate("");
      setDescription("");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent bg-gradient-to-bl from-gray-800 to-background p-4 rounded-xl font-pop space-y-4">
      <div>
        {/* <h2 className="text-xl font-semibold mb-4">Add Certification</h2> */}
        <form onSubmit={handleAddCertification} className="space-y-4">
          <div className="py-2 text-white">
            {/* <label className="block text-sm font-medium">Title</label> */}
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
            {/* <input
              type="text"
              className="w-full border rounded p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            /> */}
          </div>
          <Button
            type="submit"
            className="bg-primary text-lg text-background px-4 py-2 rounded hover:rounded-full shadow-glow hover:bg-primary/80 mt-4 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Certification"}
          </Button>
        </form>
        {success && <p className="text-green-500 mt-4">{success}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
  const checkCertificationExists = async (name: string, issuer: string) => {
    try {
      const response = await axios.post("/api/checkCertificationExists", {
        name,
        issuer,
      });
      return response.data.exists; // Assuming your API returns { exists: true/false }
    } catch (err) {
      return false; // In case of an error, assume it doesn't exist
    }
  };
};

export default CertificationForm;
