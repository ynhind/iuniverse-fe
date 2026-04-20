import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin.api';

export const usePendingCoursesQuery = () =>
  useQuery({
    queryKey: ['admin', 'pendingCourses'],
    queryFn: adminApi.getPendingCourses,
  });

export const useApproveCourseMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => adminApi.approveCourse(courseId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'pendingCourses'] }),
  });
};

export const useRejectCourseMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, feedback }) => adminApi.rejectCourse(courseId, feedback),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'pendingCourses'] }),
  });
};

export const useAnnouncementsQuery = () =>
  useQuery({
    queryKey: ['admin', 'announcements'],
    queryFn: adminApi.getAllAnnouncements,
  });

export const useCreateAnnouncementMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminApi.createAnnouncement(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'announcements'] }),
  });
};

export const usePublishAnnouncementMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminApi.publishAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'announcements'] }),
  });
};

export const useDeleteAnnouncementMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminApi.deleteAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'announcements'] }),
  });
};
