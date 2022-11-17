exports.endpoints = {
  'GET /api': {
    description:
      'serves up a json representation of all the available endpoints of the api',
  },
  'GET /api/topics': {
    description: 'serves an array of all topics',
    queries: [],
    exampleResponse: {
      topics: [{ slug: 'football', description: 'Footie!' }],
    },
  },
  'GET /api/articles': {
    description:
      'serves an array of all articles, default order is descending by date',
    queries: ['topic', 'sort_by', 'order'],
    exampleResponse: {
      articles: [
        {
          article_id: 3,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          created_at: '2020-11-03 09:12:00',
          votes: 0,
          comment_count: 2,
        },
        {},
        {},
      ],
    },
  },
  'GET /api/articles/:article_id': {
    description: 'returns all data regarding a specific article id',
    queries: [],
    exampleResponse: {
      article: {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: '2020-11-03 09:12:00',
        votes: 0,
        comment_count: 2,
      },
    },
  },
  'PATCH /api/articles/:article_id': {
    description:
      'accepts a body of "{inc_votes: Number}" which updates the vote count of the specific article',
    queries: [],
    exampleRequest: { inc_votes: 50 },
    exampleResponse: {
      article: {
        article_id: 3,
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: '2020-11-03 09:12:00',
        votes: 50,
        comment_count: 2,
      },
    },
  },
  'GET /api/articles/:article_id/comments': {
    description:
      'serves an array of all comments relating to the given article id, ordered by the most recent first',
    queries: [],
    exampleResponse: {
      comments: [
        {
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          author: 'butter_bridge',
          votes: 16,
          created_at: '2020-04-06 13:17:00',
        },
        {},
        {},
      ],
    },
  },
  'POST /api/articles/:article_id/comments': {
    description: 'accepts a new comment on the given article',
    queries: [],
    exampleRequest: {
      username: 'butter_bridge',
      body: 'here is a new comment',
    },
    exampleResponse: {
      author: 'butter_bridge',
      body: 'here is a new comment',
      comment_id: 2,
      article_id: 1,
      votes: 0,
      created_at: '2020-04-06 13:17:00',
    },
  },
  'GET /api/users': {
    description: 'serves an array of user objects',
    queries: [],
    exampleResponse: {
      users: [
        {
          username: 'exampleUser',
          name: 'Example User',
          avatar_url: 'https://www.google.co.uk',
        },
      ],
    },
  },
  'DELETE /api/comments/:comment_id': {
    desciption: 'deletes the comment with the specified id',
    queries: [],
    exampleResponse: {},
  },
};
