"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Input, DatePicker, Button } from "@heroui/react";

interface InternshipFormProps {
  userId: string;

  onAdd: (internship: any) => void;
}

const InternshipForm: React.FC<InternshipFormProps> = ({
  userId,
  onAdd,
}: {
  userId: string;
  onAdd: (cert: any) => void;
}) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { status, data: session } = useSession();

  const handleAddInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const newInternship = { title, company, startDate, endDate };
    onAdd(newInternship);
    userId = session?.user?.email || "";
    try {
      const response = await axios.post("/api/addInternship/", {
        userId,
        internship: { title, company, startDate, endDate },
      });

      setSuccess("Internship added successfully!");
      setTitle("");
      setCompany("");
      setStartDate("");
      setEndDate("");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-gradient-to-bl from-gray-800 to-background p-4 rounded-xl font-pop">
      <form onSubmit={handleAddInternship} className="space-y-4">
        <div className="py-2 text-offwhite">
          {/* <label className="block text-sm font-medium">Title</label> */}
          <Input
            label="Enter Internship Role"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isRequired
            classNames={{
              label: "text-white",
              input: "text-white placeholder-white",
            }}
          />
        </div>
        <div className="py-2">
          {/* <label className="block text-sm font-medium">Title</label> */}
          <Input
            label="Enter company name"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            isRequired
            classNames={{
              label: "text-white",
              input: "text-white placeholder-white",
            }}
          />
        </div>
        <div className="py-2">
          {/* <label className="block text-sm font-medium">Title</label> */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <DatePicker
              label="Internship start"
              selectorButtonPlacement="start"
              onChange={(date) => setStartDate(date?.toString() || "")}
            />
            <DatePicker
              label="Internship end"
              selectorButtonPlacement="end"
              onChange={(date) => setEndDate(date?.toString() || "")}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-primary text-lg text-background px-4 py-2 rounded hover:rounded-full shadow-glow hover:bg-primary/80 mt-4 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Internship"}
        </Button>
      </form>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default InternshipForm;
