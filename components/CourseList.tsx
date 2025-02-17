"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Button, Chip } from "@heroui/react";

interface Course {
  _id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  startDate: string;
  endDate: string;
  department: string;
  description: string;
  link: string;
}

const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card
            key={course._id}
            className="pb-2 pr-14 bg-gradient-to-bl from-gray-800 to-background w-full lg:pr-28"
          >
            <CardBody className="font-pop text-offwhite">
              <h3 className="text-lg lg:text-3xl font-semibold mb-2 pb-2 border-b-2 border-gray-600">
                {course.courseName}{" "}
                <span className="font-thin font-pop text-md px-1">by</span>{" "}
                {course.instructor}
              </h3>
              <p className="text-sm sm:text-base">{course.description}</p>

              <div className="mt-2 flex gap-4">
                <Button
                  className="text-blue-400"
                  onPress={() =>
                    window.open(course.link, "_blank", "noopener,noreferrer")
                  }
                >
                  Go to course
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesList;
