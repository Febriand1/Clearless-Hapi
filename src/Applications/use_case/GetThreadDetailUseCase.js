import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    likeRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const { threadId, userId = null } =
      typeof payload === 'string'
        ? { threadId: payload, userId: null }
        : payload;

    if (!threadId) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    await this._threadRepository.verifyAvailableThread(threadId);

    const threadData = await this._threadRepository.getThreadById(threadId);

    const [likeCount, comments] = await Promise.all([
      this._likeRepository.countLikes({
        likeableId: threadId,
        likeableType: 'thread',
      }),
      this._commentRepository.getCommentByThreadId(threadId),
    ]);

    let commentCount = comments.length;

    if (comments.length) {
      const repliesList = await Promise.all(
        comments.map((comment) =>
          this._replyRepository.getReplyByCommentId(comment.id),
        ),
      );

      repliesList.forEach((replies) => {
        commentCount += replies.length;
      });
    }

    let isLiked = false;
    if (userId) {
      isLiked = await this._likeRepository.checkLikeAvailability({
        userId,
        likeableId: threadId,
        likeableType: 'thread',
      });
    }

    return new ThreadDetail({
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.date,
      username: threadData.username,
      avatar: threadData.avatar,
      likeCount,
      commentCount,
      isLiked,
    });
  }
}

export default GetThreadDetailUseCase;
