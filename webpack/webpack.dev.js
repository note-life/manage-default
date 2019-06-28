const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const merge = require('webpack-merge');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        compress: true,
        hot: true,
        host: '0.0.0.0',
        port: 9000,
        open: true,
        // https: {
        //     key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
        //     cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
        // },
        disableHostCheck: true,
        historyApiFallback: true,
        before: (app, server) => {
            app.get('/sw.js', (req, res) => {
                res.set('content-type', 'application/javascript');
                fs.createReadStream('./src/sw.js').pipe(res);
                // res.send(fs.createReadStream('./src/sw.js'));
            })
        }
    },
    module: {
        rules: [
            {
                test: /\.pcss/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,  // importLoaders: 0 => 无 loader(默认); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                            sourceMap: true
                        }
                    },
                    { loader: 'postcss-loader' }
                ]
            }
        ]
    },
    plugins: [
        // more options: https://github.com/jantimon/html-webpack-plugin#options
        new HTMLPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});
