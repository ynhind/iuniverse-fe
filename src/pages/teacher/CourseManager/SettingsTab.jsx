import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

export function SettingsTab({ courseData, updateCourseData }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateCourseData({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-1">Scheduling & Enrollment</h2>
        <p className="text-sm text-slate-500 mb-6">Manage when students can join and access standard content.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="font-medium text-slate-700">Start Date</Label>
            <Input 
              id="startDate" 
              name="startDate" 
              type="date"
              value={courseData.startDate || ""} 
              onChange={handleChange} 
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="font-medium text-slate-700">End Date (Optional)</Label>
            <Input 
              id="endDate" 
              name="endDate" 
              type="date"
              value={courseData.endDate || ""} 
              onChange={handleChange} 
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseID" className="font-medium text-slate-700">Global Course ID</Label>
            <Input 
              id="courseID" 
              name="courseID" 
              type="number"
              placeholder="e.g. 1024"
              value={courseData.courseID || ""} 
              onChange={handleChange} 
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="enrollmentDeadline" className="font-medium text-slate-700">Enrollment Deadline</Label>
            <Input 
              id="enrollmentDeadline" 
              name="enrollmentDeadline" 
              type="date"
              value={courseData.enrollmentDeadline || ""} 
              onChange={handleChange} 
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinCode" className="font-medium text-slate-700">Course Join Code</Label>
            <Input 
              id="joinCode" 
              name="joinCode" 
              type="text"
              placeholder="e.g. FALL2026-CS101"
              value={courseData.joinCode || ""} 
              onChange={handleChange} 
              className="bg-white"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
           <input 
             type="checkbox" 
             id="dripRelease" 
             name="dripRelease"
             checked={courseData.dripRelease || false}
             onChange={handleChange}
             className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
           />
           <Label htmlFor="dripRelease" className="font-medium text-slate-700 cursor-pointer">
              Enable Drip Release (Unlock modules over time)
           </Label>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8 mt-8">
         <h2 className="text-xl font-semibold mb-1">Visibility & Access</h2>
         <p className="text-sm text-slate-500 mb-6">Control who has access to view or join this course.</p>
         
         <div className="space-y-4 max-w-2xl">
            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="radio" 
                name="visibility" 
                value="Private" 
                checked={courseData.visibility === 'Private'}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                 <span className="block font-medium text-slate-800">Private Draft</span>
                 <span className="block text-sm text-slate-500 mt-0.5">Only you and administrators can view this course.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="radio" 
                name="visibility" 
                value="InvitedOnly" 
                checked={courseData.visibility === 'InvitedOnly'}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                 <span className="block font-medium text-slate-800">Invited Students Only</span>
                 <span className="block text-sm text-slate-500 mt-0.5">Hidden from public listing. Requires direct enrollment link or manual invitation.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-primary/30 bg-primary/5 rounded-xl cursor-pointer">
              <input 
                type="radio" 
                name="visibility" 
                value="Public" 
                checked={courseData.visibility === 'Public'}
                onChange={handleChange}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                 <span className="block font-medium text-slate-800">Published / Public</span>
                 <span className="block text-sm text-slate-500 mt-0.5">Visible to all students in the school catalog.</span>
              </div>
            </label>
         </div>
      </div>
    </div>
  );
}
