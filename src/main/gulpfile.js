var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var combiner = require('stream-combiner2');
var plugins = gulpLoadPlugins();
var del = require('del');
var liveserver = require('gulp-live-server');
var path = require('path');
var babel = require('gulp-babel');
var fs = require('fs');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var webpack = require('webpack-stream');
var template = require('art-template');
var es = require('event-stream');
template.defaults.extname='.html';
var yargs = require('yargs');
var webapp = 'resources/'; 
var manifest = gulp.src(webapp+'static/**/rev-manifest.json');

var dist = 'dist/';

var args = yargs
  .option('production',{
    boolean:true,
    default:false,
    describe:'min all scripts'
  })
 .option('watch',{
    boolean:true,
    default:false,
    describe:'watch all files'
  })
  .option('verbose',{
    boolean:true,
    default:false,
    describe:'log'
  })
  .option('sourcemaps',{
    describe:'force the creation of sroucemaps'
  })
  .option('port',{
    string:true,
    default:8080,
    describe:'server port'
  })
 .argv

var handleError = function (err) {      //错误处理
    var colors = plugins.util.colors;
    console.log('\n');
    plugins.util.log(colors.red('Error!'));
    plugins.util.log('fileName: ' + colors.red(err.fileName));
    plugins.util.log('lineNumber: ' + colors.red(err.lineNumber));
    plugins.util.log('message: ' + err.message);
    plugins.util.log('plugin: ' + colors.yellow(err.plugin));
};

gulp.task('serve', (cb) => {
        if (!args.watch) return cb();
        var server = liveserver.new(['--harmony', 'app.js']);   //服务器
        server.start();

        var watcher = gulp.watch(['./modules/**/*.js', './modules/**/*.html', './modules/**/*.{scss,css}', './modules/assets'], ['browser']);

        watcher.on('change',function (file) {

                //  setTimeout(function() {
                //         server.notify.apply(server, [file]);
                // }, 500)

        })

        gulp.watch(['app.js'], function () {
                server.start.bind(server)()
        });
});


gulp.task('js', () => {
        var combind = (src,nsrc) => {
                gulp.src(src)
                        .pipe(plugins.changed(nsrc))    //判断文件是否更改，只传递更改过的文件
                        .pipe(plugins.plumber({         //把错误转到错误流，防止因错误导致pipe breaking
                                errorHandle: function (err) {
                                        handleError(err)
                                }
                        }))
                        .pipe(gulp.dest(nsrc))
                        // .pipe(plugins.uglify())
                        // .pipe(plugins.rename({suffix:'.min'}))
                        // .pipe(gulp.dest(nsrc))
                        .pipe(plugins.if(args.watch, plugins.livereload()))
        };
        combind('modules/plugins/**/*.js', dist+'plugins/');
        combind('modules/public/js/*.js', dist+'public/js/');
        combind('modules/views/**/*.js', dist+'views/');
});
gulp.task('plugins', () => {
        gulp.src('dist/plugins/css/*.css')
                .pipe(plugins.changed('resources/plugins/css/'))    //判断文件是否更改，只传递更改过的文件
                .pipe(plugins.cleanCss())        
                .pipe(plugins.plumber({         //把错误转到错误流，防止因错误导致pipe breaking
                        errorHandle: function (err) {
                                handleError(err)
                        }
                }))
                .pipe(gulp.dest('resources/plugins/css/'))
        gulp.src('dist/plugins/js/*.js')
                .pipe(plugins.changed('resources/plugins/js/'))    //判断文件是否更改，只传递更改过的文件
                .pipe(plugins.uglify(
                        {
                        output: {
                                "max_line_len":500000
                        }
                }
            ))
            .pipe(plugins.replace('../../dist/assets/', '../../assets/'))
                .pipe(plugins.plumber({         //把错误转到错误流，防止因错误导致pipe breaking
                        errorHandle: function (err) {
                                handleError(err)
                        }
                }))
                .pipe(gulp.dest('resources/plugins/js/'))
});


gulp.task('assets',()=>{
        gulp.src('./modules/assets/**')
                .pipe(plugins.changed(dist + 'assets/'))
                 .pipe(plugins.plumber({         //把错误转到错误流，防止因错误导致pipe breaking
                        errorHandle: function (err) {
                                handleError(err)
                        }
                }))
                .pipe(gulp.dest(dist+'assets/'))
})

gulp.task('browserify', () => {
        var entryFiles = [];
        fs.readdir(dist+'views', function (err, files) {
                //err 为错误 , files 文件名列表包含文件夹与文件
                if (err) {
                        console.log('error:\n' + err);
                        return;
                }
                files.forEach(function (file) {
                        if (file.indexOf("~") != -1) {
                                return false;
                        }
                        entryFiles.push(dist+'views/' + file +'/script.js')
                });
                //遍历映射这些入口文件
                var tasks = entryFiles.map(function(entry){
                        return browserify({entries: [dist+'views/index/script.js']})
                        .bundle()
                        .pipe(source(entry))
                        .pipe(gulp.dest("."));
                });
                //     创建一个合并流
                // return es.merge.apply(null, tasks);
        })
})

/*转换完整版*/
/*遍历生成*/
function readFile (path) {
        if(!path){
                return false
        }
    fs.readdir(path, function (err, files) {
        //err 为错误 , files 文件名列表包含文件夹与文件
        if (err) {
            console.log('error:\n' + err);
            return;
        }
        files.forEach(function (file) {
            if (file == '404 ') {
                console.log(err);
                return;
            }
            fs.stat(path + '/' + file, function (err, stat) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (stat.isDirectory()) {
                    creatHtml(path, file);
                    // 如果是文件夹遍历
                    //readFile(path + '/' + file, r + file + '/');
                } else {
                    /*第一次*/
                    //setRoute(path,file,r);
                }
            });
        });
    });
};

function creatHtml (path, file) {
    //      if (file.indexOf("~") == -1) {
    //             console.log("______"+file+"________");
    //             var obj = require(path + file + '/config.json');
    //             var global = require("./config/config.json");
    //             for (var i in global) {
    //                     template.defaults.imports[i] = global[i];
    //             }
    //             var html = template(__dirname+'/modules/pages/index', obj);
    //             var fileUrl = 'pages/views/';
    //             fs.writeFile(fileUrl + file + '.html', html, function (err) {
    //                     if (err) {
    //                             console.log(err)
    //                     } else {
    //                              console.log(fileUrl + file);
    //                     }
    //             });
    // }
    if (file.indexOf("fullScreenSys") != -1) {
        var obj = require(path + file + '/config.json');
        var global = require("./config/product.json");
        for (var i in global) {
                template.defaults.imports[i] = global[i];
        }
        var html = template(__dirname+'/modules/pages/common', obj);
        var fileUrl = 'pages/views/';
        fs.writeFile(fileUrl + file + '.html', html, function (err) {
                if (err) {
                        console.log(err)
                } else {
                         console.log(fileUrl + file);
                }
        });
    } else if (file.indexOf("0") != -1) {
        var obj = require(path + file + '/config.json');
        var global = require("./config/product.json");
        for (var i in global) {
                template.defaults.imports[i] = global[i];
        }
        var html = template(__dirname+'/modules/pages/common', obj);
        var fileUrl = 'pages/views/';
        fs.writeFile(fileUrl + file + '.html', html, function (err) {
                if (err) {
                        console.log(err)
                } else {
                         console.log(fileUrl + file);
                }
        });
    }else if (file.indexOf("fullScreenMap") != -1) {
        var obj = require(path + file + '/config.json');
        var global = require("./config/product.json");
        for (var i in global) {
                template.defaults.imports[i] = global[i];
        }
        var html = template(__dirname+'/modules/pages/fullScreenMap', obj);
        var fileUrl = 'pages/views/';
        fs.writeFile(fileUrl + file + '.html', html, function (err) {
                if (err) {
                        console.log(err)
                } else {
                         console.log(fileUrl + file);
                }
        });
    }else  if (file.indexOf("~") == -1) {
        var obj = require(path + file + '/config.json');
        var global = require("./config/product.json");
        for (var i in global) {
                template.defaults.imports[i] = global[i];
        }
        var html = template(__dirname+'/modules/pages/index', obj);
        var fileUrl = 'pages/views/';
        fs.writeFile(fileUrl + file + '.html', html, function (err) {
                if (err) {
                        console.log(err)
                } else {
                         console.log(fileUrl + file);
                }
        });
     }
};

var combinds = function (src, nsrc) {
    var combined = combiner.obj([
        // gulp.src(webapp+'templates/*.html'),
        gulp.src('pages/views/*.html'),    
        plugins.useref(),
        // plugins.if('*.js', plugins.uglify({          //不能在这压缩css，否则会导致图片路径出错
        //         output: {
        //                 "max_line_len":500000
        //         }
        // })),
        plugins.if('*.css',plugins.cleanCss()),
        plugins.replace('../dist/', '../'),
        gulp.dest(webapp + 'templates/'),
        ]);
        combined.on('error', handleError);
};
gulp.task('revCss', () => {
    gulp.src(webapp+'static/public/*.css')
        .pipe(plugins.cleanCss())        
        .pipe(gulp.dest(webapp + 'static/public/'))   
        .pipe(plugins.replace("../assets/", '../../assets/'))
        .pipe(plugins.rev())    // 文件名加MD5后缀
        .pipe(gulp.dest(webapp+'static/public/'))
        .pipe(plugins.rev.manifest())    // 生成一个rev-manifest.json
        .pipe(gulp.dest(webapp+'static/public/revCss'))
    gulp.src(webapp+'static/views/**/main.css')
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(webapp+'static/views/'))
        .pipe(plugins.replace('(../assets/', '(../../assets/'))    
        // .pipe(plugins.replace("../assets/", '../../assets/'))
        .pipe(plugins.rev())
        .pipe(gulp.dest(webapp+'static/views/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(webapp+'static/views/revCss'))
});
gulp.task('revJs', () => {
    gulp.src(webapp+'static/public/*.js')
        // .pipe(plugins.uglify({
        //         output: {
        //                 "max_line_len":500000
        //         }
        // }).on('error', function(err){
        //         console.log("common:"+err);
        // }))        
        .pipe(gulp.dest(webapp+'static/public/'))        
        .pipe(plugins.rev())
        .pipe(gulp.dest(webapp+'static/public/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(webapp+'static/public/revJs'))
    gulp.src(webapp+'static/views/**/main.js')
        // .pipe(plugins.uglify({
        //         output: {
        //                 "max_line_len":500000
        //         }
        // }).on('error', function(err){
        //         console.log("common:"+err);
        // }))        
        .pipe(plugins.replace('../../dist/assets/','./assets/'))                   //修改js生成dom的src引入路径
        .pipe(gulp.dest(webapp+'static/views/'))
        .pipe(plugins.rev())
        .pipe(gulp.dest(webapp+'static/views/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(webapp+'static/views/revJs'))
});
gulp.task('revHtml', function () {
    gulp.src(webapp+'templates/*')
        .pipe(plugins.revReplace({ manifest: manifest }))
        .pipe(plugins.replace('../../assets/','${host}/assets/'))        
        .pipe(plugins.replace('../static', '${host}'))
        .pipe(plugins.replace('http://localhost:3010/', '${host}/'))    
        .pipe(plugins.replace('http://120.24.181.248:8080/lvswbao-admin/', '${host}/'))
        .pipe(plugins.replace('http://210.77.87.225:8088/', '${bigScreenHost}/'))
        //zjw添加
        .pipe(plugins.replace('http://test.1010earth.com:8088/cas/register?systemId=4e6f5d00-d023-11e7-a9e1-fb16d651f8ad&service=http://test.1010earth.com:8088/jixi/cas','${registerUrl}'))
        .pipe(gulp.dest(webapp+'templates/'))

});
gulp.task("replaceGlobalVar", function () {
    gulp.src('./' + webapp + '/templates/*')
                .pipe(plugins.replace('../../plugins','${host}/plugins/'))    
                .pipe(plugins.replace('../../dist/assets/','${host}/assets/'))                   
                .pipe(plugins.replace('../../', '${host}/'))
                .pipe(plugins.replace('http://localhost:3000/', '${host}/'))    
                .pipe(plugins.replace('http://120.24.181.248:8080/lvswbao-admin/', '${host}/'))
                .pipe(plugins.replace('http://localhost:3010/', '${host}/'))
                .pipe(plugins.replace('http://127.0.0.1:8012/', '${host}/'))
                 .pipe(plugins.replace('http://127.0.0.1:8011/', '${host}/'))
                 .pipe(plugins.replace('dist/','${host}/'))  
                // .pipe(plugins.replace('http://10.0.82.72:8080/', '${host}/'))
                // .pipe(plugins.replace(/^\/IL\/$/, '${shengtaigdHost}/IL/'))
                // .pipe(plugins.replace('IL: "/IL/"', 'IL:"${shengtaigdHost}/IL/"'))
                .pipe(gulp.dest('./' + webapp + '/templates'))
})
gulp.task('cleanHashAndHttl', function () {
    return del([webapp+'static/public/*-*.{js,css}', webapp+'static/views/**/*-*.{js,css}', webapp+'templates/*.httl']);
});
gulp.task('cleanWithoutHash', function () {
    return del(['public', 'views',webapp+'static/public/basic.{js,css}',webapp+'static/views/**/main.{js,css}',webapp+'static/public/revJs',webapp+'static/public/revCss',webapp+'static/views/revJs',webapp+'static/views/revCss'])
})

gulp.task('html', () => {
        gulp.src('modules/**/*.html')
                .pipe(plugins.if(args.watch, plugins.livereload()))
});

gulp.task('buildHtml', () => {
        del([webapp+"/templates/*.httl"])
        readFile('./modules/views/');
    //将modules下的pages的demo页面直接输出
        fs.readdir('./modules/pages/', function (err, files) {
            //err 为错误 , files 文件名列表包含文件夹与文件
            if (err) {
                console.log('error:\n' + err);
                return;
            }
            files.forEach(function (file,b) {
                if (file.indexOf("demo") != -1) {
                    // var html = template(__dirname+'/modules/pages/'+file);
                    var fileUrl = 'pages/views/';
                    fs.readFile(__dirname+'/modules/pages/'+file,  'utf-8',function (err,data) {
                        fs.writeFile(fileUrl + file , data, function (err) {
                            if (err) {
                                    console.log(err)
                            } else {
                                     console.log(fileUrl + file);
                            }
                        });
                    })
                }
            });
        });

});
gulp.task('prettify', function (done) {         //解决页面上的css和js路径偶尔不合并的情况
    gulp.src('./pages/views/*.html')
        .pipe(plugins.prettify({
            indent_size: 0,
            indent_inner_html: true,
            unformatted: ['pre', 'code']
            }))
            .pipe(gulp.dest('./pages/views/'))
            
        setTimeout(function () {
                return combinds()
        }, 3000)  
});
gulp.task('htmlMin', () => {
        gulp.src('./pages/**/*.html')
                .pipe(plugins.htmlmin({
                        // removeComments: true,//清除HTML注释
                        collapseWhitespace: true,//压缩HTML
                        // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
                        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
                        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
                        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
                        // minifyJS: true,//压缩页面JS
                        // minifyCSS: true//压缩页面CSS
                }))
                .pipe(gulp.dest('./pages/'))
})

gulp.task('renameHttl', () => {
        gulp.src(webapp+'/templates/*.html')
                .pipe(plugins.rename(function (path) {
                        path.extname = ".httl"
                }))
                .pipe(gulp.dest(webapp+"/templates/"));
        setTimeout(function () {
                return del([webapp+"/templates/*.html"])
        }, 2000)
});

gulp.task('minImg', function () {
        gulp.src(dist + 'assets/image/*')
                .pipe(plugins.changed(webapp+'static/assets/image/'))
                .pipe(plugins.smushit({
                        verbose: true
                }))
                .pipe(gulp.dest(webapp+'static/assets/image/'))
});
gulp.task('minPluginsImg', function () {
        gulp.src('./dist/plugins/js/Cesium-1.34/Assets/Textures/**/*.{jpg,png}')
        .pipe(plugins.smushit({
                verbose: true
        }))
        .pipe(gulp.dest('./webapp/plugins/js/Cesium-1.34/Assets/Textures/'))
})

gulp.task('sass', () => {
         var combind = (src,nsrc) => {
                 gulp.src(src)
                        //  .pipe(plugins.changed(nsrc,{extension: '.css'}))    //判断文件是否更改，只传递更改过的文件
                        .pipe(plugins.plumber({         //把错误转到错误流，防止因错误导致pipe breaking
                                        errorHandle: function (err) {
                                                handleError(err)
                                        }
                         }))
                        .pipe(plugins.sass())
                        .pipe(plugins.autoprefixer({
                                browsers: ['last 2 version', 'last 2 Explorer versions', 'last 1 Chrome versions', 'last 3 Safari versions', 'Firefox >= 20', 'Firefox ESR'],
                                cascade: true,
                                remove: true
                         }))
                        // .pipe(gulp.dest(nsrc))
                        // .pipe(plugins.rename({
                        //         suffix: '.min'
                        // }))
                        .pipe(plugins.cleanCss())

                        // .pipe(gulpWebpack({
                        //         module: {
                        //                 loader: [{
                        //                         test: /\.css$/,
                        //                         use: [
                        //                                 {
                        //                                 loader: 'css-loader',
                        //                                 options: {
                        //                                         minimize: true || {/* CSSNano Options */}
                        //                                 }
                        //                                 }
                        //                                 ]
                        //                 }]
                        //         }
                        // }), null, (err, stats) => {
                        //         handleError(err)
                        //         // log(`Finished '${colors.cyan('scripts')}'`, stats.toString({
                        //         //         chunks: false
                        //         // }))
                        // })
                        .pipe(gulp.dest(nsrc))
                        .pipe(plugins.if(args.watch, plugins.livereload()))
         };
         combind('./modules/public/css/*.scss', dist+'public/css/');
         combind('./modules/plugins/css/*.{scss,css}', dist+'plugins/css/');
         combind('./modules/views/**/*.scss', dist+'views/');
});

gulp.task('clean', () => {
        return del(['server/public', 'server/views'])
});

gulp.task('build',plugins.sequence('sass','html','js','assets',['browser','serve']));

gulp.task('browser',(cb)=>{
  if(!args.watch) return cb();
  gulp.watch('modules/**/*.js', ['js']);
//   gulp.watch('webapp/**/*.js',['browserify']);
  gulp.watch('modules/**/*.html',['html']);
  gulp.watch('modules/**/*.{scss,css}', ['sass']);
  gulp.watch('modules/assets/**',['assets']);
});
gulp.task('default', ['build']);

/*
*       打包
*/
gulp.task('package', plugins.sequence('cleanHashAndHttl', 'buildHtml'))
gulp.task('package2', plugins.sequence('revCss', 'revJs', 'revHtml', 'minImg', 'renameHttl'))
