import AddThread from '../../Domains/threads/entities/AddThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { title, body, owner } = useCasePayload;

    const addThread = new AddThread({ title, body, owner });
    return this._threadRepository.addThread(addThread);
  }
}

export default AddThreadUseCase;
