import { Auth0Provider } from "@auth0/auth0-react";
import config from "../config";

const Auth0ProviderWithHistory = ({ children }) => {
  return (
    <Auth0Provider
      domain={config.auth0.domain}
      clientId={config.auth0.clientId}
      authorizationParams={{
        redirect_uri: config.auth0.redirectUri,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
