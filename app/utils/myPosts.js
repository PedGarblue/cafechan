const POSTS_STORAGE_KEY = 'MY_POSTS';

export const getPosts = () => JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY)) || [];

export const savePost = post => {
  const posts = getPosts();
  const pickedPost = {
    _id: post._id,
    kind: post.kind,
    board: post.board._id,
    seq_id: post.seq_id,
    created_at: post.created_at,
  };
  posts.push(pickedPost);
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};
