class UpdateUserUseCase {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async execute(userId, payload) {
    return this._userRepository.updateUser(userId, payload);
  }
}

export default UpdateUserUseCase;
