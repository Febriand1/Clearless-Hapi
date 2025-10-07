import ReplyDetail from '../../Domains/replies/entities/ReplyDetail.js';

class GetCommentRepliesUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId, commentId }) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyCommentBelongsToThread({
      commentId,
      threadId,
    });

    const replies = await this._replyRepository.getReplyByCommentId(commentId);

    return replies.map(
      (reply) =>
        new ReplyDetail({
          id: reply.id,
          username: reply.username,
          avatar: reply.avatar,
          date: reply.date,
          content: reply.content,
          isDelete: reply.is_delete,
        }),
    );
  }
}

export default GetCommentRepliesUseCase;
