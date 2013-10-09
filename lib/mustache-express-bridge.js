var fs = require("fs")
, path = require("path")
, express = require("express")
, mustache = require("mustache");


exports.compile = function(source, options) {
    var views = options.views || './views';
    var extension = options.extension || '.html';

    if (typeof source == 'string') {
        return function(options) {
            options.locals = options.locals || {};
            options.partials = options.partials || {};

            if (options.body) // for express.js > v1.0
                locals.body = options.body;

            for(var p in options.partials) {
                var partialFileName = views + '/' + options.partials[p] + extension;

                if(path.existsSync(partialFileName)) {
                    options.partials[p] = fs.readFileSync(partialFileName, "utf-8");
                }
            }               
            return mustache.to_html(source, options.locals, options.partials);
        };
    } else {
        return source;
    }
}

exports.render = function (template, options) {
    template = this.compile(template, options);
    return template(options);
}
