import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar"; // Import ProfileSidebar

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "Arl Jacob",
    email: "arljacobcatane@gmail.com",
    phone: "+63 915 016 8825",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ProfileSidebar />

      {/* Main Profile Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-gray-500">Manage your account here</p>

        {/* Profile Form */}
        <div className="mt-6 space-y-4">
          {Object.keys(profile).map((key) => (
            <div key={key} className="flex items-center space-x-4">
              <label className="w-32 font-semibold capitalize">{key}:</label>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={profile[key]}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              ) : (
                <span className="text-black">{profile[key]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-black text-white px-4 py-2 rounded mr-2"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
