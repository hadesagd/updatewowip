const path = require('path');
const fs = require('fs');

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/main.js',
    target: 'node',
    output: {
        filename: 'updatewip.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.js$/, 
                loader: 'babel-loader',
                exclude: /node_modules/,  
            },
            {
                test: /node_modules[/\\]jsonstream/i,
                loader: 'shebang-loader'
            }
        ]
    }
};