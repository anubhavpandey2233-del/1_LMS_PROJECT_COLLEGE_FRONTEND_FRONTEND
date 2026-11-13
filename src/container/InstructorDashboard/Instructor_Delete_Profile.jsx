
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InstructorHeader from './components/InstructorHeader';
import InstructorSidebar from './components/InstructorSidebar';
import { deleteProfileImage } from '../../redux/slice/auth.slice';

function Instructor_Delete_Profile() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const instructor = auth?.user?.data || {};
  const isLoading = auth?.isLoading || false;

  const profileImage = Array.isArray(instructor?.pfp)
    ? instructor.pfp[0]?.url
    : instructor?.pfp?.url;

  const defaultAvatar = '/assets/images/avatar/01.jpg';

  const handleDelete = async () => {
    if (!instructor?._id || !profileImage || isLoading) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your profile image?'
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteProfileImage(instructor._id)).unwrap();
    } catch (error) {
      console.error('Profile image deletion failed:', error);
    }
  };

  return (
    <>
      <InstructorHeader />

      <section className="pt-0">
        <div className="container">
          <div className="row">

            <InstructorSidebar />

            <div className="col-xl-9">
              <div className="card border rounded-3">
                <div className="card-header border-bottom">
                  <h3 className="card-title mb-0">
                    Delete Profile Image
                  </h3>
                </div>

                <div className="card-body">
                  <div className="text-center">

                    <img
                      src={profileImage || defaultAvatar}
                      alt="Profile"
                      className="rounded-circle border shadow mb-3"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                      }}
                    />

                    <h5 className="mb-2">
                      {instructor?.name || 'Instructor'}
                    </h5>

                    <p className="text-muted mb-4">
                      {profileImage
                        ? 'You can delete your current profile image here.'
                        : 'You are currently using the default profile image.'}
                    </p>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={!profileImage || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-trash me-2" />
                          Delete Profile Image
                        </>
                      )}
                    </button>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Instructor_Delete_Profile;
