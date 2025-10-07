import DeleteReply from '../../Domains/replies/entities/DeleteReply.js';

class DeleteReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload;
    const deleteReply = new DeleteReply({
      threadId,
      commentId,
      replyId,
      owner,
    });

    await this._verifyPayload(deleteReply);
    return this._replyRepository.deleteReply(deleteReply.replyId);
  }

  async _verifyPayload(payload) {
    const { threadId, commentId, replyId, owner } = payload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.getCommentOwnerById(commentId);
    const replyOwner = await this._replyRepository.getReplyOwnerById(replyId);

    if (replyOwner !== owner) {
      throw new Error('VALIDATION_REPLY.NOT_THE_OWNER');
    }
  }
}

export default DeleteReplyUseCase;
