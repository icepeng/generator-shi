import * as mocha from 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';
import { addResponses } from '../../responses';
import { Model, <%= interfaceName %> } from '../../model';
import { <%= modelName %>Controller } from './';

const httpMocks = require('node-mocks-http');

const expect = chai.expect;

describe('<%= interfaceName %>', () => {
    let req: any, res: any;
    const next = (err: Error) => { throw err; };
    let sandbox: SinonSandbox;
    let status: number, body: any;
    const <%= modelName %>Keys = [
        <%- keys %>    ];
    const inputData: <%=interfaceName %> = {
        // write input data here
    };

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        addResponses(req, res, () => { });
    });

    before(() => {
        const <%= modelName %>Mock: <%=interfaceName %> = {
            id: 'existing_id',
            // write mock data here
        };
        sandbox = sinon.sandbox.create();
        sandbox.stub(Model.<%= modelName %>, 'all').callsFake(() => Promise.resolve([<%= modelName %>Mock]));
        sandbox.stub(Model.<%= modelName %>, 'find').callsFake((id: string) => {
            if (id === 'existing_id') {
                return Promise.resolve(<%= modelName %>Mock);
            }
            return Promise.resolve(null);
        });
        sandbox.stub(Model.<%= modelName %>, 'add').callsFake((input: any) => {
            input.id = 'existing_id';
            input.createTime = '2017-02-23';
            return Promise.resolve(input);
        });
        sandbox.stub(Model.<%= modelName %>, 'remove').callsFake((id: string) => {
            if (id === 'existing_id') {
                return Promise.resolve(1);
            }
            return Promise.resolve(0);
        });
        sandbox.stub(Model.<%= modelName %>, 'edit').callsFake((id: string, input: any) => {
            if (id === 'existing_id') {
                input.id = id;
                input.createTime = '2017-02-23';
                return Promise.resolve(input);
            }
            return Promise.resolve(null);
        });
    });

    after(() => {
        sandbox.restore();
    });

    describe('getAll', () => {
        beforeEach(done => {
            <%= modelName %>Controller.getAll(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                done();
            });
        });

        it('should success with JSON array', () => {
            expect(status).to.equal(200);
            expect(body.message).to.equal('Success');
            expect(body.<%= pluralName %>).to.be.an('array');
        });

        it('should include <%= interfaceName %>', () => {
            const <%= modelName %> = body.<%= pluralName %>[0];
            expect(<%= modelName %>).to.exist;
            expect(<%= modelName %>).to.have.all.keys(<%= modelName %>Keys);
        });
    });

    describe('getOne', () => {
        beforeEach(done => {
            req.params.id = 'existing_id';
            <%= modelName %>Controller.getOne(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                done();
            });
        });

        it('should success with JSON Object', () => {
            expect(status).to.equal(200);
            expect(body.message).to.equal('Success');
            expect(body.<%= modelName %>).to.be.an('object');
        });

        it('should include <%= interfaceName %>', () => {
            const <%= modelName %> = body.<%= modelName %>;
            expect(<%= modelName %>).to.exist;
            expect(<%= modelName %>).to.have.all.keys(<%= modelName %>Keys);
        });

        it('should send 404 when <%= modelName %> not exist', done => {
            req.params.id = 'not_existing_id';
            <%= modelName %>Controller.getOne(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                expect(status).to.equal(404);
                done();
            }).catch(done);
        });
    });

    describe('add', () => {
        beforeEach(done => {
            req.body = inputData;
            <%= modelName %>Controller.add(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                done();
            });
        });

        it('should success with JSON object', () => {
            expect(status).to.equal(200);
            expect(body.message).to.equal('Success');
            expect(body.<%= modelName %>).to.be.an('object');
        });

        it('should include <%= interfaceName %>', () => {
            const <%= modelName %> = body.<%= modelName %>;
            expect(<%= modelName %>).to.exist;
            expect(<%= modelName %>).to.have.all.keys(<%= modelName %>Keys);
        });
    });

    describe('remove', () => {
        it('should success', done => {
            req.params.id = 'existing_id';
            <%= modelName %>Controller.remove(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                expect(status).to.equal(200);
                expect(body.message).to.equal('Success');
                done();
            });
        });

        it('should send 404 when <%= modelName %> not exist', done => {
            req.params.id = 'not_existing_id';
            <%= modelName %>Controller.remove(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                expect(status).to.equal(404);
                done();
            }).catch(done);
        });
    });

    describe('edit', () => {
        beforeEach(done => {
            req.params.id = 'existing_id';
            req.body: <%=interfaceName %> = {
                // write edited value here
            };
            <%= modelName %>Controller.edit(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                done();
            });
        });

        it('should success with JSON Object', () => {
            expect(status).to.equal(200);
            expect(body.message).to.equal('Success');
            expect(body.<%= modelName %>).to.be.an('object');
        });

        it('should include edited <%= interfaceName %>', () => {
            const <%= modelName %>: <%=interfaceName %> = body.<%= modelName %>;
            expect(<%= modelName %>).to.exist;
            expect(<%= modelName %>).to.have.all.keys(<%= modelName %>Keys);
            // expect edited value here
        });

        it('should send 404 when <%= modelName %> not exist', done => {
            req.params.id = 'not_existing_id';
            <%= modelName %>Controller.edit(req, res, next).then(() => {
                status = res.statusCode;
                body = res._getData();
                expect(status).to.equal(404);
                expect(body.message).to.equal('No <%= modelName %> found with the given id.');
                done();
            }).catch(done);
        });
    });
});
