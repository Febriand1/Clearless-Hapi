import autoBind from 'auto-bind';
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetAllThreadsUseCase from '../../../../Applications/use_case/GetAllThreadsUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';
import DeleteThreadUseCase from '../../../../Applications/use_case/DeleteThreadUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request) {
    const { threadId } = request.params;
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name,
    );

    const userId =
      request.auth && request.auth.credentials
        ? request.auth.credentials.id
        : null;

    const thread = await getThreadDetailUseCase.execute({ threadId, userId });

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async getAllThreadsHandler(request) {
    const getAllThreadsUseCase = this._container.getInstance(
      GetAllThreadsUseCase.name,
    );

    const userId =
      request.auth && request.auth.credentials
        ? request.auth.credentials.id
        : null;

    const page =
      Number(request.query.page) > 0 ? Number(request.query.page) : 1;
    const limit =
      Number(request.query.limit) > 0 ? Number(request.query.limit) : 10;

    const { threads, meta } = await getAllThreadsUseCase.execute(userId, {
      page,
      limit,
    });

    return {
      status: 'success',
      data: {
        threads,
        meta,
      },
    };
  }

  async deleteThreadHandler(request) {
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const deleteThreadUseCase = this._container.getInstance(
      DeleteThreadUseCase.name,
    );

    await deleteThreadUseCase.execute({ threadId, owner });

    return {
      status: 'success',
    };
  }
}

export default ThreadsHandler;
