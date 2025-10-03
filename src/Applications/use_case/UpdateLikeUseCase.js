import NewLike from '../../Domains/likes/entities/NewLike.js';

class UpdateLikeUseCase {
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

  async execute(payload) {
    const newLike = new NewLike(payload);

    if (newLike.likeableType === 'thread') {
      await this._threadRepository.verifyAvailableThread(newLike.likeableId);
    } else if (newLike.likeableType === 'comment') {
      await this._commentRepository.verifyAvailableComment(newLike.likeableId);
    } else if (newLike.likeableType === 'reply') {
      await this._replyRepository.verifyAvailableReply(newLike.likeableId);
    }

    const like = await this._likeRepository.checkLikeAvailability({
      userId: newLike.userId,
      likeableId: newLike.likeableId,
      likeableType: newLike.likeableType,
    });

    if (!like) {
      await this._likeRepository.addLike(newLike);
    } else {
      await this._likeRepository.deleteLike(newLike);
    }

    const finalLike = await this._likeRepository.checkLikeAvailability({
      userId: newLike.userId,
      likeableId: newLike.likeableId,
      likeableType: newLike.likeableType,
    });

    const totalLikes = await this._likeRepository.countLikes({
      likeableId: newLike.likeableId,
      likeableType: newLike.likeableType,
    });

    return {
      isLiked: !!finalLike,
      likeCount: totalLikes,
    };
  }
}

export default UpdateLikeUseCase;
