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
import CoursesForm from "./CourseForm";

interface Course {
  _id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  description: string;
  technology: string;
  year: number;
  issuedBy: string;
  participants: number;
}

const CoursesAdmin = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    onOpen();
  };

  const handleAddNew = () => {
    setSelectedCourse(null);
    onOpen();
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Manage Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardBody>
              <p>
                <strong>Name:</strong> {course.courseName}
              </p>
              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <Button onPress={() => handleEdit(course)}>Edit</Button>
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
                {selectedCourse ? "Edit Course" : "Add Course"}
              </ModalHeader>
              <ModalBody>
                {isOpen && (
                  <CoursesForm
                    key={selectedCourse?._id || "new"}
                    initialData={selectedCourse}
                    onSubmit={fetchCourses}
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

export default CoursesAdmin;
