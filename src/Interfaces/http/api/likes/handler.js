import autoBind from 'auto-bind';
import GetLikeStatusUseCase from '../../../../Applications/use_case/GetLikeStatusUseCase.js';
import UpdateLikeUseCase from '../../../../Applications/use_case/UpdateLikeUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async updateLikeHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: userId } = request.auth.credentials;

    let likeableId;
    let likeableType;

    if (replyId) {
      likeableId = replyId;
      likeableType = 'reply';
    } else if (commentId) {
      likeableId = commentId;
      likeableType = 'comment';
    } else {
      likeableId = threadId;
      likeableType = 'thread';
    }

    const updateLikeUseCase = this._container.getInstance(
      UpdateLikeUseCase.name,
    );

    const result = await updateLikeUseCase.execute({
      userId,
      likeableId,
      likeableType,
    });

    return h
      .response({
        status: 'success',
        data: {
          isLiked: result.isLiked,
          likeCount: result.likeCount,
        },
      })
      .code(200);
  }

  async getLikeStatusHandler(request) {
    const { threadId, commentId, replyId } = request.params;
    const userId =
      request.auth && request.auth.credentials
        ? request.auth.credentials.id
        : null;

    const getLikeStatusUseCase = this._container.getInstance(
      GetLikeStatusUseCase.name,
    );

    const { likeCount, isLiked, likeableId, likeableType } =
      await getLikeStatusUseCase.execute({
        threadId,
        commentId: commentId || null,
        replyId: replyId || null,
        userId,
      });

    return {
      status: 'success',
      data: {
        likeCount,
        isLiked,
        likeableId,
        likeableType,
      },
    };
  }
}

export default LikesHandler;
