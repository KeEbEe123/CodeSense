"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { Select, SelectItem } from "@heroui/react";

export const BasicDetails = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState<Record<
    string,
    FormDataEntryValue
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGraduationYear, setSelectedGraduationYear] = useState("");
  const [department, setDepartment] = useState<string | null>(null); // ✅ CHANGED
  const [section, setSection] = useState<string | null>(null);
  const [graduationYear, setGraduationYear] = useState<string | null>(null);

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

  const sections = [
    { key: "A", label: "A" },
    { key: "B", label: "B" },
    { key: "C", label: "C" },
    { key: "D", label: "D" },
    { key: "E", label: "E" },
    { key: "F", label: "F" },
    { key: "G", label: "G" },
  ];
  const graduationYears = [
    { key: "2025", label: "2025" },
    { key: "2026", label: "2026" },
    { key: "2027", label: "2027" },
    { key: "2028", label: "2028" },
    { key: "2029", label: "2029" },
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!department) {
      // ✅ CHANGED
      setError("Please select a department."); // ✅ CHANGED
      return;
    }

    if (!section) {
      // ✅ CHANGED
      setError("Please select a section."); // ✅ CHANGED
      return;
    }
    if (!section) {
      // ✅ CHANGED
      setError("Please select your graduation year."); // ✅ CHANGED
      return;
    }

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const data = {
      ...formData,
      email: session?.user?.email, // Include email from session
      department,
      section,
      graduationYear,
    };

    console.log("Payload being sent:", data);
    setSubmitted(data);
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
    <div className="p-6 bg-inherit font-pop rounded-lg max-w-lg mx-auto">
      <Form
        className="w-full space-y-4"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <Input
          isRequired
          validate={(value) => {
            if (value.length < 10) {
              return "Please enter your complete roll number";
            }
          }}
          errorMessage="Please enter a valid roll number"
          label="Roll Number"
          labelPlacement="outside"
          name="rollno"
          placeholder="Enter your roll number"
          type="text"
          classNames={{
            label: "text-primary",
            input: "text-white placeholder-white",
          }}
        />

        <div className="flex w-full space-x-4">
          <Select
            label="Department"
            placeholder="Select Department"
            labelPlacement="outside"
            selectedKey={selectedDepartment}
            onSelectionChange={(keys) =>
              setDepartment(Array.from(keys)[0] as string)
            } // ✅ CHANGED
            isRequired
          >
            {departments.map((dept) => (
              <SelectItem key={dept.key}>{dept.label}</SelectItem>
            ))}
          </Select>

          <Select
            label="Section"
            labelPlacement="outside"
            placeholder="Select Section"
            selectedKey={selectedSection}
            onSelectionChange={(keys) =>
              setSection(Array.from(keys)[0] as string)
            } // ✅ CHANGED
            isRequired
          >
            {sections.map((sec) => (
              <SelectItem key={sec.key}>{sec.label}</SelectItem>
            ))}
          </Select>
        </div>
        <Select
          label="Year of graduation"
          labelPlacement="outside"
          placeholder="Select year of graduation"
          selectedKey={selectedGraduationYear}
          onSelectionChange={(keys) =>
            setGraduationYear(Array.from(keys)[0] as string)
          } // ✅ CHANGED
          isRequired
        >
          {graduationYears.map((gy) => (
            <SelectItem key={gy.key}>{gy.label}</SelectItem>
          ))}
        </Select>
        <div className="mt-4 w-full">
          <Input
            label="About"
            labelPlacement="outside"
            name="about"
            placeholder="Write a short description about yourself"
            type="text"
            isRequired
          />
        </div>
        <div className="mt-4 w-full">
          <Input
            isRequired
            errorMessage="Please enter a valid contact number"
            label="Contact"
            labelPlacement="outside"
            name="contact"
            placeholder="Enter your contact number"
            type="tel"
            classNames={{
              label: "text-black",
              input: "text-white placeholder-white",
            }}
          />
        </div>
        <div className="mt-4 w-full">
          <Input
            isRequired
            errorMessage="Please enter a valid contact number"
            label="Parent's Contact"
            labelPlacement="outside"
            name="parentContact"
            placeholder="Enter your parent's contact number"
            type="tel"
            classNames={{
              label: "text-black",
              input: "text-white placeholder-white",
            }}
          />
        </div>
        <div className="mt-4 w-full">
          <Input
            label="LinkedIn"
            labelPlacement="outside"
            name="linkedIn"
            placeholder="eg: https://www.linkedin.com/in/keertan-b652b2290/"
            type="url"
            isRequired
            classNames={{
              label: "text-primary",
              input: "text-white placeholder-white",
            }}
          />
        </div>
        <Button
          type="submit"
          variant="bordered"
          className="mt-4 bg-blue-500 text-red-200 hover:bg-blue-600 rounded-md px-6 py-2 w-full"
        >
          Submit
        </Button>
      </Form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};
