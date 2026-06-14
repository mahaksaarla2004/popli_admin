import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Calendar, Users, Trophy } from 'lucide-react';

export const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([
    { id: '1', title: 'Daily View King', type: 'DAILY', reward: 500, participants: 124, status: 'ACTIVE', end: 'Tonight 12:00 AM' },
    { id: '2', title: 'Weekend Star', type: 'WEEKLY', reward: 5000, participants: 890, status: 'ACTIVE', end: 'Sunday 11:59 PM' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Challenges Management</h1>
          <p className="text-sm text-slate-500 font-mono">Create and monitor daily/weekly contests</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm rounded-sm uppercase tracking-wide">
            <Plus className="w-4 h-4" />
            Create Challenge
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <div key={challenge.id} className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm hover:border-[#3B82F6]/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-tight">{challenge.title}</h3>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-sm">{challenge.type}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-mono uppercase text-xs flex items-center gap-1"><Trophy className="w-3 h-3"/> Reward Pool</span>
                <span className="font-bold text-emerald-600">₹{challenge.reward}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-mono uppercase text-xs flex items-center gap-1"><Users className="w-3 h-3"/> Participants</span>
                <span className="font-bold text-slate-700">{challenge.participants}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-mono uppercase text-xs flex items-center gap-1"><Calendar className="w-3 h-3"/> Ends At</span>
                <span className="font-medium text-slate-700">{challenge.end}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
              <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors">
                View Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
