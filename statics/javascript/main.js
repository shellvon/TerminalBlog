/**
 * 
 * 对于最新版本的termlib.js backspace键无法按照我期望的工作方式执行【删除字符】，文档上我没找到怎么做，所以现在切换为老版本.
 * 
 */
var term;
var greeting = [
'%c(@green)',
'                                                                                ',
'                                                                                ',
'           ██                  ████      ████                                   ',
'           ██                  ████      ████                                   ',
'           ██                    ██        ██                                   ',
'  ▒█████░  ██░████    ░████▒     ██        ██      ██▒  ▒██   ░████░   ██░████  ',
' ████████  ███████▓  ░██████▒    ██        ██      ▓██  ██▓  ░██████░  ███████▓ ',
' ██▒  ░▒█  ███  ▒██  ██▒  ▒██    ██        ██      ▒██  ██▒  ███  ███  ███  ▒██ ',
' █████▓░   ██    ██  ████████    ██        ██       ██░░██   ██░  ░██  ██    ██ ',
' ░██████▒  ██    ██  ████████    ██        ██       ██▒▒██   ██    ██  ██    ██ ',
'    ░▒▓██  ██    ██  ██          ██        ██       ▒████▒   ██░  ░██  ██    ██ ',
' █▒░  ▒██  ██    ██  ███░  ▒█    ██▒       ██▒       ████    ███  ███  ██    ██ ',
' ████████  ██    ██  ░███████    █████     █████     ████    ░██████░  ██    ██ ',
' ░▓████▓   ██    ██   ░█████▒    ░████     ░████     ▒██▒     ░████░   ██    ██ ',
'                                                                                ',
'                                                                                ',
'                                                                                ',
];
TermGlobals.assignStyle( 32, 'a', '<a href="http://www.masswerk.at">', '<\/a>' );//the markup.
var helpPage = [
    '%c(@white)很高兴你能来到这个站点。该站点使用Norbert Landsteiner开发的termlib.js%c(@green)<%+ahttp://www.masswerk.at%-a>%c构建。',
    '该博客的目的我也不知是啥，不要指望在这里获取到什么有营养的东西。很感谢你的拜访.',
    '',
    '目前该博客支持一下类unix的命令:',
    '   %c(@chartreuse)help%c(@darkgray)   .  .  .  .  .  .  .  %c(@beige)输出此帮助信息。',
    '   %c(@chartreuse)cat  <file>%c(@darkgray)  .  .  .  .  .  %c(@beige)让您阅览此博客发布的文章',
    '   %c(@chartreuse)more <file>%c(@darkgray)  .  .  .  .  .  %c(@beige)让您阅览此博客发布的文章,参见cat.',
    '   %c(@chartreuse)ls%c(@darkgray)     .  .  .  .  .  .  .  %c(@beige)列出当前已经发布的文章名字',
    '   %c(@chartreuse)info%c(@darkgray)   .  .  .  .  .  .  .  %c(@beige)关于站点和作者',
    '   %c(@chartreuse)resume%c(@darkgray) .  .  .  .  .  .  .  %c(@beige)作者简历',
    '   %c(@chartreuse)clear%c(@darkgray)  .  .  .  .  .  .  .  %c(@beige)清空屏幕',
    '   %c(@chartreuse)history%c(@darkgray).  .  .  .  .  .  .  %c(@beige)历史记录',
    '   %c(@chartreuse)startx%c(@darkgray) .  .  .  .  .  .  .  %c(@beige)图形博客界面',
    '   %c(@chartreuse)invaders%c(@darkgray)  .  .  .  .  .  .  %c(@beige)see %c(@green)<%+ahttp://www.masswerk.at/termlib/sample_invaders.html%-a>%c',
    '',
    ''
];
var ip = 'localhost';
var blogInfo = [
    'Welcome to my blog.My name is shellvon.',
    '',
    '* For more usage you can the the command  %c(@chartreuse)help%c in this terminal',
    '',
    '',
    'Last login: ' + new Date() + ' from ' + ip,
];

function getBrowserWidth () {
    if (window.innerWidth) {
        return window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    } else if (document.body && document.body.offsetWidth) {
        return document.body.offsetWidth;
    } else {
        return 0;
    }
}

function getBrowserHeight () {
    if (window.innerHeight) {
        return window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    } else if (document.body && document.body.offsetHeight) {
        return document.body.offsetHeight;
    } else {
        return 0;
    }
}

function getIndexOf (arr, e) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if(arr[i] == e)
            return i;
    }
    return -1;
}

function resizeTerm (t) {
    var dim = t.getDimensions();
    var neww = Math.round((t.conf.cols/dim.width)*getBrowserWidth())-1;
    var newh = Math.round((t.conf.rows/dim.height)*getBrowserHeight())-1;
    if (neww !== 0) {
        t.resizeTo(neww,newh);
        t.maxCols = neww;
        t.maxLines = newh;   
    }
}

function termInitHandler () {
    resizeTerm(this);
    this.write(blogInfo);
    //this.write('%n');
    this.write(greeting);
    this.newLine();
    this.prompt();
}

function termControlHandler () {
    if (this.inputChar==9){
        tabComplete(this);
    }
}

function termCommandHandler () {
    this.newLine();
    parseLine(this);
    var config = '%c(@lightgrey)';
    if(this.argv.length==0){
        //no input.
    }else if(this.argQL[0]){
        this.write(config + "Syntax error: first argument quoted.");
    }else{
        var cmd = this.argv[this.argc++];
        if(cmd=='help'){
            helpCommand(this);
        }else if(cmd=='ls'){
            lsCommand(this);
        }else if(cmd=='cat'){
            catCommand(this);
        }else if(cmd=='more'){
            moreCommand(this);
        }else if(cmd=='info'){
            infoCommand(this);
        }else if(cmd=='resume'){
            resumeCommand(this);
        }else if(cmd=='clear'){
            clearCommand(this);
        }else if(cmd=='history'){
            historyCommand(this);
        }else if(cmd=='date'){
            this.write(config+Date());
        }else if(cmd=='startx'){
            window.location = '/gui/index.html';
        }else if(cmd=='invaders'){
            invadersGameCommand(term);
        }else{
            this.write(config + this.argv[0] + ': Command not found.')
        }
    }
    this.prompt();
}

function list (term, filenames) {
    if(filenames.length<=0)
        return null;
    var width = 0;
    for (var i = filenames.length - 1; i >= 0; i--) {
        width = filenames[i].length>width?filenames[i].length:width;
    }
    var space_size = 5;
    width = space_size + width;//a element's width.
    
    var div = Math.round(term.conf.cols/width);
    var config = '%c(@lightgrey)';
    var file_in_line = '';
    var cnt = 0;
    for (var i = filenames.length - 1; i >= 0; i--) {
        var space = width - filenames[i].length;
        var file = filenames[i];
        for(; space != 0; space--)
            file = file + ' ';
        file_in_line = file + file_in_line;
        //debugger;
        cnt ++;
        if (cnt >= div){
            term.write(config+file_in_line+'%n');
            cnt = 1;
            file_in_line = '';
        }
    }
    if(cnt!=0)
        term.write(config+file_in_line);
}

function listLongFormat (term, filename, filenames) {
    var config = '%c(@lightgrey)';
    var longformat = '-rw-r--r--   1 root  shellvon   ';
    if (typeof filename!='undefined') {
        if (getIndexOf(filenames,filename) != -1) {
            term.write(config+longformat+filename);
        }else{
            term.write(config+filename+': No such file or directory.');
        }
    }else{
        var showmore =  false;
        var filelist = []
        for (var i = filenames.length - 1; i >= 0; i--) {
            var file = filenames[i];
            var longname = config+longformat+file; 
            filelist.push(longname);
        }
        if (filelist.length > term.conf.rows-2) {
            showmore = true;
        }
        term.write(filelist,showmore);
    }
}

function helpCommand (term) {
    term.write(helpPage);
}

function lsCommand (term) {
    var argv = term.argv;
    var config = '%c(@lightgrey)';
    if(argv.length == 1){
        list(term,filenames);//list all files.
    }else if(argv[1] == '-l'){
        //list all files and dirs with long format
        listLongFormat(term, argv[2], filenames);
    }else if(argv.length==2){
        filename = argv[1];
        if(getIndexOf(filenames,filename)==-1){
            term.write(config+filename+': No such file or directory.')
        }
        else{
            term.write(filename); //just output the filename.
        }
    }else{
        term.write(config+' Usage: ls <filename>.');
    }
}

function catCommand (term) {
   display('cat', term); 
}

function moreCommand (term) {
    //term.write('%c(@lightgrey) more: Not Implements yet.')
    display('more', term);
}

function display (cmd, term) {
    var argv = term.argv;
    var config = '%c(@lightgrey)'
    if(argv.length == 1){
        term.write(config+'usage:'+cmd+' <file>');
    }else{
        var filename = term.argv[1];
        var index = getIndexOf(filenames,filename);
        if(index==-1){
            term.write(config+filename+': No such file or directory.');
        }else{
            fullname = getFullPath(filename);
            if(cmd=='more'){
                ajax(fullname,showContentWithMore);
            }
            else if(cmd=='cat'){
                ajax(fullname,showContent);
            }
        }
    }
}
function infoCommand (term) {
    var info = [
        'More details see:%+ahttp://www.masswerk.at/termlib/readme.txt%-a',
        'TODO:tabComplete && dirs and fixed cat\'s bug.'
    ];
    term.write(info);
}

function clearCommand (term) {
    term.clear();
}

function resumeCommand (term) {
    if(term.argv.length!=1){
        term.write(config+'usage: resume');
    }
    term.write(config+' resume: Not Implements yet. i am sorry.');
    //window.location="gui/resume.html";
}

function historyCommand (term) {
    term.write(term.history);
}

function tabComplete (term) {
    //TODO
}

/**
 * http://www.masswerk.at/termlib/sample_invaders.html
 */
function invadersGameCommand(term) {
    if ( TermlibInvaders.start(term) ) {
        return;
    }
    else {
        // oops, terminal doesn't meet the requirements
        this.write('Sorry, invaders failed.');
    }
}
function termOpen () {
    if (!term) {
        //See:http://www.masswerk.at/termlib/readme.txt
        //2.1 Configuration Values
        term = new Terminal({
            x: 10,
            y: 10,
            //divDiv:'termDiv',
            bgColor:'#131411',
            frameWidth: 0,
            cols:80,
            rows:24,
            crsrBlinkMode: true,
            historyUnique: true,
            ps:'λ ~/ ',
            greeting:'hello world',
            initHandler:termInitHandler,
            ctrlHandler: termControlHandler,
            handler: termCommandHandler,
        });
        if (term) {
            term.open();
        }
    } else if(term.closed) {
        term.open();
    } else {
        term.focus();
    }
}

function getXHRObj () {
    var xmlHttp = null;
    if (typeof XMLHttpRequest != 'undefined') {
        xmlHttp = new XMLHttpRequest();
    }
    if (!xmlHttp) { // IE 6/5
        var xhttperr;
        try {
            xmlHttp  = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(xhttperr) {
            try {
                xmlHttp  = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(xhttperr) {
                xmlHttp  = null;
            }
        }
    }
    return xmlHttp;
}

function ajax (url,callback) {
    var xmlHttp = getXHRObj();
    if(xmlHttp){
        try {
            xmlHttp.open('GET', url, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if(xmlHttp.status == 200)
                        callback(xmlHttp.responseText);
                    else
                        callback(url+': No such file or directory.');
                }
            };
            xmlHttp.send(null);
        } catch(e) {
            alert('NetWork errors');
        }
    }else{
        callback('Error,Your brower do not support XHR object');
    }
}

function showContent (content) {
    term.write(content);//the term is globals
    term.prompt();
}
function showContentWithMore (content) {
    term.clear();
    term.write(content,true);
}
function getFullPath (filename){
    return fname_tree[filename]
}