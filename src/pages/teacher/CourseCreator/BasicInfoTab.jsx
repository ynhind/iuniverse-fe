import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { useUploadFileMutation } from "@/hooks/useTeacher";
import { useToast } from "@/contexts/ToastContext";

export function BasicInfoTab({ courseData, updateCourseData }) {
  const { toast } = useToast();
  const uploadFileMutation = useUploadFileMutation();
  const thumbnailInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const handleImageUpload = async (file, type) => {
    if (!file) return;
    
    const setUploading = type === 'thumbnail' ? setIsUploadingThumbnail : setIsUploadingBanner;
    setUploading(true);

    try {
      // Attempt to upload to real API
      const res = await uploadFileMutation.mutateAsync(file);
      const fileUrl = res?.url || res?.data?.url || URL.createObjectURL(file);
      updateCourseData({ [type]: fileUrl });
      toast({ title: "Upload Success", description: "Image uploaded successfully.", variant: "success" });
    } catch (e) {
      // Fallback to local preview for demo
      console.warn("Upload failed, falling back to local preview", e);
      const localUrl = URL.createObjectURL(file);
      updateCourseData({ [type]: localUrl });
      toast({ title: "Local Preview", description: "Using local preview since upload API failed.", variant: "success" });
    } finally {
      setUploading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCourseData({ [name]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
        <p className="text-sm text-slate-500 mb-6">Start by providing the core details of your course.</p>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium text-slate-700">Course Title <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              name="title" 
              value={courseData.title} 
              onChange={handleChange} 
              placeholder="e.g. Advanced Machine Learning"
              className="max-w-2xl bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription" className="font-medium text-slate-700">Short Description</Label>
            <textarea 
              id="shortDescription" 
              name="shortDescription" 
              value={courseData.shortDescription} 
              onChange={handleChange} 
              placeholder="Brief summary used in course cards (max 120 characters)"
              className="w-full max-w-2xl p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview" className="font-medium text-slate-700">Full Course Overview</Label>
            <textarea 
              id="overview" 
              name="overview" 
              value={courseData.overview} 
              onChange={handleChange} 
              placeholder="Detailed explanation of what students will learn..."
              className="w-full max-w-2xl p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white min-h-[150px]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8 mt-8">
         <h2 className="text-xl font-semibold mb-1">Categorization & Attributes</h2>
         <p className="text-sm text-slate-500 mb-6">Help students find and filter your course.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="subject" className="font-medium text-slate-700">Subject / Category</Label>
              <select 
                id="subject"
                name="subject"
                value={courseData.subject}
                onChange={handleChange}
                className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                <option value="">Select a category...</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Literature">Literature</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="font-medium text-slate-700">Difficulty Level</Label>
              <select 
                id="difficulty"
                name="difficulty"
                value={courseData.difficulty}
                onChange={handleChange}
                className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="font-medium text-slate-700">Course Language</Label>
              <select 
                id="language"
                name="language"
                value={courseData.language}
                onChange={handleChange}
                className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="French">French</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="font-medium text-slate-700">Estimated Duration</Label>
              <Input 
                id="duration" 
                name="duration" 
                value={courseData.duration} 
                onChange={handleChange} 
                placeholder="e.g. 8 Weeks, 40 Hours"
                className="bg-white"
              />
            </div>
         </div>
      </div>

      <div className="border-t border-slate-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold mb-1">Visual Identity / Branding</h2>
        <p className="text-sm text-slate-500 mb-6">Upload images to give your course a professional look.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-3">
             <Label className="font-medium text-slate-700 block">Course Thumbnail (Square)</Label>
             <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={thumbnailInputRef} 
               onChange={(e) => handleImageUpload(e.target.files[0], 'thumbnail')} 
             />
             <div 
               onClick={() => thumbnailInputRef.current?.click()}
               className="border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-8 aspect-square max-w-[250px] cursor-pointer relative overflow-hidden group"
             >
                {isUploadingThumbnail ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <p className="text-sm font-medium text-slate-700">Uploading...</p>
                  </div>
                ) : courseData.thumbnail ? (
                  <>
                    <img src={courseData.thumbnail} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">Change Image</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Upload Image</p>
                    <p className="text-xs text-slate-500 mt-1 text-center">PNG, JPG up to 2MB</p>
                  </>
                )}
             </div>
          </div>
          <div className="space-y-3">
             <Label className="font-medium text-slate-700 block">Course Banner (Wide)</Label>
             <input 
               type="file" 
               accept="image/*" 
               className="hidden" 
               ref={bannerInputRef} 
               onChange={(e) => handleImageUpload(e.target.files[0], 'banner')} 
             />
             <div 
               onClick={() => bannerInputRef.current?.click()}
               className="border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors bg-slate-50 rounded-2xl flex flex-col items-center justify-center p-8 w-full max-w-md h-[180px] cursor-pointer relative overflow-hidden group"
             >
                {isUploadingBanner ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                    <p className="text-sm font-medium text-slate-700">Uploading...</p>
                  </div>
                ) : courseData.banner ? (
                  <>
                    <img src={courseData.banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm font-medium">Change Banner</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Drag & drop or browse</p>
                    <p className="text-xs text-slate-500 mt-1 text-center">Optimal size: 1920x1080px</p>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
