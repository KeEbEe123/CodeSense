"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CertificationForm from "../CertificationForm";
import InternshipForm from "../InternshipForm";
import { useSession } from "next-auth/react";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/react";
import { Card, CardBody } from "@nextui-org/react"; // Card component for displaying entries
import Image from "next/image";
import { TbX } from "react-icons/tb";

const AboutYourself = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: session } = useSession();
  const userid = session?.user?.email;
  const handleDeleteCertification = async (name: string, issuer: string) => {
    try {
      const response = await fetch("/api/removeCertification", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userid, name, issuer }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Certification deleted successfully!");
        // Optionally update state to remove the certification from UI
        setCertifications((prev) =>
          prev.filter((cert) => cert.name !== name || cert.issuer !== issuer)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification.");
    }
  };
  // States to track "None" toggle and added entries
  const [noneToggled, setNoneToggled] = useState({
    // skills: false,
    // projects: false,
    internships: false,
    certifications: false,
  });

  const [certifications, setCertifications] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);

  // Handlers for adding entries
  const handleAddCertification = (certification: any) => {
    setCertifications((prev) => [...prev, certification]);
  };

  const handleAddInternship = (internship: any) => {
    setInternships((prev) => [...prev, internship]);
  };

  const handleNext = () => {
    // Validate form: At least one input or "None" toggled for each section
    const allValid = Object.entries(noneToggled).every(
      ([key, toggled]) =>
        toggled ||
        (key === "certifications"
          ? certifications.length > 0
          : internships.length > 0)
    );
    if (allValid) onSuccess();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 font-koulen min-h-screen">
      {/* Left Pane: Forms Section */}
      <div className="w-full md:w-1/2 flex flex-col space-y-6 pr-6 ml-2 md:ml-4 lg:ml-10">
        {/* Certifications Section */}
        <div>
          <p className="my-2 text-gray-600">
            Certifications and Internships can be added or removed later from
            your profile
          </p>
          <label className="flex items-center space-x-2">
            <p>Add Certifications</p>
            <Tooltip content="Toggle this if you have none">
              <Switch
                isSelected={noneToggled.certifications}
                onChange={() =>
                  setNoneToggled((prev) => ({
                    ...prev,
                    certifications: !prev.certifications,
                  }))
                }
                color="danger"
              >
                None
              </Switch>
            </Tooltip>
          </label>
          {/* Smooth transition for forms */}
          <motion.div
            initial={false}
            animate={{
              height: noneToggled.certifications ? 0 : "auto",
              opacity: noneToggled.certifications ? 0 : 1,
            }}
            className="overflow-hidden"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {!noneToggled.certifications && userid && (
              <div className="mt-4">
                <CertificationForm
                  userId={userid}
                  onAdd={handleAddCertification}
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Internships Section */}
        <div>
          <label className="flex items-center space-x-2">
            <p>Add Internships</p>
            <Tooltip content="Toggle this if you have none">
              <Switch
                isSelected={noneToggled.internships}
                onChange={() =>
                  setNoneToggled((prev) => ({
                    ...prev,
                    internships: !prev.internships,
                  }))
                }
                color="danger"
              >
                None
              </Switch>
            </Tooltip>
          </label>

          {/* Smooth transition for forms */}
          <motion.div
            initial={false}
            animate={{
              height: noneToggled.internships ? 0 : "auto",
              opacity: noneToggled.internships ? 0 : 1,
            }}
            className="overflow-hidden"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {!noneToggled.internships && userid && (
              <div className="mt-4">
                <InternshipForm userId={userid} onAdd={handleAddInternship} />
              </div>
            )}
          </motion.div>
        </div>

        {/* Navigation Button */}
        <Tooltip content="add atleast one certification or internship to continue, or toggle the switch if you have none">
          <button
            onClick={handleNext}
            className="mt-6 px-4 py-2 bg-green-500 font-pop font-bold hover:bg-green-600 text-white rounded"
          >
            Save and Continue
          </button>
        </Tooltip>
      </div>

      {/* Right Pane: Display Entries */}
      <div className="w-full md:w-1/2 flex flex-col space-y-6 ml-3">
        {/* Display Certifications */}
        {certifications.length > 0 && (
          <div>
            <h3 className="text-md font-koulen mb-2">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <Card
                  className="pb-2 bg-gradient-to-bl from-gray-800 to-background"
                  key={index}
                >
                  <CardBody className="text-offwhite font-pop">
                    <button
                      onClick={() =>
                        handleDeleteCertification(cert.name, cert.issuer)
                      }
                    >
                      <TbX className="text-red-600 text-3xl bg-red-600/70 rounded-full p-1 hover:cursor-pointer" />
                    </button>
                    <h3 className="text-lg font-semibold mb-2">{cert.name}</h3>
                    <p className="text-xs text-gray-600">{cert.description}</p>
                    <p className="text-xs text-gray-600">
                      Issued by: {cert.issuer}
                    </p>
                    <p className="text-xs text-gray-600">Date: {cert.date}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Display Internships */}
        {internships.length > 0 && (
          <div>
            <h3 className="text-md font-koulen mb-2">Internships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internships.map((inte, index) => (
                <Card
                  className="pb-2 bg-gradient-to-bl from-gray-800 to-background"
                  key={index}
                >
                  <CardBody className="text-offwhite font-pop">
                    <h3 className="text-lg font-semibold mb-2">{inte.title}</h3>
                    <p className="text-xs text-gray-600">
                      Company: {inte.company}
                    </p>
                    <p className="text-xs text-gray-600">
                      Start Date: {inte.startDate}
                    </p>
                    <p className="text-xs text-gray-600">
                      End Date: {inte.endDate}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutYourself;
