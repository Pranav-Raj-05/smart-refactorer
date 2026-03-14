import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {

  const location = useLocation();

  useEffect(() => {
    console.warn("404 Route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">

      <div className="text-center space-y-4">

        <h1 className="text-5xl font-bold font-mono text-foreground">
          404
        </h1>

        <p className="text-lg text-muted-foreground">
          The page you’re looking for does not exist.
        </p>

        <Link
          to="/"
          className="text-primary underline hover:text-primary/80"
        >
          Return to Dashboard
        </Link>

      </div>

    </div>
  );
}