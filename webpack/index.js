import webpack from 'webpack';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import assetsPlugin from 'assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const outputPath = path.resolve(__dirname, '../dist');
const publicPath = path.resolve(__dirname, '../public');
const rootPath = path.resolve(__dirname, '../');
const isProd = process.env.NODE_ENV === 'production';
export default {
    entry: {},
    output: {
        path: outputPath,
        publicPath,
        filename: '[name].js',
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true,
                },
                runtimeChunk: {
                    name: entrypoint => `runtime~${entrypoint.name}`,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(outputPath, {
            root: rootPath,
        }),
        new assetsPlugin({
            path: outputPath,
            prettyPrint: true,
        }),
        new MiniCssExtractPlugin(),
        isProd ? new webpack.HashedModuleIdsPlugin() : new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'source-map',
    devServer: {
        contentBase: outputPath,
        hot: true,
    },
};
