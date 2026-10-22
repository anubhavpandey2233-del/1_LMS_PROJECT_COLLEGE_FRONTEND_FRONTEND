import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser, editProfile } from "../../redux/slice/auth.slice";
import { setalert } from "../../redux/slice/alert.slice";
import { NavLink, useNavigate } from "react-router-dom";
import { IMAGE_URL } from "../../utility/url";
import UserHeader from "./componets/UserHeader";
import UserSildeBar from "./componets/UserSildeBar";

function UserEditProfile(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const user = auth?.user?.data;

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    about: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    avatar: ""
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone_no || "",
        about: user.about || "",
        facebook: user.facebookID || "",
        twitter: user.twitterID || "",
        linkedin: user.linkedInID || "",
        avatar: user.pfp || ""
      });
    }
  }, [user]);



  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!user?._id) {
      dispatch(setalert({ text: "User not logged in!", variant: "error" }));
      return;
    }

    const updatedData = {
      _id: user._id,
      name: profileData.fullName,
      phone_no: profileData.phone,
      about: profileData.about,
      facebookID: profileData.facebook,
      twitterID: profileData.twitter,
      linkedInID: profileData.linkedin,
      pfp: avatarFile
    };

    dispatch(editProfile(updatedData));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setProfileData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  }

  return (
    <div>
      <main>
        {/* =======================
Page Banner START */}
        <UserHeader />
        {/* =======================
Page Banner END */}
        {/* =======================
Page content START */}
        <section className="pt-0">
          <div className="container">
            <div className="row">
              {/* Right sidebar START */}
              <UserSildeBar />
              {/* Right sidebar END */}
              {/* Main content START */}
              <div className="col-xl-9">
                {/* Edit Profile Card START */}
                <div className="card border rounded-3">
                  {/* Card header START */}
                  <div className="card-header border-bottom">
                    <h3 className="mb-0">Edit Profile</h3>
                  </div>
                  {/* Card header END */}
                  {/* Card body START */}
                  <div className="card-body">
                    {/* Form START */}
                    <form className="row g-4" onSubmit={handleProfileSubmit}>
                      {/* Upload image START */}
                      <div className="col-12 justify-content-center align-items-center">
                        <label className="form-label">Profile picture</label>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-xl me-3">
                            <img
                              className="avatar-img rounded-circle border border-white border-3 shadow"
                              src={auth?.user?.data?.pfp[0]?.url || "../../../public/assets/images/avatar/01.jp"}
                              alt="avatar"
                            />
                          </div>
                          <div>
                            <label className="btn btn-primary-soft mb-0" htmlFor="upload-avatar">
                              Upload
                            </label>
                            <input
                              type="file"
                              id="upload-avatar"
                              className="d-none"
                              accept="image/*"
                              onChange={handleAvatarChange}
                            />
                            
                          </div>
                        </div>
                      </div>
                      {/* Upload image END */}

                      {/* Full Name */}
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          disabled
                          value={profileData.email}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>

                      {/* Phone number */}
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                        />
                      </div>

                      {/* About / Bio */}
                      <div className="col-12">
                        <label className="form-label">About Me</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          name="about"
                          value={profileData.about}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div className="col-12">
                        <hr />
                        <h5>Social Media Profiles</h5>
                      </div>

                      {/* Facebook */}
                      <div className="col-md-4">
                        <label className="form-label">Facebook Profile</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="fab fa-facebook text-facebook"></i></span>
                          <input
                            type="url"
                            className="form-control"
                            name="facebook"
                            value={profileData.facebook}
                            onChange={handleProfileChange}
                            placeholder="https://facebook.com/username"
                          />
                        </div>
                      </div>

                      {/* Twitter */}
                      <div className="col-md-4">
                        <label className="form-label">Twitter Profile</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="fab fa-twitter text-twitter"></i></span>
                          <input
                            type="url"
                            className="form-control"
                            name="twitter"
                            value={profileData.twitter}
                            onChange={handleProfileChange}
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div className="col-md-4">
                        <label className="form-label">LinkedIn Profile</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="fab fa-linkedin text-linkedin"></i></span>
                          <input
                            type="url"
                            className="form-control"
                            name="linkedin"
                            value={profileData.linkedin}
                            onChange={handleProfileChange}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-primary mb-0">
                          Save Changes
                        </button>
                      </div>
                    </form>
                    {/* Form END */}
                  </div>
                  {/* Card body END */}
                </div>
                {/* Edit Profile Card END */}
              </div>
              {/* Main content END */}
            </div>
            {/* Row END */}
          </div>
        </section>
        {/* =======================
Page content END */}
      </main>
    </div>
  );
}

export default UserEditProfile;
