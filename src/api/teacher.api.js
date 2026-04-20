import axiosInstance from './configAxios';

export const teacherApi = {
  getMyCourses: async () => {
    const response = await axiosInstance.get('/course/my-courses');
    return response.data;
  },

  getCourseDetail: async (id) => {
    const response = await axiosInstance.get(`/course/${id}`);
    return response.data;
  },

  createCourse: async (data) => {
    const response = await axiosInstance.post('/course/create', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await axiosInstance.put(`/course/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await axiosInstance.delete(`/course/${id}`);
    return response.data;
  },

  getCourseStudents: async (id) => {
    const response = await axiosInstance.get(`/course/${id}/students`);
    return response.data;
  },

  createModule: async (courseId, data) => {
    const response = await axiosInstance.post(`/course/${courseId}/module`, data);
    return response.data;
  },

  updateModule: async (moduleId, data) => {
    const response = await axiosInstance.put(`/course/module/${moduleId}`, data);
    return response.data;
  },

  deleteModule: async (moduleId) => {
    const response = await axiosInstance.delete(`/course/module/${moduleId}`);
    return response.data;
  },

  addMaterial: async (moduleId, data) => {
    const response = await axiosInstance.post(
      `/course/module/${moduleId}/material`,
      data
    );
    return response.data;
  },

  updateMaterial: async (moduleId, materialId, data) => {
    const response = await axiosInstance.put(
      `/course/module/${moduleId}/material/${materialId}`,
      data
    );
    return response.data;
  },

  deleteMaterial: async (moduleId, materialId) => {
    const response = await axiosInstance.delete(
      `/course/module/${moduleId}/material/${materialId}`
    );
    return response.data;
  },

  // QUIZ => MODULE LEVEL
  createProblemSet: async (moduleId, data) => {
    const response = await axiosInstance.post(
      `/course/module/${moduleId}/problem-set`,
      data
    );
    return response.data;
  },

  updateProblemSet: async (problemSetId, data) => {
    const response = await axiosInstance.put(
      `/course/module/problem-set/${problemSetId}`,
      data
    );
    return response.data;
  },

  deleteProblemSet: async (problemSetId) => {
    const response = await axiosInstance.delete(
      `/course/module/problem-set/${problemSetId}`
    );
    return response.data;
  },

  addQuestion: async (problemSetId, data) => {
    const response = await axiosInstance.post(
      `/course/problem-set/${problemSetId}/question`,
      data
    );
    return response.data;
  },

  updateQuestion: async (questionId, data) => {
    const response = await axiosInstance.put(
      `/course/question/${questionId}`,
      data
    );
    return response.data;
  },

  deleteQuestion: async (questionId) => {
    const response = await axiosInstance.delete(
      `/course/question/${questionId}`
    );
    return response.data;
  },

  // GET QUIZ BY MODULE ID
  getModuleProblemSets: async (moduleId) => {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axiosInstance.get(
      `/course/module/${moduleId}/problem-sets`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  },

    uploadMaterial: async ({ file, moduleId, title, type }) => {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();

    formData.append('file', file);
    formData.append('moduleId', String(moduleId));
    formData.append('title', title);
    formData.append('type', type);

    const response = await axiosInstance.post(
      '/course/upload-material',
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

};

