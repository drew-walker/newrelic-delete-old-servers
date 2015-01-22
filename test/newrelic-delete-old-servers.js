var sinon = require('sinon'),
    expect = require('chai').expect,
    newRelic, mocks;

describe('Delete old NewRelic servers', function() {

    beforeEach(function() {
        mocks = {
            request: sinon.spy(),
            async: sinon.spy()
        };
        newRelic = require('../src/newrelic-delete-old-servers')(
            mocks.request,
            mocks.async
        )
    });

    describe('getServers function', function() {
        it('should request the NewRelic API endpoint with the provided API key', function() {
            newRelic.getServers('abc123');
            expect(mocks.request.firstCall.args[0].headers['X-Api-Key']).to.equal('abc123');
        });

        it('should create a callback function with the API key enclosed', function() {
            sinon.spy(newRelic, 'getServerListCallback');
            newRelic.getServers('abc123');
            expect(newRelic.getServerListCallback.firstCall.args[0]).to.equal('abc123');
            newRelic.getServerListCallback.restore();
        });
    });

});