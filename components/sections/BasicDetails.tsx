"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

export const BasicDetails = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: session } = useSession(); // Fetch the session
  const [submitted, setSubmitted] = useState<Record<
    string,
    FormDataEntryValue
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set(["Select Department"])
  );
  const [selectedSection, setSelectedSection] = React.useState(
    new Set(["Select Section"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
    [selectedKeys]
  );

  const selectedSectionValue = React.useMemo(
    () => Array.from(selectedSection).join(", ").replace(/_/g, ""),
    [selectedSection]
  );

  interface FormElements extends HTMLFormControlsCollection {
    rollno: HTMLInputElement;
    about: HTMLInputElement;
    contact: HTMLInputElement;
    linkedIn: HTMLInputElement;
    section: HTMLInputElement;
  }

  interface CustomFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  const onSubmit = async (e: React.FormEvent<CustomFormElement>) => {
    e.preventDefault();

    if (!selectedValue || selectedValue === "Select Department") {
      setError("Please select a department.");
      return;
    }

    if (!selectedSectionValue || selectedSectionValue === "Select Section") {
      setError("Please select a section.");
      return;
    }

    const formData = Object.fromEntries(new FormData(e.currentTarget));
    const data = {
      ...formData,
      email: session?.user?.email, // Include email from session
    };

    console.log("Payload being sent:", data); // Debugging
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
    <div className="p-6 bg-inherit text-cyan-400 font-pop rounded-lg shadow-lg max-w-lg mx-auto">
      <Form
        className="w-full space-y-4"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <Input
          isRequired
          errorMessage="Please enter a valid roll number"
          label="Roll Number"
          labelPlacement="outside"
          name="rollno"
          placeholder="Enter your roll number"
          type="text"
          className="border-gray-300 rounded-md px-4 py-2 w-full"
        />
        <Dropdown>
          <DropdownTrigger className="border-gray-300 rounded-md px-4 py-2 w-full">
            <Input
              label="Department"
              labelPlacement="outside"
              name="department"
              placeholder="Department"
              value={selectedValue || "Select Department"}
              isRequired
            />
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Department selection"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="bordered"
            onSelectionChange={(keys) => {
              setSelectedKeys(keys);
            }}
          >
            <DropdownItem key="CSE">CSE</DropdownItem>
            <DropdownItem key="CSD">CSD</DropdownItem>
            <DropdownItem key="CSM">CSM</DropdownItem>
            <DropdownItem key="CSIT">CSIT</DropdownItem>
            <DropdownItem key="CSE-CyberSecurity">
              CSE-CyberSecurity
            </DropdownItem>
            <DropdownItem key="IT">IT</DropdownItem>
            <DropdownItem key="ECE">ECE</DropdownItem>
            <DropdownItem key="EEE">EEE</DropdownItem>
            <DropdownItem key="AERO">AERO</DropdownItem>
            <DropdownItem key="MECH">MECH</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input
          type="hidden"
          name="department"
          value={selectedValue}
          isRequired
        />

        <Dropdown>
          <DropdownTrigger className="border-gray-300 rounded-md px-4 py-2 w-full">
            <Input
              label="Section"
              labelPlacement="outside"
              name="section"
              placeholder="Section"
              value={selectedSectionValue || "Select Section"}
              isRequired
            />
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Section selection"
            selectedKeys={selectedSection}
            selectionMode="single"
            variant="bordered"
            onSelectionChange={(keys) => {
              setSelectedSection(keys);
            }}
          >
            <DropdownItem key="A">A</DropdownItem>
            <DropdownItem key="B">B</DropdownItem>
            <DropdownItem key="C">C</DropdownItem>
            <DropdownItem key="D">D</DropdownItem>
            <DropdownItem key="E">E</DropdownItem>
            <DropdownItem key="F">F</DropdownItem>
            <DropdownItem key="G">G</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Input
          type="hidden"
          name="section"
          value={selectedSectionValue}
          isRequired
        />

        <Input
          label="About"
          labelPlacement="outside"
          name="about"
          placeholder="Write a short description about yourself"
          type="text"
          className="border-gray-300 rounded-md px-4 py-2 w-full"
        />
        <Input
          isRequired
          errorMessage="Please enter a valid contact number"
          label="Contact"
          labelPlacement="outside"
          name="contact"
          placeholder="Enter your contact number"
          type="tel"
          className="border-gray-300 rounded-md px-4 py-2 w-full"
        />
        <Input
          label="LinkedIn"
          labelPlacement="outside"
          name="linkedIn"
          placeholder="Enter your LinkedIn profile URL"
          type="url"
          className="border-gray-300 rounded-md px-4 py-2 w-full"
        />
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
