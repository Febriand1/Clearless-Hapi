import AddReply from '../../Domains/replies/entities/AddReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { content, owner, commentId, threadId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.getCommentOwnerById(commentId);
    const addReply = new AddReply({ content, owner, commentId, threadId });
    return this._replyRepository.addReply(addReply);
  }
}

export default AddReplyUseCase;
