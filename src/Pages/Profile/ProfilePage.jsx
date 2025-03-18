import { useState, useEffect } from "react";
import ProfileSidebar from "./ProfileSidebar"; // Import ProfileSidebar
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            username: userData.username || "Unknown",
            email: userData.email || "Unknown",
            phone: userData.phone || "Unknown",
            firstName: userData.firstName || "Unknown",
            lastName: userData.lastName || "Unknown",
          });
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="bg-black h-20 w-full mt-30"></div>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <ProfileSidebar name={`${profile.firstName} ${profile.lastName}`} />

        {/* Main Profile Content */}
        <div className="flex-1 p-8">
          <h1 className="text-6xl font-bold">My Account</h1>
          <p className="text-3xl text-gray-500">Manage your account here</p>

          {/* Profile Form */}
          <div className="mt-6 space-y-4 text-lg">
            {Object.keys(profile).filter(key => key !== 'role').map((key) => (
              <div key={key} className="flex items-center space-x-4">
                <label className="w-32 font-semibold capitalize">{key}:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={profile[key]}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded w-1/3"
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
              className="bg-black text-white px-8 py-2 rounded mr-2 w-32"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;