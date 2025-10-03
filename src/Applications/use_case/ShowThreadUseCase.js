import ThreadId from '../../Domains/threads/entities/ThreadId.js';
import CommentId from '../../Domains/comments/entities/CommentId.js';
import ReplyId from '../../Domains/replies/entities/ReplyId.js';

class ShowThreadUseCase {
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

  async execute(threadId, userId = null) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const threadData = await this._threadRepository.getThreadById(threadId);
    const commentsData = await this._commentRepository.getCommentByThreadId(
      threadId,
    );

    if (!threadData) {
      throw new Error('THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const threadLikeCount = await this._likeRepository.countLikes({
      likeableId: threadData.id,
      likeableType: 'thread',
    });
    let threadIsLiked = false;
    if (userId) {
      const threadLikeRow = await this._likeRepository.checkLikeAvailability({
        userId,
        likeableId: threadData.id,
        likeableType: 'thread',
      });
      threadIsLiked = !!threadLikeRow;
    }

    const thread = new ThreadId({
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.date,
      username: threadData.username,
      likeCount: threadLikeCount,
      isLiked: threadIsLiked,
      comments: [],
    });

    for (const commentData of commentsData) {
      const likeCount = await this._likeRepository.countLikes({
        likeableId: commentData.id,
        likeableType: 'comment',
      });
      let isLiked = false;
      if (userId) {
        const likeRow = await this._likeRepository.checkLikeAvailability({
          userId,
          likeableId: commentData.id,
          likeableType: 'comment',
        });
        isLiked = !!likeRow;
      }
      const comment = new CommentId({
        id: commentData.id,
        username: commentData.username,
        date: commentData.date,
        replies: [],
        content: commentData.content,
        likeCount,
        isDelete: commentData.is_delete,
        isLiked,
      });

      const repliesData = await this._replyRepository.getReplyByCommentId(
        comment.id,
      );
      for (const replyData of repliesData) {
        const replyLikeCount = await this._likeRepository.countLikes({
          likeableId: replyData.id,
          likeableType: 'reply',
        });
        let replyIsLiked = false;
        if (userId) {
          const replyLikeRow = await this._likeRepository.checkLikeAvailability(
            {
              userId,
              likeableId: replyData.id,
              likeableType: 'reply',
            },
          );
          replyIsLiked = !!replyLikeRow;
        }

        const reply = new ReplyId({
          id: replyData.id,
          username: replyData.username,
          date: replyData.date,
          content: replyData.content,
          isDelete: replyData.is_delete,
          likeCount: replyLikeCount,
          isLiked: replyIsLiked,
        });
        comment.addReply(reply);
      }

      thread.addComment(comment);
    }

    return thread;
  }
}

export default ShowThreadUseCase;
