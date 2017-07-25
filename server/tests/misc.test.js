import request from 'supertest-as-promised';
import randomstring from 'randomstring';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', done => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', done => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', done => {
      request(app)
        .get('/api/users/56z787zzz67fc')
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(res => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - email is required', done => {
      request(app)
        .post('/api/users')
        .send({
          name: randomstring.generate(),
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.equal('"email" is required');
          done();
        })
        .catch(done);
    });

    it('should handle express validation error - name is required', done => {
      request(app)
        .post('/api/users')
        .send({
          email: `${randomstring.generate()}@gmail.com`,
        })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.equal('"name" is required');
          done();
        })
        .catch(done);
    });
  });
});
