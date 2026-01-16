import { Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet";

const SettingsPage = () => {
  return (
    <Fragment>
      <Helmet>
        <title>LiveTalk-Settings</title>
      </Helmet>
      <div className="container">
        <section>
          <h1>User Settings</h1>
          <p>Manage your account settings and preferences here.</p>
        </section>
      </div>
    </Fragment>
  );
};

export default SettingsPage;
