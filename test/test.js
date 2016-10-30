describe('papapa', function() {
    var assert = require('chai').assert,
        expect = require('chai').expect,
        jsdom = require('jsdom'),
        pkg = require('../package.json');

    it('basic test', function(done) {
        jsdom.env('test/index.html', function(err, window) {
            expect(window.Papapa).to.be.an('function');
            expect(window.Papapa.version).to.be.equal(pkg.version);
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('event system', function(done) {
        jsdom.env('test/index.html', function(err, window) {
            let keyboard = new window.Papapa.Framework(),
                keyIsDown = false,
                keyIsUp = false;
            function keyUpHandler() {
                keyIsUp = true;
            }
            keyboard.on('keyup', keyUpHandler);
            keyboard.when('keydown', function() {
                keyIsDown = true;
            });
            keyboard._dispatchEvent('keydown');
            keyboard._dispatchEvent('keyup');
            expect(keyIsDown).to.be.equal(true);
            expect(keyIsUp).to.be.equal(true);
            keyIsUp = false;
            keyboard.off('keyup', keyUpHandler);
            keyboard._dispatchEvent('keyup');
            expect(keyIsUp).to.be.equal(false);
            done();
        }, {
            features: {
                FetchExternalResources: ['link', 'script']
            }
        });
    });

    it('direction', function() {

    });
});