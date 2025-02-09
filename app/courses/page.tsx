"use client";
import React from "react";
import CourseForm from "@/components/CourseForm";
import CoursesList from "@/components/CourseList";

const page = () => {
  return (
    <div className="text-cyan-400 text-8xl font-koulen">
      <h1 className="flex justify-center p-6">
        <span></span>
        Courses List:
      </h1>
      <CoursesList />
    </div>
  );
};

export default page;
