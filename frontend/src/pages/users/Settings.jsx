import { Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { ChangePassword, GetMe } from "../../features/UserFeatures";
import LoadingBox from "../../components/LoadingScreen";
import ErrorBox from "../../components/ErrorBox";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user, isLoading, error } = useSelector((state) => state.user);
  if (!user) {
    navigate("/users/login");
  }

  useEffect(() => {
    dispatch(GetMe());
  }, [dispatch]);

  // Change password handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert.error(`password and password confirm don't match`);
      return;
    }
    dispatch(ChangePassword({ oldPassword, newPassword }));
  };
  return (
    <Fragment>
      <Helmet>
        <title>LiveTalk-Settings</title>
      </Helmet>
      <div className="container">
        {isLoading ? (
          <LoadingBox />
        ) : error ? (
          <ErrorBox>{error}</ErrorBox>
        ) : (
          <>
            <section>
              <h1>User Settings</h1>
              <p>Manage your account settings and preferences here.</p>
            </section>

            {user && (
              <section>
                <h2>Profile Information</h2>
                <p>
                  Name: {user.firstName} {user.lastName}
                </p>
                <p>Email: {user.email}</p>
                <div className="control-buttons">
                  <button onClick={() => setIsPasswordModalOpen(true)}>
                    Change My Password
                  </button>
                  <button
                    className="delete"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete My Account
                  </button>
                </div>
                <div>
                  {/* Password Change Modal */}
                  {isPasswordModalOpen && (
                    <div className="modal">
                      <div className="modal-content">
                        <span
                          className="close"
                          onClick={() => setIsPasswordModalOpen(false)}
                        >
                          &times;
                        </span>
                        <h2 className="modal-heading">Change Password</h2>
                        <form onSubmit={handleChangePassword}>
                          <div className="field">
                            <label>Current Password:</label>
                            <input
                              type="password"
                              name="currentPassword"
                              onChange={(e) => setOldPassword(e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>New Password:</label>
                            <input
                              type="password"
                              name="newPassword"
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                          <div className="field">
                            <label>Confirm New Password:</label>
                            <input
                              type="password"
                              name="confirmNewPassword"
                              onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                              }
                            />
                          </div>
                          <button type="submit">Update Password</button>
                        </form>
                      </div>
                    </div>
                  )}
                  {/* Delete Account Modal */}
                  {isDeleteModalOpen && (
                    <div className="modal">
                      <div className="modal-content">
                        <span
                          className="close"
                          onClick={() => setIsDeleteModalOpen(false)}
                        >
                          &times;
                        </span>
                        <h2 className="modal-heading">Delete Account</h2>
                        <p>
                          Are you sure you want to delete your account? This
                          action cannot be undone.
                        </p>
                        <div className="control-buttons">
                          <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="cancel"
                          >
                            Cancel
                          </button>
                          <button className="delete">Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
};

export default SettingsPage;
