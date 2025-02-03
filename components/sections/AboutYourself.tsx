"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CertificationForm from "../CertificationForm";
import InternshipForm from "../InternshipForm";
import { useSession } from "next-auth/react";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/react";
import { Card, CardBody } from "@nextui-org/react"; // Card component for displaying entries

const AboutYourself = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: session } = useSession();
  const userid = session?.user?.email;

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
    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 font-koulen">
      {/* Left Pane: Add items */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Certifications Section */}
        <div>
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

          {/* Smooth size transition */}
          <motion.div
            initial={false} // Prevents resetting on remount
            animate={{
              height: noneToggled.certifications ? 0 : "auto",
              opacity: noneToggled.certifications ? 0 : 1,
            }}
            style={{ overflow: "hidden" }}
            transition={{
              height: { duration: 0.5, ease: "easeInOut" },
              opacity: { duration: 0.3, ease: "easeInOut" },
            }}
          >
            {!noneToggled.certifications && userid && (
              <div className="mt-4">
                <CertificationForm
                  userId={userid}
                  onAdd={handleAddCertification} // Pass handler to form
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

          {/* Smooth size transition */}
          <motion.div
            initial={false}
            animate={{
              height: noneToggled.internships ? 0 : "auto",
              opacity: noneToggled.internships ? 0 : 1,
            }}
            style={{ overflow: "hidden" }}
            transition={{
              height: { duration: 0.5, ease: "easeInOut" },
              opacity: { duration: 0.3, ease: "easeInOut" },
            }}
          >
            {!noneToggled.internships && userid && (
              <div className="mt-4">
                <InternshipForm
                  userId={userid}
                  onAdd={handleAddInternship} // Pass handler to form
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Navigation Button */}
        <button
          onClick={handleNext}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>

      {/* Right Pane: Display added entries */}
      <div className="lg:w-full md:w-1/2 md:space-y-6 hidden md:block">
        <h2 className="text-lg font-koulen">Your Entries</h2>

        {/* Display Certifications */}
        {certifications.length > 0 && (
          <div className="">
            <h3 className="text-md font-koulen mb-2">Certifications</h3>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <Card
                  className="pb-2 mx-3 bg-gradient-to-bl from-gray-800 to-background"
                  key={index}
                >
                  <CardBody className="text-offwhite font-pop">
                    <h3 className="text-2xl font-semibold mb-2">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                    <p className="text-sm text-gray-600">
                      Issued by: {cert.issuer}
                    </p>
                    <p className="text-sm text-gray-600">Date: {cert.date}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
        {internships.length > 0 && (
          <div className="">
            <h3 className="text-md font-koulen mb-2">Internships</h3>
            <div className="space-y-4">
              {internships.map((inte, index) => (
                <Card
                  className="pb-2 mx-3 bg-gradient-to-bl from-gray-800 to-background"
                  key={index}
                >
                  <CardBody className="text-offwhite font-pop">
                    <h3 className="text-2xl font-semibold mb-2">
                      {inte.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Company: {inte.company}
                    </p>
                    <p className="text-sm text-gray-600">
                      Start Date: {inte.startDate}
                    </p>
                    <p className="text-sm text-gray-600">
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
