var express=require('express');
var router=express.Router();
var mysql=require('mysql');
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'12345',
    port: '3306', 
    database:'videos',
    multipleStatements: true // 支持执行多条 sql 语句
});
//https://blog.csdn.net/bipedal_bit/article/details/48246963
//用于处理第二次连接数据库出现error的问题
function handleDisconnect(connection) {
    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }  
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        throw err;
      }   
      console.log('Re-connecting lost connection: ' + err.stack); 
      connection = mysql.createConnection(connection.config);
      handleDisconnect(connection);
      connection.connect();
    });
};

//查询新闻接口
router.post('/getNews',(request,response) =>{
    connection.connect();
    var begin = (request.body.page -1)*10;
    var end = request.body.page*10;
    var sql = `SELECT * FROM news LIMIT ${ begin },${ end }`;
    connection.query(sql,(error,result) =>{
        if(error){
            response.status(500).send('server error');
        }
        response.status(200).json({ code:200,newsList:result });
    })
    handleDisconnect(connection);
})

//查询新闻数目接口
router.get('/getNewsCount',(request,response) => {
    connection.connect();
    var sql = `SELECT COUNT(*) FROM news`;
    connection.query(sql,(error,result) =>{
        if(error){
            response.status(500).send('server error');
        }
        response.status(200).json({ code:200,newsCount:result });
    })
    handleDisconnect(connection);
})

//查询新闻详情
router.post('/getNewsDetails',(request,response) =>{
    connection.connect();   
    var sql = `SELECT * FROM news WHERE id = "${ request.body.id }"`;
    connection.query(sql,(error,result) =>{
        if(error){
            response.status(500).send('server error');
        }
        response.status(200).json({ code:200,newsList:result });
    })
    handleDisconnect(connection);
})

//增加新闻阅读量
router.post('/addNewsRead',(request,response) =>{
    connection.connect();   
    var sql = ' UPDATE news SET `read` = `read` + 1  WHERE id = '+request.body.id;
    connection.query(sql,(error,result) =>{
        if(error){
            response.status(500).send('server error');
        }
        response.status(200).json({ code:200,message:'阅读量增加' });
    })
    handleDisconnect(connection);   
})
//导出router
module.exports=router;  