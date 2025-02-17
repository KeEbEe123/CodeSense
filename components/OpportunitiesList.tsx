"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Switch,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { TbCheck, TbX } from "react-icons/tb";

interface Opportunity {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  company: string;
  mainLink: string;
  formLink: string;
  departments: string[];
  applied: string[];
  lastDate: string;
}

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
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

  const handleToggleApplied = (opp: Opportunity) => {
    if (!opp._id) {
      console.error("Error: Missing opportunity ID");
      return;
    }

    if (opp.applied.includes(userEmail)) {
      updateApplicationStatus(opp);
    } else {
      setSelectedOpportunity(opp);
      onOpen();
    }
  };

  const updateApplicationStatus = async (opp: Opportunity) => {
    try {
      await axios.patch(`/api/opportunities/apply/${opp._id}`, {
        email: userEmail,
      });
      fetchOpportunities();
    } catch (error) {
      console.error("Error updating application status", error);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Available Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp) => (
          <Card
            key={opp._id}
            className="pb-2 pr-14 bg-gradient-to-bl from-gray-800 to-background w-full lg:pr-8"
          >
            <CardBody className="font-pop text-offwhite">
              <div className="flex justify-between">
                <h3 className="text-lg lg:text-3xl font-semibold mb-2 pb-2 border-b-2 border-gray-600">
                  {opp.name}{" "}
                  <span className="font-thin font-pop text-md px-1">@</span>
                  {opp.company}
                </h3>
                {new Date(opp.lastDate) < new Date() ? (
                  <Chip>Completed</Chip>
                ) : (
                  <Chip>Ongoing</Chip>
                )}
              </div>

              <p className="text-sm sm:text-base">{opp.description}</p>
              <p className="text-xs sm:text-sm text-gray-400">
                Last date to apply:
                <span className="text-red-600"> {opp.lastDate} </span>
              </p>
              {/* <div className="absolute top-2 right-2"></div> */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-thin font-pop text-sm px-1">
                  Eligible Departments:
                </span>
                <div className="flex flex-wrap gap-2">
                  {opp.departments.map((department) => (
                    <Chip key={department}>{department}</Chip>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex gap-4">
                <a href={opp.mainLink} target="_blank">
                  <Button className="text-blue-400">Apply Here</Button>
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p className="font-thin font-pop text-sm">
                  Have you applied to this opportunity?
                </p>
                <Switch
                  isSelected={opp.applied.includes(userEmail)}
                  onChange={() => handleToggleApplied(opp)}
                  color="danger"
                  thumbIcon={({ isSelected }) =>
                    isSelected ? (
                      <TbCheck size={20} className="text-background" />
                    ) : (
                      <TbX size={20} className="text-background" />
                    )
                  }
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Application</ModalHeader>
              <ModalBody>
                <p>
                  Please make sure you have applied at the given link before
                  toggling this switch on.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    updateApplicationStatus(selectedOpportunity!);
                    onClose();
                  }}
                >
                  Yes, I'm sure
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OpportunitiesList;
