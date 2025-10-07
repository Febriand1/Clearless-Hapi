import DeleteThread from '../../Domains/threads/entities/DeleteThread.js';

class DeleteThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const deleteThread = new DeleteThread(useCasePayload);

    await this._threadRepository.verifyAvailableThread(deleteThread.threadId);
    const owner = await this._threadRepository.getThreadOwnerById(
      deleteThread.threadId,
    );

    if (owner !== deleteThread.owner) {
      throw new Error('VALIDATION_THREAD.NOT_THE_OWNER');
    }

    const comments = await this._commentRepository.getCommentByThreadId(
      deleteThread.threadId,
    );
    const commentIds = comments.map((comment) => comment.id);

    const replyIds = [];
    if (commentIds.length) {
      const repliesList = await Promise.all(
        commentIds.map((commentId) =>
          this._replyRepository.getReplyByCommentId(commentId),
        ),
      );

      repliesList.forEach((replies) => {
        replies.forEach((reply) => replyIds.push(reply.id));
      });
    }

    if (replyIds.length) {
      await this._likeRepository.deleteLikesByLikeableIds({
        likeableType: 'reply',
        likeableIds: replyIds,
      });
    }

    if (commentIds.length) {
      await this._likeRepository.deleteLikesByLikeableIds({
        likeableType: 'comment',
        likeableIds: commentIds,
      });
    }

    await this._likeRepository.deleteLikesByLikeableIds({
      likeableType: 'thread',
      likeableIds: [deleteThread.threadId],
    });

    await this._threadRepository.deleteThread(deleteThread.threadId);

    return true;
  }
}

export default DeleteThreadUseCase;
