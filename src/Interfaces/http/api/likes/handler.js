import UpdateLikeUseCase from '../../../../Applications/use_case/UpdateLikeUseCase.js';
import autoBind from 'auto-bind';

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
}

export default LikesHandler;
