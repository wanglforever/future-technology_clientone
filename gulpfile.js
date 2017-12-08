'use strict';
var gulp = require('gulp'),
    path = require('path'),
    del = require('del'),
    open = require('open'),
    chalk = require('chalk'),
    runSequence = require('run-sequence'),
    streamqueue = require('streamqueue'),
    merge = require('merge-stream'),
    stylish = require('jshint-stylish'),
    plugins = require('gulp-load-plugins')();

var args = require('yargs')
    .alias('b', 'build')
    .alias('h', 'help')
    .alias('p', 'protocol')
    .alias('s', 'serverIp')
    .alias('t', 'port')
    .alias('d', 'debug')
    .alias('r', 'runServer')
    .default('runServer', true)
    .default('debug', false)
    .default('build', false)
    .default('port', 3000)
    .default('protocol', 'http://')
    .default('html5Mode', false)
    .argv;

var appName = 'udbs';
var build = !!args.build;
var debug = !!args.debug;
var isRunServer = args.runServer === true || args.runServer.toLowerCase() === "true";
var port = args.port;
var targetDir = path.resolve(build || !isRunServer ? 'www' : '.tmp');
var isNewIp = !!args.serverIp && !!args.protocol;
var serverUrl = args.protocol + args.serverIp;
var resourceUrl = args.resourceIp + "/**";
var env = process.env.NEC_ENV || 'local'; // 暴露 NEC_ENV 环境变量
/**
 * 命令帮助
 */
gulp.task('help', function() {
    var chalkLog = chalk.red.bold;
    console.log(chalkLog('   gulp [参数 值 参数 值..]  调用形式'));
    console.log(chalkLog('   gulp 本地调试命令，自动打开浏览器，开启压缩时，关闭调试功能'));
    console.log(chalkLog('   gulp clean             清除构建产生的目录和文件'));
    console.log(chalkLog('   gulp jshint            检测js代码规范'));
    console.log(chalkLog('   gulp -b,--build        是否压缩编译打包，默认false'));
    console.log(chalkLog('   gulp -d,--debug        是否开启代码调试，默认false'));
    console.log(chalkLog('   gulp -h,--help,help    gulp参数说明'));
    console.log(chalkLog('   gulp -p,--protocol     后端传输协议，默认http://'));
    console.log(chalkLog('   gulp -s,--serverIp     后端服务IP地址，需要端口号'));
    console.log(chalkLog('   gulp -t,--port         前端测试服务端口号，开启压缩时无效，默认9000'));
    console.log(chalkLog('   gulp -r,--runServer    是否开启调试服务（代码不压缩），开启压缩后无效，默认true'));
    console.log(chalkLog('   gulp --resourceIp      Resource服务器地址：如：http://1.1.1.1:8880'));
    console.log(chalkLog('   gulp --html5Mode       是否开启Html5 Mode，消除Url的#号，默认false'));
});

/**
 * 本地测试服务
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('serve', function() {
    plugins.connect.server({
        root: [targetDir],
        port: port,
        livereload: true
    });
    open('http://localhost:' + port + '/index.html');
});

/**
 * 编译SCSS文件到指定目录
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('styles', function() {
    var sassOptions = build ? {
        style: 'compressed'
    } : {
        style: 'expanded'
    };

    //parse sass to css
    var sassStream = plugins.rubySass('src/styles/main.scss', sassOptions)
        .pipe(plugins.autoprefixer({
            browsers: ['last 3 version']
        }));

    //替换图片等文件路径
    var revImgStream = gulp.src(['dist/**/*.json']);
    var revCssStream = streamqueue({
            objectMode: true
        }, revImgStream, sassStream)
        .pipe(plugins.if(build, plugins.revCollector({
            dirReplacements: {
                '../': function(path) {
                    return '../' + path;
                }
            }
        })))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.if(build, plugins.minifyCss({
            processImport: false
        })))
        .pipe(plugins.if(build, plugins.rev()));

    return revCssStream.pipe(gulp.dest(path.join(targetDir, 'styles')));
});

/**
 * 打包第三方css文件到指定目录
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('styles-vendor', function() {
    var stylesVendorStream = gulp.src(require('./vendorCss.json'));
    var fontsStream = gulp.src('dist/fonts/*.json');

    return streamqueue({
            objectMode: true
        }, fontsStream, stylesVendorStream)
        .pipe(plugins.if(build, plugins.revCollector({
            dirReplacements: {
                '../fonts': function(path) {
                    return '../fonts/' + path;
                }
            }
        })))
        .pipe(plugins.concat('vendor.css'))
        .pipe(plugins.if(build, plugins.minifyCss({
            processImport: false
        })))
        .pipe(plugins.if(build, plugins.rev()))
        .pipe(gulp.dest(path.join(targetDir, 'styles')))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/styles-vendor'));

});

/**
 * 连接生成第三方js文件
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('vendor', function() {
    var mainStream = gulp.src(require('./vendor.json'))
        .pipe(plugins.concat('vendor.js'));

    return streamqueue({
            objectMode: true
        }, mainStream)
        .pipe(plugins.if(build, plugins.uglify()))
        .pipe(plugins.if(build, plugins.rev()))
        .pipe(gulp.dest(targetDir))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/vendor'));
});

/**
 * 生成templates的view到angular的templateCache,然后和项目的js合并
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('scripts', function() {
    var dest = path.join(targetDir, 'scripts');
    var config = require('./src/config/config.json');
    var oldUrl = config[env].serverUrl,
        oldResUrl = config[env].resourceUrl;

    var configStream = gulp.src('src/config/config.json')
        .pipe(plugins.ngConfig(appName, {
            createModule: false,
            environment: env
        }))
        .pipe(plugins.if(isNewIp,
            plugins.replace(oldUrl, serverUrl)))
        .pipe(plugins.if(isNewIp,
            plugins.replace(oldResUrl, resourceUrl)))
        .pipe(gulp.dest(dest));

    var templateStream = gulp
        .src(['dist/**/*.json', 'src/views/**/*.html'])
        .pipe(plugins.if(build, plugins.revCollector({
            dirReplacements: {
                '': function(path) {
                    return path;
                }
            }
        })))
        .pipe(plugins.naturalSort())
        .pipe(plugins.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(plugins.angularTemplatecache('templates.js', {
            root: 'views/',
            module: appName
        }));

    var appStream = gulp.src('src/scripts/app.js')
        .pipe(plugins.if(args.html5Mode,
            plugins.replace('html5Mode(false)', 'html5Mode(false)')));
    //获取所有定义module的js，如：common/commonModule.js
    var moduleStream = gulp.src(['*/*.js'], {
            cwd: 'src/scripts'
        })
        .pipe(plugins.naturalSort())
        .pipe(plugins.if(!build, plugins.changed(dest)));

    var subModuleStream = gulp.src(['*/*/*.js'], {
            cwd: 'src/scripts'
        })
        .pipe(plugins.naturalSort())
        .pipe(plugins.if(!build, plugins.changed(dest)));

    //获取所有模块下的js,排除掉了定义module的js, 如：common/utils/[文件夹/](可有可无)*.js
    var scriptStream = gulp.src(['dist/**/*.json', 'src/scripts/*/*/*/**/*.js'])
        .pipe(plugins.if(build, plugins.revCollector({
            dirReplacements: {
                '': function(path) {
                    return path;
                }
            }
        })))
        .pipe(plugins.naturalSort())
        .pipe(plugins.if(!build, plugins.changed(dest)));

    return streamqueue({
            objectMode: true
        }, appStream, moduleStream, subModuleStream, scriptStream, templateStream)
        .pipe(plugins.if(build, plugins.ngAnnotate()))
        .pipe(plugins.if(build, plugins.stripDebug()))
        .pipe(plugins.if(build, plugins.sourcemaps.init()))
        .pipe(plugins.if(build, plugins.concat('app.js')))
        .pipe(plugins.if(build, plugins.uglify()))
        .pipe(plugins.if(debug, plugins.sourcemaps.write()))
        .pipe(plugins.if(build, plugins.rev()))
        .pipe(gulp.dest(dest));
});

/**
 * 打包字体
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('fonts', function() {
    gulp.src(['src/fonts/*.*'])
        .pipe(gulp.dest(path.join(targetDir, 'fonts')))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/fonts'));
    gulp.src(['src/fonts/*.*'])
        .pipe(gulp.dest(path.join(targetDir, 'styles/fonts')))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/style_fonts'));
    return gulp.src('bower_components/bootstrap/dist/fonts/*.*')
        .pipe(gulp.dest(path.join(targetDir, 'fonts/bootstrap')));
});

/**
 * 编译打包图片
 * @param  {[type]} )
 * @return {[type]}   [description]
 */
gulp.task('images', function() {
    return gulp.src('src/images/**/*.*', { base: 'src' })
        .pipe(plugins.if(build, plugins.imagemin({
            progressive: true
        })))
        .pipe(plugins.if(build, plugins.rev()))
        .pipe(gulp.dest(targetDir))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/images'));
});

/**
 * js代码检测
 * @param  {[type]}
 * @return {[type]}       [description]
 */
gulp.task('jshint', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish));
});

/**
 * 注入样式、第三方js、项目js到home.html中
 * @param  {String}
 * @return {[type]}   [description]
 */
gulp.task('inject', ['styles-vendor', 'styles', 'vendor', 'scripts'], function() {

    function isFileExcept(path) {
        var isExcept = false;
        for (var i = 0, n = exceptRegx.length; i < n; i++) {
            if (exceptRegx[i].test(path)) {
                isExcept = true;
                break;
            }
        }
        return isExcept;
    }

    var cssNaming = 'styles/main*';
    var cssVendorNaming = 'styles/vendor*';
    var exceptRegx = [/\.html$/, /((main|home)-\w*\.css)$/, /(app-\w*\.js)$/];
    var _inject = function(src, tag) {
        return plugins.inject(src, {
            starttag: '<!-- inject:' + tag + ':{{ext}} -->',
            read: false,
            addRootSlash: false,
            transform: function(filepath, file, index, length, targetFile) {
                if (!build || isFileExcept(filepath)) {
                    return plugins.inject.transform.apply(plugins.inject.transform, arguments);
                } else {
                    return plugins.inject.transform.apply(
                        plugins.inject.transform, [filepath, file, index, length, targetFile]);
                }
            }

        });
    };

    var _getAllScriptSources = function() {
        var scriptStream = gulp.src(['scripts/app.js', 'scripts/**/*.js'], {
            cwd: targetDir
        });
        return streamqueue({
            objectMode: true
        }, scriptStream);
    };

    return gulp.src(['dist/**/*.json', 'src/*.html'])
        .pipe(plugins.if(build,
            plugins.injectString.after('<!--html5mode-->',
                '\n<base href="/index.html">\n')))
        .pipe(plugins.if(build,
            plugins.replace('./index.html#', '')))
        .pipe(_inject(gulp.src(cssVendorNaming, {
            cwd: targetDir
        }), 'vendor-styles'))
        .pipe(_inject(gulp.src(cssNaming, {
            cwd: targetDir
        }), 'app-styles'))
        .pipe(_inject(gulp.src('styles/home*', {
            cwd: targetDir
        }), 'home-styles'))
        .pipe(_inject(gulp.src('vendor*.js', {
            cwd: targetDir
        }), 'vendor'))
        .pipe(_inject(gulp.src('home*.js', {
            cwd: targetDir
        }), 'home'))
        .pipe(plugins.if(build,
            _inject(gulp.src(['scripts/app*.js','scripts/config.js'], {
                cwd: targetDir
            }), 'app'),
            _inject(_getAllScriptSources(), 'app')))
        .pipe(plugins.if(build, plugins.revCollector({
            dirReplacements: {
                '': function(path) {
                    return path;
                }
            }
        })))
        .pipe(plugins.if(build, plugins.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })))
        .pipe(gulp.dest(targetDir));
});

/**
 * 监听文件变化实时更新页面
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('watchers', function() {
    plugins.livereload.listen();
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/fonts/**', ['fonts']);
    gulp.watch('src/images/**', ['images']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('./vendor.json', ['vendor']);
    gulp.watch('src/views/**/*.html', ['scripts']);
    gulp.watch('src/index.html', ['inject']);
    gulp.watch(targetDir + '/**')
        .on('change', plugins.livereload.changed);
});

/**
 * 删除编译目录
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('clean', function(done) {
    return del([targetDir, 'dist'], done);
});

/**
 * 空任务
 * @param  {[type]}
 * @return {[type]}   [description]
 */
gulp.task('noop', function() {});

/**
 * 默认任务
 * @param  {[type]}
 * @return {[type]}       [description]
 */
gulp.task('default', function(done) {
    if (args.help) {
        gulp.start('help');
    } else {
        runSequence(
            'clean', ['fonts', 'images'],
            'inject',
            build || !isRunServer ? 'noop' : 'watchers',
            build || !isRunServer ? 'noop' : 'serve',
            done);
    }
});
