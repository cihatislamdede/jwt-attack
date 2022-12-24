import { Link } from "react-router-dom";

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen justify-center align-middle w-full text-center">
      <Link to={`login`}>Login</Link>
      <Link to={`verify-secure`}>Verify Decode Secure</Link>
      <Link to={`verify-unsecure`}>Verify Decode Unsecure</Link>
      <Link to={`crack`}>Crack Secret</Link>
    </div>
  );
}
