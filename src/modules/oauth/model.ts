import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../../models/user.model";

export const OAuthAccessTokenModel = mongoose.model(
  "OAuthAccessToken",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      client: { type: mongoose.Schema.Types.ObjectId, ref: "OAuthClient" },
      accessToken: { type: String },
      accessTokenExpiresAt: { type: Date },
    },
    {
      timestamps: true,
    }
  ),
  "oauth_access_tokens"
);

export const OAuthRefreshTokenModel = mongoose.model(
  "OAuthRefreshToken",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      client: { type: mongoose.Schema.Types.ObjectId, ref: "OAuthClient" },
      refreshToken: { type: String },
      refreshTokenExpiresAt: { type: Date },
    },
    {
      timestamps: true,
    }
  ),
  "oauth_refresh_tokens"
);

export const OAuthClientModel = mongoose.model(
  "OAuthClient",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      clientId: { type: String },
      clientSecret: { type: String },
      redirectUris: { type: Array },
      grants: { type: Array },
    },
    {
      timestamps: true,
    }
  ),
  "oauth_clients"
);

const getAccessToken = (accessToken: string, cb: Function) => {
  OAuthAccessTokenModel.findOne({
    accessToken: accessToken,
  })
    .populate("user")
    .populate("client")
    .then((accessTokenDB) => {
      return cb(false, accessTokenDB);
    })
    .catch((err) => {
      cb(false, false);
    });
};

const getRefreshToken = (refreshToken: string, cb: Function) => {
  OAuthRefreshTokenModel.findOne({ refreshToken: refreshToken })
    .populate("user")
    .populate("client")
    .then((refreshTokenDB) => {
      return cb(false, refreshTokenDB);
    })
    .catch((err) => {
      cb(false, false);
    });
};

const getClient = (clientId: string, clientSecret: string, cb: Function) => {
  OAuthClientModel.findOne({ clientId, clientSecret })
    .then((client) => {
      return cb(false, client);
    })
    .catch((err) => {
      cb(false, false);
    });
};

const grantTypeAllowed = (
  clientId: string,
  grantType: string,
  cb: Function
) => {
  cb(false, true);
};

const getUser = (username: string, password: string, cb: Function) => {
  User.findOne({ email: username })
    .then((user) => {
      if (
        user &&
        user.isVerified &&
        bcrypt.compareSync(password, user.password)
      ) {
        return cb(false, user);
      }
    })
    .catch((err) => {
      cb(false, false);
    });
};

const saveAccessToken = async (
  accessToken: string,
  clientId: string,
  expires: any,
  userId: any,
  cb: Function
) => {
  const oauthClient = await OAuthClientModel.findOne({ clientId });

  let _accessToken: any = (
    await OAuthAccessTokenModel.create({
      user: userId,
      client: oauthClient,
      accessToken: accessToken,
      accessTokenExpiresAt: expires,
    })
  ).toObject();

  if (!_accessToken.user) {
    _accessToken.user = {};
  }

  cb(false);
};

const saveRefreshToken = async (
  refreshToken: string,
  clientId: string,
  expires: any,
  userId: any,
  cb: Function
) => {
  const oauthClient = await OAuthClientModel.findOne({ clientId });

  let _refreshToken: any = (
    await OAuthRefreshTokenModel.create({
      user: userId,
      client: oauthClient,
      accessToken: refreshToken,
      accessTokenExpiresAt: expires,
    })
  ).toObject();

  if (!_refreshToken.user) {
    _refreshToken.user = {};
  }

  cb(false);
};

export default {
  getAccessToken,
  getRefreshToken,
  getClient,
  getUser,
  grantTypeAllowed,
  saveAccessToken,
  saveRefreshToken,
};
