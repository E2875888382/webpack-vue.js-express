const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const resolve = (src)=> {
    return path.join(__dirname, src);
}

module.exports = {
    mode:'development',
    entry:resolve('./src/entries/main.js'),
    output:{
        publicPath: '/',
        path:resolve('./dist'),
        filename:'bundle.js'
    },
    devServer: {
        contentBase:resolve('./src'),
        historyApiFallback: true,
        inline: true,
        open:true,
        port:3000,
        hot: true,
        proxy:{
            '/api':{
                target:'http://loaclhost:8000',
                pathRewrite: {'^/api' : ''},
                changeOrigin:true,
                secure:true
            }
        }
      },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            template:resolve("./src/template/index.html"),
            filename:'index.html',
            minify:{
                collapseWhitespace: true,
                minifyCSS: true,
                removeComments: true,
            }
        }),
    ],
    module:{
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.(ttf|eot|svg|woff|woff2)$/,use:'url-loader'},
            {
                test:/\.(jpg|png|webp|bmp|icon|gif|jpeg)$/,
                use:'url-loader?limit=6000&name=[hash:8]-[name].[ext]'
            },
            // {
            //     test:/\.js$/,
            //     exclude:/node_modules/,
            //     use:'eslint-loader',
            //     enforce: 'pre'
            // },
            {
                test:/\.js$/,
                use:'babel-loader',
                exclude:/node_modules/
            },
            // {
            //     test:/\.vue$/,
            //     exclude:/node_modules/,
            //     use:'eslint-loader',
            //     enforce: 'pre'
            // },
            { 
                test:/\.vue$/,
                use:'vue-loader'
            }
        ],
    },
    resolve:{
        extensions: ['.js', '.vue', '.json'],
        alias:{
            "vue$":"vue/dist/vue.js",
            "@components": resolve("./src/components"),
            "@store": resolve("./src/store"),
            "@api": resolve("./src/api"),
            "@icon": resolve("./src/assets/icon"),
            "@router": resolve("./src/router"),
            "@views": resolve("./src/views")
        }
    }
}