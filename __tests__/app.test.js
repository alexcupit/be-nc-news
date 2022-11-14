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
