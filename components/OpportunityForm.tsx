"use client";

import { useState } from "react";
import axios from "axios";
import { Input, DatePicker, Button, Modal } from "@heroui/react";

interface OpportunityFormProps {
  initialData?: any;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [mainLink, setMainLink] = useState(initialData?.mainLink || "");
  const [formLink, setFormLink] = useState(initialData?.formLink || "");
  const [departments, setDepartments] = useState(
    initialData?.departments?.join(", ") || ""
  );
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const opportunity = {
      name,
      company,
      description,

      mainLink,
      duration,
      departments: departments.split(",").map((d) => d.trim()),
    };

    try {
      if (initialData?._id) {
        // Update existing opportunity
        await axios.put(`/api/opportunities/${initialData._id}`, opportunity);
      } else {
        // Create new opportunity
        await axios.post("/api/opportunities", opportunity);
      }
      await onSubmit();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 bg-gray-800 rounded-xl">
      <h2 className="text-lg font-bold text-white">
        {initialData ? "Edit Opportunity" : "Add Opportunity"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Opportunity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />
        <Input
          label="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          isRequired
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
        />

        <Input
          label="Main Link"
          value={mainLink}
          onChange={(e) => setMainLink(e.target.value)}
          isRequired
        />
        <Input
          label="Departments (comma-separated)"
          value={departments}
          onChange={(e) => setDepartments(e.target.value)}
        />
        <Input
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          isRequired
        />
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialData
            ? "Update Opportunity"
            : "Add Opportunity"}
        </Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OpportunityForm;
