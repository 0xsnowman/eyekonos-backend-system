import oauthserver from "oauth2-server";
import OAuthModel from "./model";

export const oauth = oauthserver({
  model: OAuthModel,
  grants: ["password", "refresh_token"],
  accessTokenLifetime: 1209600,
  refreshTokenLifetime: 2419200,
});
