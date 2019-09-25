const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const { exec } = require('child_process');
const path = require('path');
const url = require('url');
var fs = require('fs');
let heap;//for setting unique id to tasks
heap=0;
let add_vid;
process.env.NODE_ENV = 'production';
const mainMenuTemplate=[
  {
    label: 'dev',
    submenu:[
      {
        label: 'toggle',
        accelerator: 'Ctrl+D',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  }
];
//main window handle
app.on('ready', function(){

 //index.html
  index = new BrowserWindow({
    backgroundColor: '#0e0e10',
    width: 1200,
     height: 540,
     frame: false,
     maxHeight: 690,
    webPreferences: {
    nodeIntegration: true
  }
  });
  index.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol:'file',
    slashes: true
  }));
//dev tools
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);
//exit gracefuly
index.on('close',function(){
  console.log('shutting off');
  app.quit();
});
});
//open add vid window
ipcMain.on('open:addvid',function(e){
  //add-vid.html
  //set it up
   add_vid = new BrowserWindow({
     backgroundColor: '#0e0e10',
     width: 420,
      height: 290,
      frame: false,
      maxHeight: 690,
     webPreferences: {
     nodeIntegration: true
   }
   });
   //load it
   add_vid.loadURL(url.format({
     pathname: path.join(__dirname,'add-vid.html'),
     protocol:'file',
     slashes: true
   }));
});
ipcMain.on('addvid:exit',function(e){
console.log('close addvid');
add_vid.close();
add_vid=null;
});
ipcMain.on('addvid:minimize',function(e){
add_vid.minimize();
});
//handle new task form data
ipcMain.on('form:data',function(e,data){
  var id = heap;
  heap++;
index.webContents.send('task:add',{name:'>> Reading Name <<',url: data.url,format: data.format,id: id,status: 'Added'});
run_cmd(-1,'temp/youtube-dl',['-e',data.url],function(output){
  index.webContents.send('ytdl:name',{name:output,id:id});
  var arguments=['--ffmpeg-location','temp',
    '-x',
    '--audio-format',data.format,
    '--audio-quality','0',
    data.url
  ];
  if (data.mode=='video') {
    arguments=['--ffmpeg-location','temp',
      '-f',data.format,
      data.url
    ];
  }
  run_cmd(id,'temp/youtube-dl',arguments,function(output){
    index.webContents.send('ytdl:completed',{id:id});
  });


});
});
//exit app
ipcMain.on('app:exit',function(e){
console.log('exit');
index.close();
});
ipcMain.on('app:minimize',function(e){
index.minimize();
});



function run_cmd(id,cmd, args, callBack) {
    var spawn = require('child_process').spawn;
        child = spawn(cmd, args);
        var output = "";
    child.stdout.on('data', function (data) {
      //console.log(data.toString());
      if (id!=-1) {
        var arr = data.toString().split(' ');
        var filtered = arr.filter(Boolean);
        if (filtered[1].endsWith("%")) {
          console.log(filtered[1]);
          index.webContents.send('ytdl:progress',{id:id,prog:filtered[1]});
        }
        if(filtered[0]=='[ffmpeg]') {
          console.log('CONVERTING');
          index.webContents.send('ytdl:converting',{id:id});
          }
      }else {
        output += data.toString();
      }
     });
    child.stdout.on('end', function() {
       callBack (output);
     });
}
