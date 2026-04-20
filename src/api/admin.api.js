const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Initializer
const initMockData = () => {
  if (!localStorage.getItem("mockPendingCourses")) {
    const mockCourses = [
      {
        id: "c1",
        courseName: "Advanced React Patterns",
        title: "Advanced React Patterns",
        teacherName: "John Doe",
        teacher: { name: "John Doe" },
        modules: [1, 2, 3],
        description: "Learn advanced patterns for building scalable React applications.",
        status: "Pending Review",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c2",
        courseName: "Spring Boot Microservices",
        title: "Spring Boot Microservices",
        teacherName: "Jane Smith",
        teacher: { name: "Jane Smith" },
        modules: [1, 2],
        description: "Build robust microservices architecture using Spring Boot and Spring Cloud.",
        status: "Pending Review",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      }
    ];
    localStorage.setItem("mockPendingCourses", JSON.stringify(mockCourses));
  }

  if (!localStorage.getItem("mockAnnouncements")) {
    const mockAnnouncements = [
      {
        id: "a1",
        title: "System Maintenance",
        content: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
        audience: "ALL",
        status: "PUBLISHED",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      }
    ];
    localStorage.setItem("mockAnnouncements", JSON.stringify(mockAnnouncements));
  }
};

initMockData();

export const adminApi = {
  getPendingCourses: async () => {
    await delay(500);
    const courses = JSON.parse(localStorage.getItem("mockPendingCourses")) || [];
    return { data: courses.filter(c => c.status === "Pending Review") };
  },

  approveCourse: async (courseId) => {
    await delay(500);
    let courses = JSON.parse(localStorage.getItem("mockPendingCourses")) || [];
    courses = courses.map(c => c.id === courseId ? { ...c, status: "Approved" } : c);
    localStorage.setItem("mockPendingCourses", JSON.stringify(courses));
    return { success: true };
  },

  rejectCourse: async (courseId, feedback) => {
    await delay(500);
    let courses = JSON.parse(localStorage.getItem("mockPendingCourses")) || [];
    courses = courses.map(c => c.id === courseId ? { ...c, status: "Rejected", feedback } : c);
    localStorage.setItem("mockPendingCourses", JSON.stringify(courses));
    return { success: true };
  },

  getAllAnnouncements: async () => {
    await delay(500);
    const announcements = JSON.parse(localStorage.getItem("mockAnnouncements")) || [];
    return { data: announcements };
  },

  createAnnouncement: async (data) => {
    await delay(500);
    let announcements = JSON.parse(localStorage.getItem("mockAnnouncements")) || [];
    const newAnnouncement = {
      ...data,
      id: `a${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    announcements.push(newAnnouncement);
    localStorage.setItem("mockAnnouncements", JSON.stringify(announcements));
    return { data: newAnnouncement };
  },

  publishAnnouncement: async (id) => {
    await delay(500);
    let announcements = JSON.parse(localStorage.getItem("mockAnnouncements")) || [];
    announcements = announcements.map(a => 
      a.id === id ? { ...a, status: "PUBLISHED", publishedAt: new Date().toISOString() } : a
    );
    localStorage.setItem("mockAnnouncements", JSON.stringify(announcements));
    return { success: true };
  },

  deleteAnnouncement: async (id) => {
    await delay(500);
    let announcements = JSON.parse(localStorage.getItem("mockAnnouncements")) || [];
    announcements = announcements.filter(a => a.id !== id);
    localStorage.setItem("mockAnnouncements", JSON.stringify(announcements));
    return { success: true };
  },
};
