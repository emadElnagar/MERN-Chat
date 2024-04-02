import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container not-found">
      <h1>404</h1>
      <p>Oops, page not found</p>
      <Link to='/'>return to home</Link>
    </div>
  )
}

export default NotFound;
