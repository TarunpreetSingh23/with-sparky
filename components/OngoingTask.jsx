'use client';
import ProgressRing from './ProgressRing';
import AvatarGroup from './AvatarGroup';
import { CalendarDays } from 'lucide-react';

export default function OngoingTask() {
  return (
    <div className="card mt-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Candidate Management</div>
          <div className="text-xs text-slate-400">For - Zoho Project</div>
        </div>
        <ProgressRing value={88} />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <div className="text-xs text-slate-500">Teammates</div>
          <AvatarGroup />
        </div>
        <div className="text-xs">
          <div className="text-slate-500">Due date</div>
          <div className="flex items-center gap-1"><CalendarDays size={14}/> <span>June 6, 2022</span></div>
        </div>
      </div>
    </div>
  );
}
