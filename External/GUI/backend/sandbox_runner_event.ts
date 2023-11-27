import { ipcMain } from "electron";
import { ChildProcessWithoutNullStreams, spawn } from "child_process"
import path from "path";

export class SandboxRunner{
    public isRunning:boolean;
    private pathOfMain:string;
    private verbose?:boolean;
    private childProcess?:ChildProcessWithoutNullStreams;
    private assignEvents_sandboxRunner(){
        ipcMain.on("sandbox_runner_trigger", (event)=>{
            console.log("[MSA]Sandbox Runner trigger received from ipcRenderer");
            const result_sandbox_runner = this.start();
            event.reply("sandbox_runner_trigger_reply", result_sandbox_runner);
        });
    }
    constructor(verbose?:boolean){
        this.isRunning = false;
        this.assignEvents_sandboxRunner()
        this.pathOfMain = path.join(__dirname, "..", "..", "..", "Sandbox", "Runner", `main.py`);
        this.verbose = verbose;
        if(this.verbose){
            console.log(`[SR] SR이 등록되었습니다. start()을 이용해 SR을 start할수있습니다. SR의 main.py경로는 ${this.pathOfMain}으로 설정되어있습니다.`);
        }
    }
    public start(): boolean{
        if(this.isRunning){
            if(this.verbose) console.log(`[SR][ERR] SR이 이미 start되고있습니다. 명령한 start는 무시됩니다.`);
            return false;
        }
        this.childProcess = spawn("python", [this.pathOfMain]);
        this.isRunning = true;
        this.childProcess.stdout.on("data", (data)=>{
            if(this.verbose) console.log(`[SR][stdout] ${data.toString()}`);
        });
    
        this.childProcess.on('close', (code) => {
            if(this.verbose) console.log(`[SR] 자식 프로세스가 코드 ${code}로 종료되었습니다.`);
            this.isRunning = false;
        });
        return true;
    }
}

function run_sandboxRunner(){
    //Sandbox Runner의 main.py위치를 맞춰야함
    console.log(path.join(__dirname, "..", "..", "Sandbox", "Runner", `main.py`));
    const sandbox_runner = spawn("python", [path.join(__dirname, "..", "..", "..", "Sandbox", "Runner", `main.py`)]);
    sandbox_runner.stdout.on("data", (data)=>{
        console.log(`[SandboxRunner] ${data.toString()}`);
    });

    sandbox_runner.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    return "실행시킴";
}
