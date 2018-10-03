
interface CommentEvent {
   user: string;
   timestamp: string;
   comment: string;
   likes: LikesContainer;
   replies: RepliesContainer;
}

interface LikesContainer {
   total: number;
   usersChrono: Array<CommentEvent>;
}

interface RepliesContainer {
   total: number;
   usersChrono: Array<CommentEvent>;
}

interface CommentsRootContainer {
   parentVerseId: string;
   user: string;
   timestamp: string;
   comment: string;
   likes: LikesContainer;
   replies: RepliesContainer;
}
