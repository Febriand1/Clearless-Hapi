class GetLikeStatusUseCase {
  constructor({
    likeRepository,
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute({ threadId, commentId = null, replyId = null, userId = null }) {
    let likeableType = 'thread';
    let likeableId = threadId;

    await this._threadRepository.verifyAvailableThread(threadId);

    if (replyId) {
      await this._commentRepository.verifyCommentBelongsToThread({
        commentId,
        threadId,
      });
      await this._replyRepository.verifyReplyBelongsToComment({
        replyId,
        commentId,
      });
      likeableId = replyId;
      likeableType = 'reply';
    } else if (commentId) {
      await this._commentRepository.verifyCommentBelongsToThread({
        commentId,
        threadId,
      });
      likeableId = commentId;
      likeableType = 'comment';
    }

    const likeCount = await this._likeRepository.countLikes({
      likeableId,
      likeableType,
    });

    let isLiked = false;
    if (userId) {
      const likeRow = await this._likeRepository.checkLikeAvailability({
        userId,
        likeableId,
        likeableType,
      });
      isLiked = !!likeRow;
    }

    return {
      likeCount,
      isLiked,
      likeableId,
      likeableType,
    };
  }
}

export default GetLikeStatusUseCase;
