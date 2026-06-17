import { apiClient as api } from '../api';

export const challengesApi = {
  getChallenges: (params: { page?: number; limit?: number; search?: string; status?: string }) => 
    api.get('/challenges/admin/all', { params }),
    
  createChallenge: (data: any) => 
    api.post('/challenges', data),
    
  updateChallenge: (id: string, data: any) => 
    api.put(`/challenges/${id}`, data),
    
  getParticipants: (id: string, params: { page?: number; limit?: number }) => 
    api.get(`/challenges/admin/${id}/participants`, { params }),
    
  getReels: (id: string, params: { page?: number; limit?: number }) => 
    api.get(`/challenges/admin/${id}/reels`, { params }),
    
  approveReel: (reelId: string, status: 'APPROVED' | 'REJECTED') => 
    api.put(`/challenges/admin/reels/${reelId}/approval`, { status }),
    
  freezeLeaderboard: (id: string, winnerUserIds: string[]) => 
    api.post(`/challenges/admin/${id}/winners`, { winnerUserIds }),
    
  getRewards: (id: string) => 
    api.get(`/challenges/admin/${id}/rewards`),
    
  processReward: (txId: string) => 
    api.post(`/challenges/admin/rewards/${txId}/process`),
};
