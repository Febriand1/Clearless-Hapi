import CommentDetail from '../../Domains/comments/entities/CommentDetail.js';

class GetThreadCommentsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);

    const comments = await this._commentRepository.getCommentByThreadId(
      threadId,
    );

    return comments.map(
      (comment) =>
        new CommentDetail({
          id: comment.id,
          username: comment.username,
          avatar: comment.avatar,
          date: comment.date,
          content: comment.content,
          isDelete: comment.is_delete,
        }),
    );
  }
}

export default GetThreadCommentsUseCase;
