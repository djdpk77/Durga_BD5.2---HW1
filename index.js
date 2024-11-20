const express = require('express');
const { resolve } = require('path');

const app = express();
let { sequelize } = require('./lib/index');
let { post } = require('./models/post.model');

let posts = [
  {
    id: 1,
    name: 'Post1',
    author: 'Author1',
    content: 'This is the content of post 1',
    title: 'Title1',
  },
  {
    id: 2,
    name: 'Post2',
    author: 'Author2',
    content: 'This is the content of post 2',
    title: 'Title2',
  },
  {
    id: 3,
    name: 'Post3',
    author: 'Author1',
    content: 'This is the content of post 3',
    title: 'Title3',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await post.bulkCreate(posts);

    return res.status(200).json({ message: 'Database seeding successfull' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Database seeding failed', error: error.message });
  }
});

//Function to fetch all posts
async function fetchAllPosts() {
  let response = await post.findAll();

  return { posts: response };
}

//Endpoint 1: Fetch all posts
app.get('/posts', async (req, res) => {
  try {
    let result = await fetchAllPosts();

    if (result.posts.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch post details based on the ID
async function fetchPostById(id) {
  let response = await post.findOne({ where: id });

  return { post: response };
}

//Endpoint 2: Fetch post details by ID
app.get('/posts/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let result = await fetchPostById(id);

    if (result.post.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the posts by an author
async function fetchPostsByAuthor(author) {
  let response = await post.findAll({ where: { author } });

  return { posts: response };
}

//Endpoint 3: Fetch all posts by an author
app.get('/posts/author/:author', async (req, res) => {
  let author = req.params.author;
  try {
    let result = await fetchPostsByAuthor(author);

    if (result.posts.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the posts sorted by their name
async function sortPostsByName(order) {
  let response = await post.findAll({ order: [['name', order]] });

  return { posts: response };
}

//Endpoint 4: Sort all the posts by their name
app.get('/posts/sort/name', async (req, res) => {
  let order = req.query.order;
  try {
    let result = await sortPostsByName(order);

    if (result.posts.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
