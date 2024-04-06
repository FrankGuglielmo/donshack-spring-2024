import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  return (
    <Auth0Provider
      domain="donshack24.us.auth0.com"
      clientId="liC47L5l4ADMUs78jb7pqfZJ4R3KYOJe"
      authorizationParams={{
        redirect_uri: window.location.origin + "/#/profile",
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
