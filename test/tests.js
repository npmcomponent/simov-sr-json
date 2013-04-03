
chai.should();
mocha.setup({
    ui: 'bdd',
    globals: ['']
});

window.addEventListener('load', function (e) {
    mocha.run();
});


describe('sr-json', function () {
    var html, fixture;
    before(function (done) {
        var tpath = '../lib/sr-json.html',
            fpath = 'fixture.json';
        file.load(tpath, function (err, _html) {
            if (err) return done(err);
            html = _html;
            file.load(fpath, function (err, _fixture) {
                if (err) return done(err);
                fixture = _fixture;
                done();
            });
        });
    });

    it('parse render serialize - check out the console', function (done) {
        // parse
        json.parse(JSON.parse(fixture), function (params) {
            console.show('parsed', params);
            // render
            var template = Hogan.compile(html),
                content = template.render({value: params}, {value: html});
            
            // append
            var container = document.querySelector('.sr-json');
            container.innerHTML = content;
            console.show('rendered', container, {log: true});
            
            // serialize
            var ul = container.children[0];
            json.serialize(ul.children, function (result) {
                console.show('serialized', result);

                // assert
                result.should.deep.equal(JSON.parse(fixture));
                done();
            });
        });
    });
});

console.show = function (name, data, options) {
    options = options || {};
    options.collapsed ? this.groupCollapsed(name) : this.group(name);
    options.log ? this.log(data) : this.dir(data);
    this.groupEnd();
}
