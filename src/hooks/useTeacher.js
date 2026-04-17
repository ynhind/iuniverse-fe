import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '../api/teacher.api';

// --- QUERIES ---

export const useMyCoursesQuery = () => {
  return useQuery({
    queryKey: ['teacher', 'myCourses'],
    queryFn: teacherApi.getMyCourses,
  });
};

export const useCourseDetailQuery = (id) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => teacherApi.getCourseDetail(id),
    enabled: !!id,
  });
};

export const useCourseStudentsQuery = (id) => {
  return useQuery({
    queryKey: ['course', id, 'students'],
    queryFn: () => teacherApi.getCourseStudents(id),
    enabled: !!id,
  });
};


// --- MUTATIONS ---

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'myCourses'] });
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => teacherApi.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'myCourses'] });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'myCourses'] });
    },
  });
};

export const useCreateModuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }) => teacherApi.createModule(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Needs courseId for invalidation optimally, passing it through variables is a common practice
    mutationFn: ({ moduleId, data }) => teacherApi.updateModule(moduleId, data),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useDeleteModuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId }) => teacherApi.deleteModule(moduleId),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useAddMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, data }) => teacherApi.addMaterial(moduleId, data),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useUpdateMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, materialId, data }) => teacherApi.updateMaterial(moduleId, materialId, data),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useDeleteMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, materialId }) => teacherApi.deleteMaterial(moduleId, materialId),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useCreateProblemSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, data }) => teacherApi.createProblemSet(moduleId, data),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useUpdateProblemSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => teacherApi.updateProblemSet(id, data),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useDeleteProblemSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => teacherApi.deleteProblemSet(id),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useAddQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ problemSetId, data }) => teacherApi.addQuestion(problemSetId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific course or problem set queries
      if (variables.courseId) {
         queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data }) => teacherApi.updateQuestion(questionId, data),
    onSuccess: (_, variables) => {
      if (variables.courseId) {
         queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }) => teacherApi.deleteQuestion(questionId),
    onSuccess: (_, variables) => {
       if (variables.courseId) {
         queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
    },
  });
};
