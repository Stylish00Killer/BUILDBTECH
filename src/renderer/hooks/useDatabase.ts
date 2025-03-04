import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db.service';
import { LabReport } from '../../shared/types';
import { useAuth } from './useAuth';

export function useDatabase() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const useLabReports = () => {
    return useQuery({
      queryKey: ['labReports', user?.id],
      queryFn: async () => {
        if (!user) return [];
        return await dbService.getLabReports(user.id);
      },
      enabled: !!user
    });
  };

  const useSaveLabReport = () => {
    return useMutation({
      mutationFn: async (report: Omit<LabReport, 'id' | 'createdAt'>) => {
        return await dbService.saveLabReport(report);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['labReports', user?.id] });
      }
    });
  };

  return {
    useLabReports,
    useSaveLabReport
  };
}