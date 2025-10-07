import autoBind from 'auto-bind';
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';
import GetThreadCommentsUseCase from '../../../../Applications/use_case/GetThreadCommentsUseCase.js';

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name,
    );
    const addedComment = await addCommentUseCase.execute({
      content,
      owner,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
    };
  }

  async getCommentsByThreadHandler(request) {
    const { threadId } = request.params;
    const getThreadCommentsUseCase = this._container.getInstance(
      GetThreadCommentsUseCase.name,
    );

    const comments = await getThreadCommentsUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        comments,
      },
    };
  }
}

export default CommentsHandler;
