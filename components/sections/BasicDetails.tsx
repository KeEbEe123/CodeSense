"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Select, SelectItem } from "@heroui/react";

interface User {
  rollno?: string;
  About?: string;
  Contact?: string;
  linkedIn?: string;
  department?: string;
  section?: string;
  ParentContact?: string;
  graduationYear?: string;
}

interface BasicDetailsProps {
  onSuccess: () => void;
  user?: User; // User details for editing
}

export const BasicDetails = ({ onSuccess, user }: BasicDetailsProps) => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [rollno, setRollno] = useState(user?.rollno || "");
  const [about, setAbout] = useState(user?.About || "");
  const [contact, setContact] = useState(user?.Contact || "");
  const [linkedIn, setLinkedIn] = useState(user?.linkedIn || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [section, setSection] = useState(user?.section || "");
  const [parentContact, setParentContact] = useState(user?.ParentContact || "");
  const [graduationYear, setGraduationYear] = useState(
    user?.graduationYear || ""
  );

  useEffect(() => {
    if (user) {
      setRollno(user.rollno || "");
      setAbout(user.About || "");
      setContact(user.Contact || "");
      setLinkedIn(user.linkedIn || "");
      setDepartment(user.department || "");
      setSection(user.section || "");
      setParentContact(user.ParentContact || "");
      setGraduationYear(user.graduationYear || "");
    }
  }, [user]);

  const departments = [
    { key: "CSE", label: "CSE" },
    { key: "CSD", label: "CSD" },
    { key: "CSM", label: "CSM" },
    { key: "CSIT", label: "CSIT" },
    { key: "CSE-CyberSecurity", label: "CSE-CyberSecurity" },
    { key: "IT", label: "IT" },
    { key: "ECE", label: "ECE" },
    { key: "EEE", label: "EEE" },
    { key: "AERO", label: "AERO" },
    { key: "MECH", label: "MECH" },
  ];

  const sections = ["A", "B", "C", "D", "E", "F", "G"].map((sec) => ({
    key: sec,
    label: sec,
  }));

  const graduationYears = ["2025", "2026", "2027", "2028", "2029"].map(
    (gy) => ({
      key: gy,
      label: gy,
    })
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contact.length != 10 || parentContact.length != 10) {
      setError("Contact must be 10 Digits");
      return;
    }

    if (!department) {
      setError("Please select a department.");
      return;
    }
    if (!section) {
      setError("Please select a section.");
      return;
    }
    if (!graduationYear) {
      setError("Please select your graduation year.");
      return;
    }

    const data = {
      rollno,
      about,
      contact,
      linkedIn,
      email: session?.user?.email, // Include email from session
      department,
      section,
      parentContact,
      graduationYear,
    };

    console.log("Payload being sent:", data);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/update-basic-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to update details.");
      }

      setSuccess("Details updated successfully!");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <div className="p-6 bg-inherit font-pop rounded-lg max-w-lg mx-auto lg:min-w-80">
      <Form className="w-full space-y-4" onSubmit={onSubmit}>
        <Input
          isRequired
          value={rollno}
          onChange={(e) => setRollno(e.target.value.toUpperCase())}
          label="Roll Number"
          name="rollno"
          placeholder="Enter your roll number"
          type="text"
        />

        <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
          <Select
            label="Department"
            placeholder={department ? department : "Select department"}
            selectedKey={department}
            onSelectionChange={(keys) =>
              setDepartment(Array.from(keys)[0] as string)
            }
            isRequired
          >
            {departments.map((dept) => (
              <SelectItem key={dept.key}>{dept.label}</SelectItem>
            ))}
          </Select>

          <Select
            label="Section"
            placeholder={section ? section : "Select section"}
            selectedKey={section}
            onSelectionChange={(keys) =>
              setSection(Array.from(keys)[0] as string)
            }
            isRequired
          >
            {sections.map((sec) => (
              <SelectItem key={sec.key}>{sec.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Select
          label="Year of Graduation"
          placeholder={graduationYear ? graduationYear : "Select Year"}
          selectedKey={graduationYear}
          onSelectionChange={(keys) =>
            setGraduationYear(Array.from(keys)[0] as string)
          }
          isRequired
        >
          {graduationYears.map((gy) => (
            <SelectItem key={gy.key}>{gy.label}</SelectItem>
          ))}
        </Select>

        <Input
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          label="About"
          name="about"
          placeholder="Write a short description about yourself"
          type="text"
          isRequired
        />

        <Input
          isRequired
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          label="Contact"
          name="contact"
          placeholder="Enter your contact number"
          type="tel"
        />

        <Input
          isRequired
          value={parentContact}
          onChange={(e) => setParentContact(e.target.value)}
          label="Parent's Contact"
          name="parentContact"
          placeholder="Enter your parent's contact number"
          type="tel"
        />

        <Input
          value={linkedIn}
          onChange={(e) => setLinkedIn(e.target.value)}
          label="LinkedIn"
          name="linkedIn"
          placeholder="Enter LinkedIn URL"
          type="url"
          isRequired
        />

        <Button
          type="submit"
          variant="bordered"
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded-md px-6 py-2 w-full"
        >
          Save
        </Button>
      </Form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};
