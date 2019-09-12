const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const article = require('./router/article');
const user = require('./router/user');
const news = require('./router/news');
const photo = require('./router/photo');
const search = require('./router/search');

const app = express();

//配置body-parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//设置静态文件夹
app.use('/node_modules/',express.static(path.join(__dirname,'../node_modules/')));

//设置跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length,token');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(article);
app.use(user);
app.use(news);
app.use(photo);
app.use(search);

app.listen(8000,function(){
    console.log('----- server on -----');
});