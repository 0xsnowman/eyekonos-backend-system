import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../../models/user.model";

export const OAuthAccessTokenModel = mongoose.model(
  "OAuthAccessToken",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      clientId: { type: mongoose.Schema.Types.ObjectId, ref: "OAuthClient" },
      accessToken: { type: String },
      expires: { type: Date },
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
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      clientId: { type: mongoose.Schema.Types.ObjectId, ref: "OAuthClient" },
      refreshToken: { type: String },
      expires: { type: Date },
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
    .populate("userId")
    .populate("clientId")
    .then((accessTokenDB) => {
      if (!accessTokenDB) return cb(false, false);
      return cb(false, accessTokenDB.toObject());
    })
    .catch((err) => {
      cb(false, false);
    });
};

const getRefreshToken = (refreshToken: string, cb: Function) => {
  OAuthRefreshTokenModel.findOne({ refreshToken: refreshToken })
    .populate("userId")
    .populate("clientId")
    .then((refreshTokenDB) => {
      if (!refreshTokenDB) return cb(false, false);
      return cb(false, refreshTokenDB.toObject());
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
      userId: userId,
      clientId: oauthClient,
      accessToken: accessToken,
      expires: expires,
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
      userId: userId,
      clientId: oauthClient,
      refreshToken: refreshToken,
      expires: expires,
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
