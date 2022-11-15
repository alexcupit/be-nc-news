const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('/api/topics', () => {
  test('GET 200 - should respond with an array of topic objects, each with properties of "slug" and "description" ', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual(expect.any(Array));
        expect(body.topics.length).toBeGreaterThan(0);
        body.topics.forEach((park) => {
          expect(park).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('/api/articles', () => {
  test('GET 200 - should respond with an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, comment_count', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual(expect.any(Array));
        expect(body.articles.length).toBeGreaterThan(0);
        body.articles.forEach((article) => {
          expect(Object.keys(article)).toEqual(
            expect.arrayContaining([
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count',
            ])
          );
        });
      });
  });
  test('GET 200 - the comment count should equal the number of comments with the corresponding article_id', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const article_id_1 = body.articles.filter(
          (article) => article.article_id === 1
        );
        expect(article_id_1[0].comment_count).toBe('11');

        const article_id_7 = body.articles.filter(
          (article) => article.article_id === 7
        );
        expect(article_id_7[0].comment_count).toBe('0');
      });
  });
  test('GET 200 - the objects in the response body should be sorted by date in descending order ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(0);
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
      });
  });
});

describe('/api/articles/:article_id', () => {
  test('GET 200 - should respond with an article object of the same id, with properties of author, title, article_id, body, topic, created_at and votes ', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          author: expect.any(String),
          body: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test('GET 404 - should respond with "msg: id not found" if the input id does not reference a defined row in the database', () => {
    return request(app)
      .get('/api/articles/99999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('id not found');
      });
  });
  test('GET 400 - should respond with "msg: input uses invalid data type" if the input id does not meet schema validation (needs to be a number)', () => {
    return request(app)
      .get('/api/articles/hello')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('input uses invalid data type');
      });
  });
});

describe('/api/articles/:article_id/comments', () => {
  test('GET 200 - should respond with an array of comments for the given article_id, where each comment has the following properties: comment_id, body, author, votes and created_at', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) =>
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test('GET 200 - comments should be ordered by the most recent comment first', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy('created_at', { descending: true });
      });
  });
  test('GET 200 - should respond with an empty array if article_id exists but there are no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test('GET 404 - should respond with "msg: id not found" if the input id does not reference a defined row in the database', () => {
    return request(app)
      .get('/api/articles/9999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('id not found');
      });
  });
  test('GET 400 - should respond with "msg: input uses invalid data type if the input id does not meet schema validation (needs to be a number', () => {
    return request(app)
      .get('/api/articles/hello/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('input uses invalid data type');
      });
  });
  test('POST 201 - should take a comment body and username and respond with the new comment object', () => {
    const newComment = { username: 'butter_bridge', body: 'test comment' };
    return request(app)
      .post('/api/articles/2/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: newComment.body,
          author: newComment.username,
          comment_id: expect.any(Number),
          article_id: 2,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test('POST 400 - posted body missing required information', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ body: 'test with no username on body' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('posted body missing required fields');
      });
  });
  test('POST 400 - article id does not exist, violates foreign key', () => {
    return request(app)
      .post('/api/articles/99999/comments')
      .send({ username: 'butter_bridge', body: 'test comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('foreign key violation');
      });
  });
  test('POST 400 - username does not exist, violates foreign key', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'fakeusername', body: 'test body' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('foreign key violation');
      });
  });
});

describe('Error handling', () => {
  test('GET 404 - should respond with "msg: route not found" when a bad path is used eg /api/topcs', () => {
    return request(app)
      .get('/api/topcs')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('route not found');
      });
  });
});
