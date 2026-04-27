import axiosInstance from './configAxios';

export const studentApi = {
  getMyCourses: async () => {
    const response = await axiosInstance.get('/student/my-courses');
    return response.data;
  },

  enrollCourse: async (joinCode) => {
    const response = await axiosInstance.post(`/student/course/enroll?joinCode=${joinCode}`);
    return response.data;
  },

  submitProblemSet: async (problemSetId, data) => {
    const response = await axiosInstance.post(`/student/problem-set/${problemSetId}/submit`, data);
    return response.data;
  },

  getSubmission: async (submissionId) => {
    const response = await axiosInstance.get(`/student/submission/${submissionId}`);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await axiosInstance.get('/student/my-submissions');
    return response.data;
  },

  submitRating: async (courseId, data) => {
    const response = await axiosInstance.post(`/student/courses/${courseId}/ratings`, data);
    return response.data;
  },

  getRating: async (courseId) => {
    const response = await axiosInstance.get(`/student/courses/${courseId}/ratings`);
    return response.data;
  },

  getModuleProblemSets: async (moduleId) => {
    const response = await axiosInstance.get(`/student/module/${moduleId}/problem-sets`);
    return response.data;
  },

  getModulesByCourse: async (courseId) => {
    const response = await axiosInstance.get(`/student/courses/${courseId}/modules`);
    return response.data;
  },

  getModuleContents: async (moduleId) => {
    const response = await axiosInstance.get(`/student/modules/${moduleId}/contents`);
    return response.data;
  },

  getProblemSetQuestions: async (problemSetId) => {
    const response = await axiosInstance.get(`/student/problem-sets/${problemSetId}/questions`);
    return response.data;
  },
};
