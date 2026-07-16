import { useState, useContext, useEffect } from 'react';
import { Context } from '../lib/Context';
import { LabelField } from '../lib/bottons';
import axiosInstance from '../lib/AxiosInstance';
import toast from 'react-hot-toast';
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
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

  const queryClient = useQueryClient()

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
        throw new Error(data.message)
      }

      return data
    },

    onMutate: async (mutateData) => {

      await queryClient.cancelQueries({ queryKey: ["userData"] })

      const previousUserData = queryClient.getQueryData(["userData"])

      queryClient.setQueryData(["userData"], (oldData) => {

        if (!oldData) return []

        return {
          ...oldData,
          name: mutateData.get('name'),
          phone: mutateData.get('phone'),
          location: mutateData.get('location'),
          bio: mutateData.get('bio'),
        }

      })

      return { previousUserData }

    },

    onError: (err, mutateData, context) => {

      console.log(err.message);
      toast.error(err.message, { position: "top-right" })

      if (context?.previousUserData) {
        queryClient.setQueryData(["userData"], context.previousUserData)
      }

    },

    onSuccess: (data) => {
      toast.success("Profile updated", { position: "top-right" })
      setIsEditing(false)
      setImageFile(null)
      if (data.user?.profilePic) setPreviewUrl(data.user.profilePic)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] })
    }

  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const submitData = new FormData();

    submitData.append('name', formData.name);
    submitData.append('phone', formData.phone);
    submitData.append('location', formData.location);
    submitData.append('bio', formData.bio);

    if (imageFile) {
      submitData.append('image', imageFile);
    }

    handleSubmitMutation.mutate(submitData)

  }

  return (
    <div className="max-w-6xl h-full flex items-center flex-col">
      <div className={`${isEditing ? "max-w-4xl" : "max-w-6xl"} w-full flex flex-col`}>

        {/* --- FIXED HEADER --- */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-end items-center shrink-0">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-100 text-blue-600 font-semibold py-2 px-5 rounded-lg hover:bg-blue-200 
                transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (

          <div className="h-full p-4 bg-slate-50">
            <div className="h-full grid grid-cols-[0.4fr_1fr] gap-6">

              {/* Left Profile Card */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col items-center 
                justify-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg mb-5">

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CgProfile className='w-full h-full opacity-50' />
                  )}

                </div>

                <h2 className="mt-4 text-2xl font-bold">
                  {formData.name}
                </h2>

                <p className="mt-2 text-gray-500">
                  {formData.email}
                </p>

                <div className='flex items-center justify-start gap-3 w-full mt-3'>

                  <FaPhoneAlt />

                  <p className="text-gray-500 break-all">
                    {formData.phone || "Not Provided"}
                  </p>

                </div>

                <div className='flex items-center justify-start gap-3 w-full mt-4'>

                  <FaLocationDot />

                  <p className="text-gray-500 break-all max-h-10">
                    {formData.location || "Not Provided"}
                  </p>

                </div>

              </div>

              {/* Right Details Card */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col justify-center">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Name */}
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                      Full Name
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                      {formData.name || '-'}
                    </h3>
                  </div>

                  {/* Email */}
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                      Email
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 break-all">
                      {formData.email || '-'}
                    </h3>
                  </div>

                  {/* Phone */}
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                      Phone
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                      {formData.phone || 'Not Provided'}
                    </h3>
                  </div>

                  {/* Location */}
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                      Location
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 break-words">
                      {formData.location || 'Not Provided'}
                    </h3>
                  </div>

                  {/* Bio Full Width */}
                  <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
                      About Me
                    </p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words max-h-32 overflow-auto 
                      scroll-smooth">
                      {formData.bio || 'No bio added yet.'}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

        ) : (

          <form id="settings-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

            {/* Profile Picture & Basic Info */}
            <div className="flex items-center gap-5">
              <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 shrink-0">

                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CgProfile className='w-full h-full opacity-50' />
                )}

                {isEditing && (
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white text-xs font-semibold">Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-800">{formData.name || 'Your Name'}</h3>
                <p className="text-gray-500 text-sm font-medium">{formData.email}</p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <LabelField
                text="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                textColor="text-gray-700"
                textSize="text-sm"
                otherCss={`border ${isEditing ? 'border-gray-400 focus:ring-blue-500' : 'border-transparent bg-gray-50'}`}
                placeholder="Enter your name"
              />

              <LabelField
                text="Email Address"
                name="email"
                type="email"
                value={formData.email}
                disabled={true}
                textColor="text-gray-700"
                textSize="text-sm"
                otherCss="border border-transparent bg-gray-100 text-gray-500 cursor-not-allowed"
              />

              <LabelField
                text="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                textColor="text-gray-700"
                textSize="text-sm"
                otherCss={`border ${isEditing ? 'border-gray-400 focus:ring-blue-500' : 'border-transparent bg-gray-50'}`}
                placeholder={isEditing ? "Enter your phone number" : "Not set"}
              />

              <LabelField
                text="Location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                textColor="text-gray-700"
                textSize="text-sm"
                otherCss={`border ${isEditing ? 'border-gray-400 focus:ring-blue-500' : 'border-transparent bg-gray-50'}`}
                placeholder={isEditing ? "City, Country" : "Not set"}
              />
            </div>

            <LabelField
              text="Bio"
              name="bio"
              type="textarea"
              rows={3} // Reduced to 3 to save vertical space
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              textColor="text-gray-700"
              textSize="text-sm"
              otherCss={`resize-none border mb-2 ${isEditing ? 'border-gray-400 focus:ring-blue-500' : 'border-transparent bg-gray-50'}`}
              placeholder={isEditing ? "Tell us a little bit about yourself..." : "No bio provided."}
            />
          </form>

        )}

        {/* --- FIXED FOOTER ACTIONS --- */}
        {isEditing && (
          <div className="px-6 py-4 flex justify-end gap-4 shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={handleCancel}
              disabled={handleSubmitMutation.isPending}
              className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="settings-form" // Connects to the form ID above
              disabled={handleSubmitMutation.isPending}
              className="px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px] cursor-pointer shadow-sm"
            >
              {handleSubmitMutation.isPending ? (
                <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Settings;