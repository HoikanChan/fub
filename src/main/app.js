var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var FileStore = require('session-file-store')(session);
var IL = '/';
var app = express();
app.engine('html', require('express-art-template'))
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production',
  extname:'.html'
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/dist', express.static('dist'));
app.set('views', __dirname + '/modules');

app.use(cookieParser());
app.use(session({
  resave: true, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'admin', //密钥
  name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {
    maxAge: 80000
  } //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
}));


/*获取参数*/
// app.use(bodyParser.urlencoded({ extended :false}));
app.use(cors());
//设置跨域访问
// app.all('*', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     if (req.method == 'OPTIONS') {
//         res.send(200);
//     }
//     else {
//         next();
//     }
// });



app.get('/', function (req, res) {
    res.render('../modules/pages/index.html',require('./modules/views/index/config.json'));
});


// app.get('/userCenter', function (req, res) {
//     res.locals.session = req.session;
//     if(req.session.user){ //判断session 状态，如果有效，则返回主页，否则转到登录页面
//       res.render('../modules/pages/userCenter.html',require('./modules/views/index/config.json'));
//     }else{
//       res.render('../modules/pages/loginPage.html',require('./modules/views/index/config.json'));
//     }
//   })


app.get("/404", function (req, res) {

        res.render('./modules/pages/404.html',{title:"404"});
   })
app.get("/500", function (req, res) {
     res.render('./modules/pages/500.html',{title:"500"});
})



/*遍历生成*/
function readFile(path,r){
    fs.readdir(path, function (err, files) {
        //err 为错误 , files 文件名列表包含文件夹与文件
        if (err) {app.use(function(req, res, next){ 

            res.locals.session = req.session;
            
            next();
            
            });
            console.log('error:\n' + err);
            return;
        }
        files.forEach(function (file) {
            if(file == '404 '){
                console.log(err);
                return;
            }
            fs.stat(path + '/' + file, function (err, stat) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (stat.isDirectory()) {
                     if(file.indexOf("~")==-1){
                         setRoute(path,file,r);
                          // 如果是文件夹遍历
                        readFile(path + '/' + file,r+file+'/');
                     }
                } else {
                    /*第一次*/
                    // setRoute(path,file,r);
                }
            });
        });
    });
}
function setRoute(path, file, p) {
    if (file.indexOf("fullScreenSys") != -1) {
        var obj = require(path + '/' + file + '/config.json');
        var global = require("./config/develop.json");
        for (var i in global) {
            template.defaults.imports[i] = global[i];
        }
        app.get('/' + file, function (req, res) {
            res.render('../modules/pages/common.html', obj);
        });
    } else if (file.indexOf("mapContrast") != -1) {
        var obj = require(path + '/' + file + '/config.json');
        var global = require("./config/develop.json");
        for (var i in global) {
            template.defaults.imports[i] = global[i];
        }
        app.get('/' + file, function (req, res) {
            res.render('../modules/pages/fullScreenMap.html', obj);
        });
    }else if (file.indexOf("0") != -1) {
        var obj = require(path + '/' + file + '/config.json');
        var global = require("./config/develop.json");
        for (var i in global) {
            template.defaults.imports[i] = global[i];
        }
        app.get('/' + file, function (req, res) {
            res.render('../modules/pages/common.html', obj);
        });
    }else if (file.indexOf("fullScreenMap") != -1) {
        var obj = require(path + '/' + file + '/config.json');
        var global = require("./config/develop.json");
        for (var i in global) {
            template.defaults.imports[i] = global[i];
        }
        app.get('/' + file, function (req, res) {
            res.render('../modules/pages/fullScreenMap.html', obj);
        });
    }else  if (file.indexOf("~") == -1) {
        var obj = require(path + '/' + file + '/config.json');
        var global = require("./config/develop.json");
        for (var i in global) {
            template.defaults.imports[i] = global[i];
        }
        app.get('/' + file, function (req, res) {
            res.render('../modules/pages/index.html', obj);
        });
     }
}
readFile('./modules/views', IL);





if (!module.parent) {
    app.listen(3000); 
    console.log('Express started on port 3000');
}
module.exports = app;
