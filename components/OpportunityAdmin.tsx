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
  Checkbox,
  Input,
  Link,
} from "@heroui/react";
import OpportunityForm from "./OpportunityForm";
import { isObjectIdOrHexString } from "mongoose";

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
}

const OpportunitiesAdmin = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    onOpen(); // This ensures the modal opens when editing
  };

  const handleAddNew = () => {
    setSelectedOpportunity(null);
    onOpen(); // Opens the modal when adding a new opportunity
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
              <Button onPress={() => handleEdit(opp)}>Edit</Button>
            </CardBody>
          </Card>
        ))}
      </div>
      <Button
        className="fixed bottom-6 right-6 rounded-full p-4"
        onPress={() => handleAddNew()}
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
    </div>
  );
};

export default OpportunitiesAdmin;
