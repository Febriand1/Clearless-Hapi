import VerifyEmailPayload from '../../Domains/users/entities/VerifyEmailPayload.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';

class VerifyUserEmailUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { email, code } = new VerifyEmailPayload(useCasePayload);
    const user = await this._userRepository.getUserByEmail(email);

    if (user.is_email_verified) {
      throw new InvariantError('Email sudah terverifikasi.');
    }

    if (!user.email_verification_code || !user.email_verification_expires_at) {
      throw new InvariantError('Kode verifikasi tidak ditemukan.');
    }

    const currentTime = new Date();
    const expiresAt = new Date(user.email_verification_expires_at);
    if (expiresAt.getTime() < currentTime.getTime()) {
      throw new InvariantError('Kode verifikasi sudah kedaluwarsa.');
    }

    try {
      await this._passwordHash.comparePassword(
        code,
        user.email_verification_code,
      );
    } catch (error) {
      throw new InvariantError('Kode verifikasi tidak valid.');
    }

    const verifiedUser = await this._userRepository.verifyUserEmail(user.id);
    return verifiedUser;
  }
}

export default VerifyUserEmailUseCase;
