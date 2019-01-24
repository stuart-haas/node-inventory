const config = require('./gulpfile.config.json');

var env = config.env.current;
var entries = config.tasks.js.env[env].entries;

for (key in entries) {
    var entry = entries[key]
    for(var i = 0; i < entry.length; i ++) {
        var src = entry[i];
        src = config.root.src + config.tasks.js.src + src;
        entries[key] = src;
    }
}

module.exports = {
    mode: 'none',
    entry:  entries,
    output: {
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    module: {
      rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
                query: {
                presets: [
                    ["es2015", "stage-1"],
                ],
                },
            },
        ],
    },
    externals: {
        "jquery": "jQuery"
    }
};