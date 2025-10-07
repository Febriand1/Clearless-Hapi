import Threads from '../../Domains/threads/entities/Threads.js';

class GetAllThreadsUseCase {
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

  async execute(userId = null, { page = 1, limit = 10 } = {}) {
    const { rows: threadsData, total } =
      await this._threadRepository.getAllThreadsWithPagination({ page, limit });

    const results = [];
    for (const t of threadsData) {
      const likeCount = await this._likeRepository.countLikes({
        likeableId: t.id,
        likeableType: 'thread',
      });

      let commentCount = 0;
      const comments = await this._commentRepository.getCommentByThreadId(t.id);
      commentCount += comments.length;

      for (const c of comments) {
        const replies = await this._replyRepository.getReplyByCommentId(c.id);
        commentCount += replies.length;
      }

      let isLiked = false;
      if (userId) {
        const likeRow = await this._likeRepository.checkLikeAvailability({
          userId,
          likeableId: t.id,
          likeableType: 'thread',
        });
        isLiked = !!likeRow;
      }

      results.push(
        new Threads({
          id: t.id,
          title: t.title,
          body: t.body,
          date: t.date,
          username: t.username,
          avatar: t.avatar,
          likeCount,
          isLiked,
          commentCount,
        }),
      );
    }

    return {
      threads: results,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
}

export default GetAllThreadsUseCase;
