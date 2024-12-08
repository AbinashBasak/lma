import { useContext, createContext } from 'react';

interface IAppContext {
  authState: string;
  awsConfig: {
    aws_project_region: string;
    aws_cognito_identity_pool_id: string;
    aws_cognito_region: string;
    aws_user_pools_id: string;
    aws_user_pools_web_client_id: string;
    oauth: {
      //
    };
    aws_cognito_login_mechanisms: string[];
    aws_cognito_signup_attributes: string[];
    aws_cognito_mfa_configuration: string;
    aws_cognito_mfa_types: string[];
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: number;
      passwordPolicyCharacters: string[];
    };
    aws_cognito_verification_mechanisms: string[];
    aws_appsync_graphqlEndpoint: string;
    aws_appsync_region: string;
    aws_appsync_authenticationType: string;
  };
  currentCredentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
    identityId: string;
    authenticated: boolean;
    $source: {
      CREDENTIALS_CODE: string;
    };
  };
  currentSession: {
    idToken: {
      jwtToken: string;
      payload: {
        sub: string;
        'cognito:groups': string[];
        email_verified: boolean;
        iss: string;
        'cognito:username': string;
        origin_jti: string;
        aud: string;
        event_id: string;
        token_use: string;
        auth_time: number;
        exp: number;
        iat: number;
        jti: string;
        email: string;
      };
    };
    refreshToken: {
      token: string;
    };
    accessToken: {
      jwtToken: string;
      payload: {
        sub: string;
        'cognito:groups': string;
        iss: string;
        client_id: string;
        origin_jti: string;
        event_id: string;
        token_use: string;
        scope: string;
        auth_time: number;
        exp: number;
        iat: number;
        jti: string;
        username: string;
      };
    };
    clockDrift: number;
  };
  user: {
    username: string;
    pool: {
      userPoolId: string;
      clientId: string;
      client: {
        endpoint: string;
        fetchOptions: {
          //
        };
      };
      advancedSecurityDataCollectionFlag: boolean;
      storage: {
        [key: string]: string;
      };
    };
    Session: null;
    client: {
      endpoint: string;
      fetchOptions: {
        //
      };
    };
    signInUserSession: {
      idToken: {
        jwtToken: string;
        payload: {
          sub: string;
          'cognito:groups': string[];
          email_verified: boolean;
          iss: string;
          'cognito:username': string;
          origin_jti: string;
          aud: string;
          event_id: string;
          token_use: string;
          auth_time: number;
          exp: number;
          iat: number;
          jti: string;
          email: string;
        };
      };
      refreshToken: {
        token: string;
      };
      accessToken: {
        jwtToken: string;
        payload: {
          sub: string;
          'cognito:groups': string[];
          iss: string;
          client_id: string;
          origin_jti: string;
          event_id: string;
          token_use: string;
          scope: string;
          auth_time: number;
          exp: number;
          iat: number;
          jti: string;
          username: string;
        };
      };
      clockDrift: number;
    };
    authenticationFlowType: string;
    storage: {
      [key: string]: string;
    };
    keyPrefix: string;
    userDataKey: string;
    attributes: {
      email: string;
      email_verified: boolean;
      sub: string;
    };
    preferredMFA: string;
  };
  navigationOpen: boolean;
}

export const AppContext = createContext<IAppContext | null>(null);

const useAppContext = (): IAppContext => useContext(AppContext) as IAppContext;

export default useAppContext;
