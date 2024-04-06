import { useAuth0 } from "@auth0/auth0-react";

export default function HomePage() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {" "}
      {/* If not already authenticated, generate a login button. Otherwise, logout. */}
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <button onClick={() => logout()}>Log Out</button>
      )}
    </div>
  );
}
