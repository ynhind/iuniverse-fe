import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherApi } from '@/api/teacher.api';

/* =========================
   QUERY
========================= */

export const useMyCoursesQuery = () => {
  return useQuery({
    queryKey: ['teacher', 'myCourses'],
    queryFn: teacherApi.getMyCourses,
  });
};

export const useCourseDetailQuery = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => teacherApi.getCourseDetail(courseId),
    enabled: !!courseId,
  });
};

export const useCourseStudentsQuery = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId, 'students'],
    queryFn: () => teacherApi.getCourseStudents(courseId),
    enabled: !!courseId,
  });
};

export const useModuleProblemSetsQuery = (moduleId) => {
  return useQuery({
    queryKey: ['module', moduleId, 'problemSets'],
    queryFn: () => teacherApi.getModuleProblemSets(moduleId),
    enabled: !!moduleId,
  });
};

/* =========================
   COURSE
========================= */

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'myCourses'],
      });
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      teacherApi.updateCourse(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['course', variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['teacher', 'myCourses'],
      });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'myCourses'],
      });
    },
  });
};

/* =========================
   MODULE
========================= */

export const useCreateModuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }) =>
      teacherApi.createModule(courseId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['course', variables.courseId],
      });
    },
  });
};

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }) =>
      teacherApi.updateModule(moduleId, data),

    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useDeleteModuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId }) =>
      teacherApi.deleteModule(moduleId),

    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

/* =========================
   MATERIAL
========================= */

export const useAddMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }) =>
      teacherApi.addMaterial(moduleId, data),

    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useUploadMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: teacherApi.uploadMaterial,

    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

/* alias tên cũ để khỏi lỗi import */
export const useUploadFileMutation =
  useUploadMaterialMutation;

export const useUpdateMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      materialId,
      data,
    }) =>
      teacherApi.updateMaterial(
        moduleId,
        materialId,
        data
      ),

    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useDeleteMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      materialId,
    }) =>
      teacherApi.deleteMaterial(
        moduleId,
        materialId
      ),

    onSuccess: (_, variables) => {
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

/* =========================
   QUIZ / PROBLEM SET
========================= */

export const useCreateProblemSetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }) =>
      teacherApi.createProblemSet(
        moduleId,
        data
      ),

    onSuccess: (_, variables) => {
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: [
            'module',
            variables.moduleId,
            'problemSets',
          ],
        });
      }

      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useUpdateProblemSetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      problemSetId,
      data,
    }) =>
      teacherApi.updateProblemSet(
        problemSetId,
        data
      ),

    onSuccess: (_, variables) => {
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: [
            'module',
            variables.moduleId,
            'problemSets',
          ],
        });
      }

      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useDeleteProblemSetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      problemSetId,
    }) =>
      teacherApi.deleteProblemSet(
        problemSetId
      ),

    onSuccess: (_, variables) => {
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: [
            'module',
            variables.moduleId,
            'problemSets',
          ],
        });
      }

      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

/* =========================
   QUESTION
========================= */

export const useAddQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      problemSetId,
      data,
    }) =>
      teacherApi.addQuestion(
        problemSetId,
        data
      ),

    onSuccess: (_, variables) => {
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: [
            'module',
            variables.moduleId,
            'problemSets',
          ],
        });
      }

      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }) =>
      teacherApi.updateQuestion(
        questionId,
        data
      ),

    onSuccess: (_, variables) => {
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: [
            'module',
            variables.moduleId,
            'problemSets',
          ],
        });
      }

      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId }) =>
      teacherApi.deleteQuestion(
        questionId
      ),

    onSuccess: (_, variables) => {
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: [
            'module',
            variables.moduleId,
            'problemSets',
          ],
        });
      }

      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['course', variables.courseId],
        });
      }
    },
  });
};