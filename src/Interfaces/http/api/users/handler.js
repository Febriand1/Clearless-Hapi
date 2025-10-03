import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase.js';
import GetUserUseCase from '../../../../Applications/use_case/GetUserUseCase.js';
import UpdateUserUseCase from '../../../../Applications/use_case/UpdateUserUseCase.js';
import {
  saveUploadedAvatar,
  deleteUploadedFile,
} from '../../../../Utils/file.js';
import autoBind from 'auto-bind';

class UsersHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    // Jika avatar sudah berupa URL (Vercel Blob), biarkan saja

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }

  async getOwnUserHandler(request) {
    const { id: userId } = request.auth.credentials;
    const getUserUseCase = this._container.getInstance(GetUserUseCase.name);

    const user = await getUserUseCase.execute(userId);

    // Jika avatar sudah berupa URL (Vercel Blob), biarkan saja

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async patchOwnUserHandler(request) {
    const { id: userId } = request.auth.credentials;
    const updateUserUseCase = this._container.getInstance(
      UpdateUserUseCase.name,
    );

    const getUserUseCase = this._container.getInstance(GetUserUseCase.name);
    const existingUser = await getUserUseCase.execute(userId);
    let oldAvatar =
      existingUser && existingUser.avatar ? existingUser.avatar : null;

    let payload = request.payload || {};

    if (payload && payload.avatar && payload.avatar._readableState) {
      const avatar = payload.avatar;
      const contentType =
        (avatar.hapi &&
          avatar.hapi.headers &&
          avatar.hapi.headers['content-type']) ||
        '';
      const avatarUrl = await saveUploadedAvatar(avatar, contentType);

      payload = Object.assign({}, payload);
      payload.avatar = avatarUrl;
    }

    if (
      Object.prototype.hasOwnProperty.call(payload, 'avatar') &&
      payload.avatar === ''
    ) {
      payload.avatar = null;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'removeAvatar')) {
      const val = payload.removeAvatar;
      const wantRemove =
        val === true || val === 'true' || val === '1' || val === 1;
      if (wantRemove) {
        payload.avatar = null;
      }

      delete payload.removeAvatar;
    }

    if (!payload || Object.keys(payload).length === 0) {
      return {
        status: 'success',
        data: {
          user: existingUser,
        },
      };
    }

    let updatedUser;
    try {
      updatedUser = await updateUserUseCase.execute(userId, payload);
    } catch (e) {
      if (payload && payload.avatar && typeof payload.avatar === 'string') {
        try {
          deleteUploadedFile(payload.avatar);
        } catch (_) {}
      }
      throw e;
    }

    if (oldAvatar && updatedUser.avatar !== oldAvatar) {
      try {
        deleteUploadedFile(oldAvatar);
      } catch (_) {}
    }

    // Jika avatar sudah berupa URL (Vercel Blob), biarkan saja

    return {
      status: 'success',
      data: {
        user: updatedUser,
      },
    };
  }

  async deleteOwnAvatarHandler(request) {
    const { id: userId } = request.auth.credentials;
    const updateUserUseCase = this._container.getInstance(
      UpdateUserUseCase.name,
    );

    const getUserUseCase = this._container.getInstance(GetUserUseCase.name);
    const existingUser = await getUserUseCase.execute(userId);
    const oldAvatar =
      existingUser && existingUser.avatar ? existingUser.avatar : null;

    const updatedUser = await updateUserUseCase.execute(userId, {
      avatar: null,
    });

    if (oldAvatar && updatedUser.avatar !== oldAvatar) {
      try {
        deleteUploadedFile(oldAvatar);
      } catch (e) {}
    }

    // Jika avatar sudah berupa URL (Vercel Blob), biarkan saja

    return {
      status: 'success',
      data: {
        user: updatedUser,
      },
    };
  }
}

export default UsersHandler;
