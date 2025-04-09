"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import OpportunityForm from "./OpportunityForm";

interface Opportunity {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  company: string;
  mainLink: string;
  formLink: string;
  departments: string[];
  duration: string;
  applied: string[];
}

interface ApplicantDetails {
  email: string;
  name?: string;
  department?: string;
  year?: string;
}

const OpportunitiesAdmin = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [applicantDetails, setApplicantDetails] = useState<ApplicantDetails[]>([]);
  const [sortType, setSortType] = useState<"year" | "department" | "none">("none");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get("/api/opportunities");
      setOpportunities(response.data);
    } catch (error) {
      console.error("Error fetching opportunities", error);
    }
  };

  const handleEdit = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedOpportunity(null);
    onOpen();
  };

  const extractYear = (email: string) => email.slice(0, 2);
  const extractDepartment = (email: string) => email.slice(4, 8);

  const fetchApplicantDetails = async (emails: string[]) => {
    const details: ApplicantDetails[] = [];

    await Promise.all(
      emails.map(async (email) => {
        try {
          const response = await axios.get(`/api/getUserByEmail?email=${email}`);
          const user = response.data.user;

          details.push({
            email,
            name: user.name || "",
            department: user.department || extractDepartment(email),
            year: user.year || extractYear(email),
          });
        } catch (error) {
          console.error(`Failed to fetch user for ${email}`, error);
          details.push({
            email,
            name: "",
            department: extractDepartment(email),
            year: extractYear(email),
          });
        }
      })
    );

    setApplicantDetails(details);
  };

  const handleViewApplicants = async (opp: Opportunity) => {
    await fetchApplicantDetails(opp.applied || []);
    setIsModalOpen(true);
  };

  const getSortedApplicants = () => {
    let sorted = [...applicantDetails];
    if (sortType === "year") {
      sorted.sort((a, b) => (a.year || "").localeCompare(b.year || ""));
    } else if (sortType === "department") {
      sorted.sort((a, b) => (a.department || "").localeCompare(b.department || ""));
    }
    return sorted;
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Manage Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp) => (
          <Card key={opp.id}>
            <CardBody>
              <p>
                <strong>Company:</strong> {opp.company}
              </p>
              <p>
                <strong>Duration:</strong> {opp.duration}
              </p>
              <div className="flex gap-2 mt-2">
                <Button onPress={() => handleEdit(opp)}>Edit</Button>
                <Button
                  color="primary"
                  onPress={() => handleViewApplicants(opp)}
                >
                  View Applicants
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Button
        className="fixed bottom-6 right-6 rounded-full p-4"
        onPress={handleAddNew}
      >
        +
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="bg-gradient-to-bl from-gray-800 to-background"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-pop text-offwhite text-2xl">
                Add Internship
              </ModalHeader>
              <ModalBody>
                {isOpen && (
                  <OpportunityForm
                    key={selectedOpportunity?._id || "new"}
                    initialData={selectedOpportunity}
                    onSubmit={fetchOpportunities}
                    onClose={onClose}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="flat" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        backdrop="opaque"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-semibold">
                Applicants
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4 mb-4">
                  <Button
                    size="sm"
                    onPress={() => setSortType("year")}
                    color={sortType === "year" ? "success" : "default"}
                  >
                    Sort by Year
                  </Button>
                  <Button
                    size="sm"
                    onPress={() => setSortType("department")}
                    color={sortType === "department" ? "success" : "default"}
                  >
                    Sort by Dept.
                  </Button>
                </div>
                <ul className="space-y-2">
                  {getSortedApplicants().map((applicant, index) => (
                    <li
                      key={index}
                      className="bg-gray-800 p-3 rounded-md shadow-md"
                    >
                      <div>
                        <strong>Name:</strong> {applicant.name || "N/A"}
                      </div>
                      <div>
                        <strong>Email:</strong> {applicant.email}
                      </div>
                      <div>
                        <strong>Year:</strong> {applicant.year} &nbsp; | &nbsp;
                        <strong>Dept:</strong> {applicant.department}
                      </div>
                    </li>
                  ))}
                  {getSortedApplicants().length === 0 && (
                    <p className="text-sm text-gray-400">No applicants yet.</p>
                  )}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OpportunitiesAdmin;
