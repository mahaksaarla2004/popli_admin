import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Target,
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  Check,
  X,
  Loader2,
  IndianRupee,
} from 'lucide-react';
import { challengesApi } from '@/services/api/challenges';

type TabKey = 'participants' | 'reels' | 'rewards';

export const ChallengeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<TabKey>('participants');
  const [loading, setLoading] = useState(true);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [freezing, setFreezing] = useState(false);
  const [reelActionId, setReelActionId] = useState<string | null>(null);
  const [processingTxId, setProcessingTxId] = useState<string | null>(null);

  const loadAll = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [partRes, reelsRes, rewardsRes, analyticsRes] = await Promise.all([
        challengesApi.getParticipants(id, {}),
        challengesApi.getReels(id, {}),
        challengesApi.getRewards(id),
        challengesApi.getAnalytics(id),
      ]);
      setParticipants(partRes.data.data || []);
      setReels(reelsRes.data.data || []);
      setRewards(rewardsRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      console.error('Failed to load challenge detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleWinner = (userId: string) => {
    setSelectedWinners((prev) =>
      prev.includes(userId)
        ? prev.filter((u) => u !== userId)
        : [...prev, userId],
    );
  };

  const handleFreezeWinners = async () => {
    if (!id || selectedWinners.length === 0) return;
    if (
      !window.confirm(
        `Freeze leaderboard and mark ${selectedWinners.length} participant(s) as winner(s)? This cannot be undone.`,
      )
    ) {
      return;
    }
    setFreezing(true);
    try {
      await challengesApi.freezeLeaderboard(id, selectedWinners);
      setSelectedWinners([]);
      await loadAll();
      setActiveTab('rewards');
    } catch (err) {
      console.error('Failed to freeze leaderboard', err);
      alert('Failed to freeze leaderboard. Check console for details.');
    } finally {
      setFreezing(false);
    }
  };

  const handleReelApproval = async (
    reelId: string,
    status: 'APPROVED' | 'REJECTED',
  ) => {
    setReelActionId(reelId);
    try {
      await challengesApi.approveReel(reelId, status);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId ? { ...r, challengeApprovalStatus: status } : r,
        ),
      );
    } catch (err) {
      console.error('Failed to update reel approval', err);
      alert('Failed to update reel status.');
    } finally {
      setReelActionId(null);
    }
  };

  const handleProcessReward = async (txId: string) => {
    setProcessingTxId(txId);
    try {
      await challengesApi.processReward(txId);
      await loadAll();
    } catch (err) {
      console.error('Failed to process reward', err);
      alert('Failed to process reward transaction.');
    } finally {
      setProcessingTxId(null);
    }
  };

  if (loading && !challenge && participants.length === 0 && reels.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/challenges')}
          className="w-9 h-9 flex items-center justify-center rounded-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
              Challenge Detail
            </h1>
            <p className="text-xs text-slate-500 font-mono">ID: {id}</p>
          </div>
        </div>
      </div>

      {/* Analytics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Participants"
          value={analytics?.totalParticipants ?? participants.length}
        />
        <StatCard
          icon={<Target className="w-3.5 h-3.5" />}
          label="Views"
          value={analytics?.totalViews ?? 0}
        />
        <StatCard
          icon={<Trophy className="w-3.5 h-3.5" />}
          label="Likes"
          value={analytics?.totalLikes ?? 0}
        />
        <StatCard
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Shares"
          value={analytics?.totalShares ?? 0}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <TabButton
          label="Participants"
          active={activeTab === 'participants'}
          onClick={() => setActiveTab('participants')}
          count={participants.length}
        />
        <TabButton
          label="Reels"
          active={activeTab === 'reels'}
          onClick={() => setActiveTab('reels')}
          count={reels.length}
        />
        <TabButton
          label="Rewards"
          active={activeTab === 'rewards'}
          onClick={() => setActiveTab('rewards')}
          count={rewards.length}
        />
      </div>

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="bg-white border border-slate-200 rounded-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <p className="text-xs font-mono uppercase text-slate-500">
              Select winners, then freeze the leaderboard
            </p>
            <button
              disabled={selectedWinners.length === 0 || freezing}
              onClick={handleFreezeWinners}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-sm transition-colors"
            >
              {freezing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trophy className="w-3.5 h-3.5" />
              )}
              Freeze & Select Winners ({selectedWinners.length})
            </button>
          </div>

          {participants.length === 0 ? (
            <EmptyState text="No participants yet." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Rank</th>
                  <th className="p-3">User</th>
                  <th className="p-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {participants
                  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                  .map((p, idx) => (
                    <tr
                      key={p.id ?? p.user?.id}
                      className="border-b border-slate-50 hover:bg-slate-50/60"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedWinners.includes(p.user?.id)}
                          onChange={() => toggleWinner(p.user?.id)}
                          className="w-4 h-4 accent-[#3B82F6] cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-bold text-slate-700">
                        #{idx + 1}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {p.user?.avatar && (
                            <img
                              src={p.user.avatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-slate-800">
                              {p.user?.name || p.user?.username || 'Unknown'}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              @{p.user?.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-700">
                        {p.score ?? 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Reels Tab */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reels.length === 0 ? (
            <EmptyState text="No submissions yet." />
          ) : (
            reels.map((reel) => (
              <div
                key={reel.id}
                className="bg-white border border-slate-200 rounded-sm p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  {reel.creator?.avatar && (
                    <img
                      src={reel.creator.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {reel.creator?.name || reel.creator?.username}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      @{reel.creator?.username}
                    </p>
                  </div>
                  <span
                    className={`ml-auto text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm ${
                      reel.challengeApprovalStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : reel.challengeApprovalStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {reel.challengeApprovalStatus || 'PENDING'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                  <span>{reel._count?.likes ?? 0} likes</span>
                  <span>{reel._count?.comments ?? 0} comments</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    disabled={reelActionId === reel.id}
                    onClick={() => handleReelApproval(reel.id, 'APPROVED')}
                    className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm transition-colors disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    disabled={reelActionId === reel.id}
                    onClick={() => handleReelApproval(reel.id, 'REJECTED')}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="bg-white border border-slate-200 rounded-sm">
          {rewards.length === 0 ? (
            <EmptyState text="No reward transactions yet. Freeze the leaderboard first to queue rewards." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                  <th className="p-3">Winner</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-50 hover:bg-slate-50/60"
                  >
                    <td className="p-3">
                      <p className="font-medium text-slate-800">
                        {tx.winner?.name || tx.winner?.username}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        @{tx.winner?.username}
                      </p>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      <span className="inline-flex items-center gap-0.5">
                        <IndianRupee className="w-3 h-3" />
                        {tx.rewardAmount}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : tx.status === 'FAILED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {tx.status === 'PENDING' && (
                        <button
                          disabled={processingTxId === tx.id}
                          onClick={() => handleProcessReward(tx.id)}
                          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm transition-colors disabled:opacity-50"
                        >
                          {processingTxId === tx.id ? 'Processing...' : 'Process'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) => (
  <div className="bg-white border border-slate-200 rounded-sm p-4">
    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] uppercase mb-1">
      {icon}
      {label}
    </div>
    <p className="text-xl font-bold text-slate-900">{value}</p>
  </div>
);

const TabButton = ({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors border-b-2 ${
      active
        ? 'border-[#3B82F6] text-[#3B82F6]'
        : 'border-transparent text-slate-400 hover:text-slate-600'
    }`}
  >
    {label} ({count})
  </button>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="p-10 text-center text-sm text-slate-400 font-mono">
    {text}
  </div>
);