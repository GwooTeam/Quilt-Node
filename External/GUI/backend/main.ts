import { app, BrowserView, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { DockerProvider } from "../communication/providers/Docker"
import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";
import { CommandReply, IDocker } from "../communication/controllers/IDocker";
import {Spinner} from "cli-spinner";
import { IMAGE_NAME, SERVER_IP, PORT_TGRID }from "../communication/global/Dockerode-config"

const mainWindowOption:Electron.BrowserWindowConstructorOptions ={
    height : 600,
    webPreferences:{
        //preload: path.join(__dirname, "preload.js"),
        nodeIntegration:true,
        contextIsolation:false,
    },
    width: 800,
};

function createWindow():BrowserWindow{
    const mainWindow = new BrowserWindow(mainWindowOption);

    //#####
    mainWindow.webContents.openDevTools();

    //load the index.html of the app
    mainWindow.loadFile(path.join(__dirname, "../../frontend/tempIndex.html"));
    return mainWindow;
}

function assignEvents(dock: Driver<IDocker>){
    let name_functions:string[] = fetchProvidersFromDockerode();
    //renderer가 함수이름을 요청함 : request-functions
    ipcMain.on("request-functions", (event)=>{
        console.log("#############"+name_functions);
        //renderer에게 함수이름을 보냄 : reply-functions
        event.reply("reply-functions", name_functions);
    });

    //특정버튼이 클릭돼 renderer가 함수 기능 실행을 요청함 : call-function
    ipcMain.on("call-function", async (event, name_caller_Button)=>{
        //함수 실행
        await (dock[name_caller_Button] as Function)();
    })
}

/**
 * 특정 파일안의 export 함수의 이름들을 가져옴
 * @param file_path 이 파일안의 export 함수를 가져옴
 */
function fetchProvidersFromDockerode(): string[]{
    const dockerProvider = new DockerProvider();
    let name_functions:string[] = [];
    name_functions = Object.getOwnPropertyNames(DockerProvider.prototype);
    //가져온 프로퍼티에서 `constructor`은 제거
    for(var i=0; i<name_functions.length; i++){
        if(name_functions[i] === "constructor"){
            name_functions.splice(i, 1);
            break;
        }
    }
    return name_functions;
}

function setSendingStdoutToHTML(mainWindow:BrowserWindow){
    const originalWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk) =>{
        //main이 stdout(터미널의 출력)을 log창에 띄우기 위해 보내옴 : `stdout`
        mainWindow.webContents.send('stdout', chunk.toString());
        originalWrite(chunk);
        return true;
    };
}

async function main(){
    /*
    let loading = new Spinner("TGRID 초기 설정 중");
    loading.start();
    let dockerProvider = new DockerProvider();
    let connector: WebConnector<null, DockerProvider> = new WebConnector(null, dockerProvider);
    await connector.connect(`ws://${SERVER_IP}:${PORT_TGRID}`);
    loading.stop(true);

    let dock: Driver<IDocker> = connector.getDriver<IDocker>();
    let image:string = IMAGE_NAME;
    console.log("TGRID is opend. now creat new Window soon.")
    assignEvents(dock);
    */
    await app.whenReady();
    let mainWindow = createWindow();

    //setSendingStdoutToHTML(mainWindow);

    app.on("window-all-closed", () => {
        if(process.platform !== "darwin") {
            app.quit();
        }
    });
}
main();