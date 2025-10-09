import RegisterUser from '../../Domains/users/entities/RegisterUser.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';

class AddUserUseCase {
  constructor({
    userRepository,
    passwordHash,
    emailService,
    verificationConfig,
  }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._emailService = emailService;
    this._verificationTtlMinutes =
      (verificationConfig && verificationConfig.verificationTtlMinutes) || 10;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    await this._userRepository.verifyAvailableEmail(registerUser.email);

    registerUser.password = await this._passwordHash.hash(
      registerUser.password,
    );

    const verificationCode = this._generateVerificationCode();
    const hashedVerificationCode = await this._passwordHash.hash(
      verificationCode,
    );
    const verificationExpiresAt = new Date(
      Date.now() + this._verificationTtlMinutes * 60 * 1000,
    );

    const addedUser = await this._userRepository.addUser(registerUser, {
      codeHash: hashedVerificationCode,
      expiresAt: verificationExpiresAt,
    });

    try {
      await this._emailService.sendVerificationEmail({
        to: registerUser.email,
        code: verificationCode,
        name: registerUser.fullname,
      });
    } catch (error) {
      await this._userRepository.deleteUserById(addedUser.id);
      throw new InvariantError(
        'Gagal mengirim email verifikasi. Silakan coba lagi nanti.',
      );
    }

    return addedUser;
  }

  _generateVerificationCode() {
    const random = Math.floor(Math.random() * 10000);
    return random.toString().padStart(4, '0');
  }
}

export default AddUserUseCase;
