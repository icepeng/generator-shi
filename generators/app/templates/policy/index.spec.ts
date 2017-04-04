/* tslint:disable:no-unused-expression */
import * as mocha from 'mocha';
import * as chai from 'chai';
import { addResponses } from '../../responses';
import { <%= policyName %> } from './';

const httpMocks = require('node-mocks-http');

const expect = chai.expect;

describe('<%= policyName %>', () => {
    let req: any, res: any;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        addResponses(req, res, () => { });
    });

    it('should pass', done => {
        <%= policyName %>(req, res, () => {
            // write test here
            done();
        });
    });
});
