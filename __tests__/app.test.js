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
  test('GET 200 - when given a topic query, should respond with an array of articles with the apprpriate topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(11);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: 'mitch',
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test('GET 200 - topic query: should be able to accept case insensitive values', () => {
    return request(app)
      .get('/api/articles?topic=MiTcH')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(11);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: 'mitch',
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test('GET 200 - topic query: should respond with an empty array if valid topic but has no results', () => {
    return request(app)
      .get('/api/articles?topic=utterrubbishmaybesql')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test('GET 200 - topic query: should respond with an empty array when query value is of the wrong data type', () => {
    return request(app)
      .get('/api/articles?topic=123456')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test('GET 200 - sort_by query: should sort results by given column name, defaulting to date', () => {
    return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('title', { descending: true });
      });
  });
  test('GET 200 - sort_by query: is case insensitive', () => {
    return request(app)
      .get('/api/articles?sort_by=AuThoR')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('author', { descending: true });
      });
  });
  test('GET 400 - sort_by query: should respond with an error if passed invalid column', () => {
    return request(app)
      .get('/api/articles?sort_by=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid sort_by query');
      });
  });
  test('GET 200 - order: should default to desc and accept asc as a query and be case insensitive', () => {
    return request(app)
      .get('/api/articles?order=aSc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('created_at');
      });
  });
  test('GET 400 - order: should not accept a value other than asc or desc', () => {
    return request(app)
      .get('/api/articles?order=hithere')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('order must be asc or desc');
      });
  });
  test('GET 200 - should accept a combination of topic and sort_by queries', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy('votes', { descending: true });
        expect(body.articles.length).toBe(11);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: 'mitch',
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test('GET 200 - should accept a combination of topic, sort_by and order queries', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(11);
        expect(body.articles).toBeSortedBy('article_id');
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: 'mitch',
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test('GET 400 - should respond with an error if invalid query key is used', () => {
    return request(app)
      .get('/api/articles?banana=true')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('invalid query key');
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
  test('PATCH 200 - responds with the updated article, with amended votes, as an object', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: 101,
          body: expect.any(String),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test('PATCH 200 - responds with a negative number when posted body subtracts votes below 0', () => {
    return request(app)
      .patch('/api/articles/2')
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 2,
          votes: -50,
          body: expect.any(String),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test('PATCH 400 - posted body does not contain required key/misspelt key', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_vote: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('posted body missing required fields');
      });
  });
  test('PATCH 400 - inc_votes in posted body is of the wrong data type', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'banana' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('input uses invalid data type');
      });
  });
  test('PATCH 404 - article_id is valid but does not exist', () => {
    return request(app)
      .patch('/api/articles/9999')
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('id not found');
      });
  });
  test('PATCH 400 - article_id is invalid data type', () => {
    return request(app)
      .patch('/api/articles/banana')
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('input uses invalid data type');
      });
  });
  test('GET 200 - should now respond with an article object of the same id, with properties of author, title, article_id, body, topic, created_at, votes and comment_count', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          comment_count: '11',
        });
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
  test('POST 400 - posted body has error in expected object key of username', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ usernme: 'butter_bridge', body: 'test with no username on body' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('posted body missing required fields');
      });
  });
  test('POST 400 - posted body has error in expected object key of body', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'butter_bridge', bdy: 'test with no username on body' })
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
  test('POST 400 - article id is of the wrong data type', () => {
    return request(app)
      .post('/api/articles/hello/comments')
      .send({ username: 'butter_bridge', body: 'test comment' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('input uses invalid data type');
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

describe('/api/users', () => {
  test('GET 200 - responds with an array of user objects, each with username, name and avatar_url properties', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
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
