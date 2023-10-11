import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";
import { CommandReply, IDocker } from "../controllers/IDocker";
import { DockerProvider } from "../providers/Docker";
import {Spinner} from "cli-spinner";
import { IMAGE_NAME, SERVER_IP, PORT_TGRID }from "../global/Dockerode-config"
async function main(): Promise<void>
{
    //----
    // CONNECTION
    //----
    let connector: WebConnector<null, DockerProvider> = new WebConnector(null, new DockerProvider());
    await connector.connect(`ws://${SERVER_IP}:${PORT_TGRID}`);

    //----
    // CALL REMOTE FUNCTIONS
    //----
    // GET DRIVER
    let dock: Driver<IDocker> = connector.getDriver<IDocker>();
    let image:string = IMAGE_NAME;
    
    /**
     * 아래는 Provider는 사용하는 예시입니다.
     * 아래 예시들같이 Provider함수들을 쓸땐, 모두 try{}catch(){}형식으로 하는 것이 좋다.
     * 원격함수가 에러가 날수있기때문이다
     * 그리고 loading은 로딩효과 문장을 위한 라이브러리. 그래서 안써도됨
     * start하면 Spinner("문장")의 문장이 출력되고, 삥글삥글돈다
     * stop(true)하면 삥글 + 문장이 아에 한줄이 사라진다
     * stop(false)하면 멈춘삥글 + 문장 이렇게 문장이 남아있다
     * 아래 코드는 성공하면 사라지고, 에러가 났을때에만 문장을 남겨서 어떤 명령에서 에러가 났는지 파악하도록 만들었다
     */
    /*
    //pullImage()작동확인코드
    {
        let loading = new Spinner("이미지 다운 중");
        loading.start();
        try{
            await dock.pullImage(image);
        }catch(err:any){
            loading.stop(false);
            console.log(err);
        }
        loading.stop(true);
    }

    //createContainer()작동확인코드
    {
        let loading = new Spinner("컨테이너 생성 중");
        loading.start();
        try{
            await dock.createContainer(image);
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
        loading.stop(true);
    }

    //startContainer()작동확인코드
    {
        let loading = new Spinner("컨테이너 시작 중");
        loading.start();
        try{
            await dock.startContainer();
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
        loading.stop(true);
    }

    //stopContainer()작동확인코드
    {
        let loading = new Spinner("컨테이너 중지 중");
        loading.start();
        try{
            await dock.stopContainer();
        }catch(err:any){
            loading.stop(false);
            console.error(err.json ?? "Non json 에러");
        }
        loading.stop(true);
    }

    //sendCommandToContainer()작동확인코드
    for( let cmd of [["ls", `/path/to/nonexistent/directory`], [`echo`, `-e`, `Line 1\nLine 2\nLine 3`], [`bash`, `-c`, `'exit 7'`], [`sudo`, `cat`, `/etc/shadow`]])
    {
        let commandReply: CommandReply;
        let loading = new Spinner("컨테이너에게 명령어 전달 중");
        loading.start();
        try{
            commandReply = await dock.sendCommandToContainer(cmd);
            loading.stop(true);
            console.log(commandReply);
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
    }

    //execToContainer()작동확인코드
    for( let cmd of [["sudo", "mkdir", "testDir"], ["123123"]])
    {
        let commandReply: CommandReply;
        let loading = new Spinner("컨테이너에게 exec()하는 중");
        loading.start();
        let a = process.stdin;
        let b = process.stdout;
        try{
            commandReply = await dock.execToContainer(cmd);
            loading.stop(true);
            console.log(commandReply);
        }catch(err:any){
            loading.stop(false);
            console.error(err);
        }
    }
    */
    let cmds = ["ls -al", "docker run ubuntu"]
    for(let cmd of cmds){
        let commandReply:CommandReply;
        let loading = new Spinner("SupplierNode에게 명령어 전달 중");
        loading.start();
        try{
            commandReply = await dock.sendCommandToTerminal(cmd);
            loading.stop(true);
            console.log(commandReply);
        }catch(reason:any){
            loading.stop(false);
            console.error(reason);
        }
    }
    //----
    // TERMINATE
    //----
    await connector.close();
}
main();