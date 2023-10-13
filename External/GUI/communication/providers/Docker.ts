/**
 * 이 파일은 Agent가 User에게 제공하는 Provider이다
 */
import Dockerode from "dockerode";
import {CodeLanguage, CommandReply, IDocker} from "../controllers/IDocker";
import {DefaultExecCreateOption, DefaultExecStartOption} from "../global/Dockerode-settings"
import internal from "stream"
import { PassThrough } from 'stream';
const path = require("path");
import {exec, spawn} from "child_process";
import { appendFileSync } from "fs"
import * as ts from "typescript";

function getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

function printStatus(mode:boolean):void{
    if(mode){
        console.log("\t└✅성공");
    }else{
        console.log("\t└❌실패");
    }
}

/**
 * cmd가 docker로 시작하는 명령어인지 확인(for 이상한 명령실행 금지)
 * @returns docker명령이라면 docker 이후 인자들을 띄어쓰기 기준으로 나눈 string[]
 * 아니라면 null반환
 */
function isCmdDocker(cmd: string):null|string[]{
    if(!cmd.startsWith("docker")){
        return null;
    }
    return cmd.split(" ").splice(1); 
}

let FILEPATH = "./received.txt";
function saveCmdToFile(inputCmd:string){
    try {
        appendFileSync(FILEPATH, inputCmd + '\n');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
}




export class DockerProvider implements IDocker{
    private docker_:Dockerode;
    private container_?:Dockerode.Container | null;
    private containerOptions_?:Dockerode.ContainerCreateOptions;
    private image_?:string;
    private bindedVolumePath = path.dirname(path.dirname(__filename))+`/bindedVolume`;
    public constructor(){
        this.docker_ = new Dockerode({host:"localhost", port:2375});
    }
    saveText(text: string): void {
        throw new Error("Method not implemented.");
    }
    
    public async pullImage(image: string): Promise<void>{
        this.image_ = image;
        console.log(`[RFC][${getCurrentTime()}]이미지 다운 명령 ${image}`);
        const stream = await this.docker_.pull(image);
        return new Promise((resolve, reject) => {
            this.docker_.modem.followProgress(stream, (err: Error | null) => {
                if (err) {
                    printStatus(false);
                    reject(err);
                } else {
                    printStatus(true);
                    resolve();
                }
            });
        });
    }
    public async createContainer(image: string, cmd?: string[]): Promise<void> {
        console.log(`[RFC][${getCurrentTime()}]컨테이너 생성 명령`);
        this.containerOptions_ = {
            Image: image,
            name: "CreatedContainerBydockerode",
            Cmd: cmd,
            ExposedPorts: {
                '8888/tcp': {},
            },
            HostConfig:{
                PortBindings: {
                    '8888/tcp': [
                        {
                        HostPort: '8888',
                        },
                    ],
                },
                Binds:[
                    `${this.bindedVolumePath}:/home/jovyan`
                ],
                RestartPolicy: { Name: 'always' }
            },
            Env: ['JUPYTER_ENABLE_LAB=yes'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            OpenStdin: true,
        };
        
        try{
            this.container_ = await this.docker_.createContainer(this.containerOptions_);
            printStatus(true);
        }catch(err:any){
            printStatus(false);

            //이미 존재하는 컨테이너 에러시, 해당 컨테이너를 this.container_로 등록(이후 startContainer()를 쓸수있도록)
            if(err.statusCode === 409){
                console.log(this.container_?.id)
                function extractContainerId(errorMessage:any) {
                    const match = errorMessage.match(/"([a-f0-9]{64})"/);
                    return match ? match[1] : null;
                }
                this.container_ = this.docker_.getContainer(extractContainerId(err.json.message));
                //console.log("뽑아온 컨테이너 id", this.container_.id);
            }
            throw err;
        }
    }
    public async startContainer() {
        console.log(`[RFC][${getCurrentTime()}]컨테이너 시작 명령`);
        try{
            await this.container_?.start();
            printStatus(true);
        }catch(err:any){
            printStatus(false);
            throw err;
        }
    }
    public async stopContainer() {
        console.log(`[RFC][${getCurrentTime()}]컨테이너 중지 명령`);
        try{
            await this.container_?.stop();
            printStatus(true);
        }catch(err:any){
            printStatus(false);
            throw err;
        }
    }
    public async sendCommandToContainer(cmd: string[]): Promise<CommandReply> {
        console.log(`[RFC][${getCurrentTime()}]컨테이너로 커맨드 송신 명령`);

        let nowExecCreateOption:Dockerode.ExecCreateOptions = {
            //정의한 DefaultOption을 복사
            ...DefaultExecCreateOption,
            Cmd: cmd,
        }
        let nowExecStartOption:Dockerode.ExecStartOptions = {
            //정의한 DefaultOption을 복사
            ...DefaultExecStartOption,
        }

        let exec: Dockerode.Exec | undefined;
        let stream:internal.Duplex | undefined;
        try{
            exec = await this.container_?.exec(nowExecCreateOption);
            stream = await exec?.start(nowExecStartOption)
        }catch(err:any){
            //nodejs -> 컨테이너 명령어 전송 에러
            printStatus(false);
            throw err;
        }
        
        //간이 stdout, stderr 스트림 생성
        let stdoutStream = new PassThrough();
        let stderrStream = new PassThrough();
        this.container_?.modem.demuxStream(stream, stdoutStream, stderrStream);
        let stdoutData:string[] = [];
        let stderrData:string[] = [];
        //각 스트림마다 'data'이벤트(출력생성 및 전달됨)이 생기면 data변수에 저장
        stdoutStream.on('data', (chunk) => {
            stdoutData.push(chunk.toString());
        });
     
        stderrStream.on('data', (chunk) => {
            stderrData.push(chunk.toString());
        });
        
        let commandReply: CommandReply={
            ExitCode: undefined,
            stdoutData: [],
            stderrData: []
        };

        let commandPromise: Promise<CommandReply> = new Promise((resolve, reject) => {
            stream?.on('end', async (chunk:any)=>{
                try{
                    let inspectData: Dockerode.ExecInspectInfo | undefined = await exec?.inspect();
                    commandReply.ExitCode = inspectData?.ExitCode;
                    commandReply.stdoutData = stdoutData;
                    commandReply.stderrData = stderrData;
                    
                    console.log(commandReply);

                    resolve(commandReply);
                }catch(err){
                     //컨테이너 내부 명령 실행중에 에러(컨테이너문제)
                     printStatus(false);
                     reject(err);
                }
            })
        });
        printStatus(true);
        return await commandPromise;
    }
    public async execToContainer(cmd: string[]): Promise<CommandReply> {
        console.log(`[RFC][${getCurrentTime()}]컨테이너로 exec 명령\n(명령프로세스가 끝나기까지 stdin은 프로세스로 연결되고, stdout은 프로세스의 stdout으로 대체됩니다.)`);

        let nowExecCreateOption:Dockerode.ExecCreateOptions = {
            //정의한 DefaultOption을 복사
            ...DefaultExecCreateOption,
            Cmd: cmd,
        }
        let nowExecStartOption:Dockerode.ExecStartOptions = {
            //정의한 DefaultOption을 복사
            ...DefaultExecStartOption,
        }
        let commandReply: CommandReply={
            ExitCode: undefined,
            stdoutData: [],
            stderrData: []
        };
        
        try{
            let exec = await this.container_?.exec(nowExecCreateOption);
            let streamFromContainer = await exec?.start(nowExecStartOption);
            
            if(exec === undefined || exec === null || streamFromContainer === undefined || streamFromContainer === null){
                throw new Error("exec() or start() is failed.");
            }

            printStatus(true);

            //간이 stdout, stderr 스트림 생성 for 컨테이너의 stdout, stderr 로그 저장
            let stdoutStream = new PassThrough();
            let stderrStream = new PassThrough();
            this.container_?.modem.demuxStream(streamFromContainer, stdoutStream, stderrStream);
            stdoutStream.on("data", (chunk)=>{
                commandReply.stdoutData.push(chunk.toString());
            });
            stderrStream.on("data", (chunk)=>{
                commandReply.stderrData.push(chunk.toString());
            });
            //stdin을 stream(컨테이너의 스트림객체)에 연결
            process.stdin.pipe(streamFromContainer);
            //stream에서 어떤 출력이 있으면 stdout에 출력해 현재 쉘이 컨테이너의 쉘인것 같은 경험제공
            streamFromContainer.on("data", (chunk)=>{
                process.stdout.write(chunk.toString());
            })
            //컨테이너 내부 프로세스가 끝나면 stream은 end이벤트를 발생시킨다. 이를 이용해 만든 stream을 end
            streamFromContainer.on("end", async(chunk:any)=>{
                let inspectData: Dockerode.ExecInspectInfo | undefined = await exec?.inspect();
                commandReply.ExitCode = inspectData?.ExitCode;
                streamFromContainer?.end();
            })
        }catch(err:any){
            printStatus(false);
            throw err;
        }

        return new Promise((resolve, reject) => {
            process.stdin.on("end", ()=>{
                console.log("\t[exec🔚] 컨테이너 내부 프로세스 종료");
                resolve(commandReply);
            });
        });
    }
    public uploadAtBindedMount() {
        throw new Error("Method not implemented.");
    }
    public downloadAtBindedMount() {
        throw new Error("Method not implemented.");
    }

    public async sendCommandToTerminal(cmd: string): Promise<CommandReply> {
        console.log(`[RFC][${getCurrentTime()}]터미널에게 커맨드 송신 명령`);

        let commandReply: CommandReply={
            ExitCode: undefined,
            stdoutData: [],
            stderrData: []
        }

        let arg = isCmdDocker(cmd);

        let commandPromise = new Promise<CommandReply>((resolve, reject)=>{
            //docker명령어가 아니라면 이상한 명령으로 취급

            try{
                if(arg === null){
                    throw (new Error("recevied Suspicious Command from UserNode"));
                }
                const process_spawned = spawn("docker", arg!);

                process_spawned.stdout.on("data", (chunk)=>{
                    commandReply.stdoutData.push(chunk.toString());
                });
                process_spawned.stderr.on("data", (chunk)=>{
                    commandReply.stderrData.push(chunk.toString());
                });
                
                process_spawned.on('close', (code, signal)=>{
                    commandReply.ExitCode = code;
                    resolve(commandReply);
                });
                printStatus(true);
                
                //명령을 파일로 따로 저장
                saveCmdToFile('[cmd] ' + `[${getCurrentTime()}] ` + cmd);
                
            }catch(err){
                reject(err);
                printStatus(false);
            }
        })

        return await commandPromise;
    }
    
    public sendSourceCode(which_language: CodeLanguage, code: string) : void{
        console.log(`[RFC][${getCurrentTime()}]UserNode에게 온 코드 실행 명령`);
        console.log(`  다음과 같은 코드 실행\n${code}`);
         //명령을 파일로 따로 저장
        saveCmdToFile('[code] ' + `[${getCurrentTime()}] ` + code);
        let output: string | undefined;
        let interpret_program: ts.Program | undefined;
        try{
            if(which_language === CodeLanguage.TypeScript){
                interpret_program = ts.createProgram({
                    rootNames: ["module.ts"],
                    options: {},
                    host: {
                        ...ts.createCompilerHost({}),
                        getSourceFile: (fileName) => fileName === "module.ts" ? ts.createSourceFile(fileName, code, ts.ScriptTarget.ES2015) : undefined,
                        writeFile: (fileName, text) => {
                            if(fileName === "module.js"){
                                output = text;
                            }
                        }
                    }
                });
                interpret_program.emit();
                if(!output){
                    throw new Error(`${which_language} interpret Error`);
                }
                eval(output);
                printStatus(true);
            }else{
                throw new Error("Language except TypeScript is not implemented.");
            }
            
        }catch(reason:any){
            printStatus(false);
            throw reason;
        }
    }
}