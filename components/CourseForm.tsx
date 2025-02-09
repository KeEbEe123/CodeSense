"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input, Textarea, Button, Select, SelectItem } from "@heroui/react";

interface CourseFormProps {
  initialData?: any;
  onSubmit: () => Promise<void>;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const [courseId, setCourseId] = useState(initialData?.courseId || "");
  const [courseName, setCourseName] = useState(initialData?.courseName || "");
  const [instructor, setInstructor] = useState(initialData?.instructor || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [technology, setTechnology] = useState(initialData?.technology || "");
  const [year, setYear] = useState(initialData?.year || "");
  const [issuedBy, setIssuedBy] = useState(initialData?.issuedBy || "");
  const [participants, setParticipants] = useState(
    initialData?.participants || 0
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const course = {
      courseId,
      courseName,
      instructor,
      description,
      technology,
      year,
      issuedBy,
      participants,
      link,
    };

    try {
      if (initialData?._id) {
        await axios.put(`/api/courses/${initialData._id}`, course);
      } else {
        await axios.post("/api/courses", course);
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
        {initialData ? "Edit Course" : "Add Course"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          isRequired
          isDisabled={!!initialData}
        />
        <Input
          label="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          isRequired
        />
        <Input
          label="Instructor"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          isRequired
        />
        <Input
          label="Link to course"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value || "")}
          isRequired
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
        />
        <Input
          label="Technology"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          isRequired
        />
        <Input
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          isRequired
        />
        <Input
          label="Issued By"
          value={issuedBy}
          onChange={(e) => setIssuedBy(e.target.value)}
          isRequired
        />
        <Input
          label="Participants"
          type="number"
          value={participants}
          onChange={(e) => setParticipants(parseInt(e.target.value) || 0)}
          isRequired
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Course" : "Add Course"}
        </Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CourseForm;
