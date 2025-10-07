import autoBind from 'auto-bind';
import AddReplyUseCase from '../../../../Applications/use_case/AddReplyUseCase.js';
import DeleteReplyUseCase from '../../../../Applications/use_case/DeleteReplyUseCase.js';
import GetCommentRepliesUseCase from '../../../../Applications/use_case/GetCommentRepliesUseCase.js';

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postReplyHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      content,
      owner,
      commentId,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name,
    );
    await deleteReplyUseCase.execute({ threadId, commentId, replyId, owner });

    return {
      status: 'success',
    };
  }

  async getRepliesByCommentHandler(request) {
    const { threadId, commentId } = request.params;
    const getCommentRepliesUseCase = this._container.getInstance(
      GetCommentRepliesUseCase.name,
    );

    const replies = await getCommentRepliesUseCase.execute({
      threadId,
      commentId,
    });

    return {
      status: 'success',
      data: {
        replies,
      },
    };
  }
}

export default RepliesHandler;
