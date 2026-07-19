import { useState, useContext, useEffect } from 'react';
import { Context } from '../lib/Context';
import { LabelField } from '../lib/bottons';
import axiosInstance from '../lib/AxiosInstance';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaCamera } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Settings = () => {
  const { userData } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || ''
      });
      setPreviewUrl(userData.profilePic || null);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setPreviewUrl(userData.profilePic || null);
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.bio || ''
    });
  };

  const handleSubmitMutation = useMutation({
    mutationFn: async (mutateData) => {
      const token = localStorage.getItem('loginToken');
      const { data } = await axiosInstance.put('/api/user/updateProfile', mutateData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    },
    onMutate: async (mutateData) => {
      await queryClient.cancelQueries({ queryKey: ["userData"] });
      const previousUserData = queryClient.getQueryData(["userData"]);
      const uploadedImage = mutateData.get("image");
      const optimisticPic = uploadedImage ? URL.createObjectURL(uploadedImage) : previousUserData?.profilePic;

      queryClient.setQueryData(["userData"], (oldData) => {
        if (!oldData) return {};
        return {
          ...oldData,
          name: mutateData.get('name'),
          phone: mutateData.get('phone'),
          location: mutateData.get('location'),
          bio: mutateData.get('bio'),
          profilePic: optimisticPic
        };
      });
      return { previousUserData };
    },
    onError: (err, mutateData, context) => {
      console.log(err.message);
      toast.error(err.message, { position: "top-right" });
      if (context?.previousUserData) {
        queryClient.setQueryData(["userData"], context.previousUserData);
      }
      setIsEditing(true);
    },
    onSuccess: (data) => {
      toast.success("Profile updated", { position: "top-right" });
      setImageFile(null);
      if (data.user?.profilePic) setPreviewUrl(data.user.profilePic);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('phone', formData.phone);
    submitData.append('location', formData.location);
    submitData.append('bio', formData.bio);

    if (!formData.name) {
      return toast.error("You must provide you name", { position: "top-right" })
    }

    if (imageFile) {
      submitData.append('image', imageFile);
    }
    handleSubmitMutation.mutate(submitData);
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full relative bg-slate-50 overflow-x-hidden md:overflow-visible">

      {/* MOBILE PREMIUM SPLASH HEADER */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-b-[40px] shadow-lg md:hidden z-0" />

      <div className={`relative z-10 w-full h-full flex flex-col items-center max-w-6xl mx-auto pb-24 md:pb-8 pt-20 md:pt-8 px-4 sm:px-6`}>

        {!isEditing ? (
          /* ================= VIEW MODE ================= */
          <div className="w-full flex flex-col md:grid md:grid-cols-[0.4fr_1fr] gap-6 xl:gap-8">

            {/* LEFT CARD (Identity & Actions) */}
            <div className="bg-white/80 md:bg-white backdrop-blur-xl rounded-[2rem] border border-white md:border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col items-center text-center">

              {/* Profile Image - Overlapping on Mobile */}
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl -mt-16 md:mt-0 mb-4 bg-gray-50 z-20">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <CgProfile className='w-full h-full text-gray-300' />
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                {formData.name || 'Your Name'}
              </h2>

              <p className="mt-1 text-gray-500 font-medium">
                {formData.email}
              </p>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full max-w-[200px] bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 ease-out shadow-sm cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

            {/* RIGHT CARD (Details) */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-800 hidden md:block mb-2">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Phone Mobile/Desktop unified style */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent md:border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center shrink-0 text-blue-600">
                    <FaPhoneAlt size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</p>
                    <p className="text-gray-800 font-medium break-words">{formData.phone || "Not Provided"}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent md:border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center shrink-0 text-emerald-600">
                    <FaLocationDot size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Location</p>
                    <p className="text-gray-800 font-medium break-words">{formData.location || "Not Provided"}</p>
                  </div>
                </div>

                {/* Bio - Spans full width */}
                <div className="md:col-span-2 flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent md:border-gray-50 mt-2 md:mt-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center shrink-0 text-purple-600">
                    <BiSolidQuoteAltLeft size={20} />
                  </div>
                  <div className="w-full">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">About Me</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">
                      {formData.bio || 'No bio added yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (

          /* ================= EDIT MODE ================= */
          <form id="settings-form" onSubmit={handleSubmit} className="w-full max-w-5xl bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 md:p-8 relative">

            <h2 className="text-2xl font-bold text-gray-800 hidden md:block mb-6">Edit Profile</h2>

            {/* Profile Picture Upload Mobile Splashed */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 md:mb-10">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 shrink-0 -mt-20 md:mt-0 z-20 group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <CgProfile className='w-full h-full text-gray-300' />
                )}

                {/* Overlay for uploading */}
                <label className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <FaCamera className="text-white w-6 h-6 mb-1" />
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Update</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div className="text-center md:text-left flex-1 -mt-2 md:mt-0">
                <h3 className="text-xl font-bold text-gray-800">{formData.name || 'Your Name'}</h3>
                <p className="text-gray-500 font-medium">{formData.email}</p>
                <p className="text-xs text-indigo-500 font-semibold mt-2 md:hidden">Tap photo to change</p>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <LabelField
                text="Full Name" name="name" type="text"
                value={formData.name} onChange={handleChange}
                textColor="text-gray-700" textSize="text-sm font-semibold"
                otherCss="border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all"
                placeholder="Enter your name"
              />

              <LabelField
                text="Email Address" name="email" type="email"
                value={formData.email} disabled={true}
                textColor="text-gray-500" textSize="text-sm font-semibold"
                otherCss="border-transparent bg-gray-100 text-gray-500 cursor-not-allowed rounded-xl"
              />

              <LabelField
                text="Phone Number" name="phone" type="tel"
                value={formData.phone} onChange={handleChange}
                textColor="text-gray-700" textSize="text-sm font-semibold"
                otherCss="border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all"
                placeholder="Enter your phone number"
              />

              <LabelField
                text="Location" name="location" type="text"
                value={formData.location} onChange={handleChange}
                textColor="text-gray-700" textSize="text-sm font-semibold"
                otherCss="border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all"
                placeholder="City, Country"
              />

              <div className="md:col-span-2">
                <LabelField
                  text="Bio" name="bio" type="textarea" rows={4}
                  value={formData.bio} onChange={handleChange}
                  textColor="text-gray-700" textSize="text-sm font-semibold"
                  otherCss="resize-none border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all"
                  placeholder="Tell us a little bit about yourself..."
                />
              </div>
            </div>

            {/* Desktop Save Buttons (Hidden on mobile) */}
            <div className="hidden md:flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button" onClick={handleCancel} disabled={handleSubmitMutation.isPending}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit" disabled={handleSubmitMutation.isPending}
                className="px-8 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px] cursor-pointer"
              >
                {handleSubmitMutation.isPending ? (
                  <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin' />
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* MOBILE STICKY ACTION BAR (Visible only in edit mode on mobile) */}
      {isEditing && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200 p-4 pb-6 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <button
            type="button" onClick={handleCancel} disabled={handleSubmitMutation.isPending}
            className="px-6 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit" form="settings-form" disabled={handleSubmitMutation.isPending}
            className="px-8 py-3 rounded-2xl font-bold text-white bg-indigo-600 shadow-[0_8px_20px_rgba(79,70,229,0.3)] transition-all disabled:opacity-70 flex items-center justify-center flex-1 ml-4"
          >
            {handleSubmitMutation.isPending ? (
              <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin' />
            ) : "Save Changes"}
          </button>
        </div>
      )}

    </div>
  );
}

export default Settings;