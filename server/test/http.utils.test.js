'use strict';
const PROJECT_DIR = require('../../settings').PROJECT_DIR;

const constants = require(PROJECT_DIR + '/server/utils/constants.utils');
const dataFactory = require('./data-factory');
const httpUtils = require(PROJECT_DIR + '/server/utils/http.utils');
const expect = require('chai').expect;

/**
 * @description Tests for the http.utils module.
 */

describe('HTTP Utils handleError', () => {
  const status = 400;
  const body = 'failed';
  it('should return a mock HTTP response with the correct state', (done) => {
    const response = httpUtils.handleError(dataFactory.createMockResponse(), status, body, null);
    expect(response.mockStatus).to.equal(status);
    expect(response.mockBody).to.equal(body);
    done();
  });
  it('should successfully rollback and return a mock HTTP response with the correct state', (done) => {
    httpUtils.handleError(dataFactory.createMockResponse(), status, body, dataFactory.createMockTransaction(false))
      .then((response) => {
          expect(response.mockStatus).to.equal(status);
          expect(response.mockBody).to.equal(body);
          done();
      });
  });
  it('should fail to rollback and return a mock HTTP response with the correct state', (done) => {
    httpUtils.handleError(dataFactory.createMockResponse(), status, body, dataFactory.createMockTransaction(true))
      .then((response) => {
          expect(response.mockStatus).to.equal(500);
          expect(response.mockBody).to.equal(constants.MESSAGES.ROLLBACK_ERROR);
          done();
      });
  });
});

describe('HTTP Utils handleSuccess', () => {
  const status = 200;
  const body = 'success';
  it('should return a mock HTTP response with the correct state', (done) => {
    const response = httpUtils.handleSuccess(dataFactory.createMockResponse(), status, body, null);
    expect(response.mockStatus).to.equal(status);
    expect(response.mockBody.data).to.equal(body);
    done();
  });
  it('should successfully commit and return a mock HTTP response with the correct state', (done) => {
    httpUtils.handleSuccess(dataFactory.createMockResponse(), status, body, dataFactory.createMockTransaction(false))
      .then((response) => {
          expect(response.mockStatus).to.equal(status);
          expect(response.mockBody.data).to.equal(body);
          done();
      });
  });
  it('should successfully commit and return a mock HTTP response with the correct state', (done) => {
    httpUtils.handleSuccess(dataFactory.createMockResponse(), status, body, dataFactory.createMockTransaction(true))
      .then((response) => {
          expect(response.mockStatus).to.equal(500);
          expect(response.mockBody).to.equal(constants.MESSAGES.COMMIT_ERROR);
          done();
      });
  });
});
