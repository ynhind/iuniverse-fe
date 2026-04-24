import React, { createContext, useContext, useState } from "react";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([
    {
      id: "c1",
      title: "Introduction to React",
      description: "Learn the basics of React.",
      category: "Programming",
      difficulty: "Beginner",
      status: "Draft",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=3270&auto=format&fit=crop",
      teacherId: "1",
      modules: [
        {
          id: "m1",
          title: "Getting Started",
          materials: [{ id: "mat1", title: "React Basics PDF", type: "document" }]
        }
      ]
    },
    {
      id: "c2",
      title: "Advanced Data Structures",
      description: "Deep dive into trees and graphs.",
      category: "Computer Science",
      difficulty: "Advanced",
      status: "Pending Review",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3270&auto=format&fit=crop",
      teacherId: "1",
      modules: []
    }
  ]);

  // Custom breadcrumb label for dynamic pages (e.g. course name instead of ID)
  const [pageTitle, setPageTitle] = useState(null);

  const addCourse = (course) => {
    setCourses([...courses, { ...course, id: Date.now().toString(), status: "Draft" }]);
  };

  const updateCourse = (id, updatedData) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const updateCourseStatus = (id, newStatus, feedback = "") => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: newStatus, feedback } : c));
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, updateCourse, updateCourseStatus, pageTitle, setPageTitle }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  return useContext(CourseContext);
}
