const express = require('express');
const router = express.Router();

const { v4: uuid } = require('uuid');

// Firestore
const Firestore = require('@google-cloud/firestore');
const db = new Firestore();

router.get('/:id/profile', async (req, res) => {
  // Returns the user's avatar, number of followers and following in our social medium and all of his/her post
  // This function is also used for searching
  const userId = req.params.id;
  let followersCount = 0;
  let followingsCount = 0;
  let rank = 0;
  await db
    .collection('users')
    .doc(userId)
    .collection('followers')
    .get()
    .then((snap) => {
      followersCount = snap.size; // will return the collection size
    });
  await db
    .collection('users')
    .doc(userId)
    .collection('followings')
    .get()
    .then((snap) => {
      followingsCount = snap.size;
    });
  await db
    .collection('users')
    .doc(userId)
    .collection('rank')
    .get()
    .then((snap) => {
      rank = snap.size;
    });

  return res.send({
    rank,
    followersCount,
    followingsCount,
  });
});

router.get('/:id/followers', async (req, res) => {
  // Returns the user's followers
  const userId = req.params.id;
  const followers = [];
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('followers')
    .get();
  if (snapshot.empty) return res.send('No followers, Yet');
  snapshot.forEach((doc) => {
    followers.push(doc.id);
  });

  return res.send(followers);
});

router.get('/:id/followings', async (req, res) => {
  // Returns the user's following
  const userId = req.params.id;
  const followings = [];
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('followings')
    .get();
  if (snapshot.empty) return res.send('No followings, Yet');
  snapshot.forEach((doc) => {
    followings.push(doc.id);
  });

  return res.send(followings);
});

router.get('/:id/posts', async (req, res) => {
  // Returns the user's post
  const userId = req.params.id;
  const posts = [];
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('posts')
    .get();
  if (snapshot.empty) return res.send('No posts, Yet');
  snapshot.forEach((doc) => {
    posts.push(doc.data());
  });

  return res.send(posts);
});

router.get('/:id/feed', async (req, res) => {
  // Returns the user's feed
  const feed = [];
  const snapshot = await db.collection('posts').get();
  if (snapshot.empty) return res.send('No Feed, Yet');
  snapshot.forEach((doc) => {
    feed.push(doc.data());
  });
  return res.send(feed);
});

router.post('/:id/follow', async (req, res) => {
  const userId = req.params.id;
  const followId = req.body.followId;
  await db
    .collection('users')
    .doc(userId)
    .collection('followings')
    .doc(followId)
    .set({});
  await db
    .collection('users')
    .doc(followId)
    .collection('followers')
    .doc(userId)
    .set({});
  return res.send('Followed successfully');
});

router.post('/:id/posts', async (req, res) => {
  // Post to the user's post
  const postDetails = req.body;
  const postId = uuid();
  await db.collection('posts').doc(postId).set(postDetails);
  await db
    .collection('users')
    .doc(req.params.id)
    .collection('posts')
    .doc(postId)
    .set({
      ref: db.doc('posts/' + postId),
    });

  return res.send('Posted Successfully');
});

router.post('/post/:id', async (req, res) => {
  // Post a like to a particular post
  const postId = req.params.id;
  const isIncrement = req.body.isIncrement;
  let likes = 0;
  await db
    .collection('posts')
    .doc(postId)
    .get()
    .then((snap) => {
      likes = snap.data().likes;
    });
  if (isIncrement == 'true') {
    await db
      .collection('posts')
      .doc(postId)
      .update({
        likes: likes + 1,
      });
  } else {
    await db
      .collection('posts')
      .doc(postId)
      .update({
        likes: likes - 1,
      });
  }

  return res.send('Done');
});

module.exports = router;
