import { WebConnector } from "tgrid/protocols/web/WebConnector";
import { Driver } from "tgrid/components/Driver";
import { CodeLanguage, CommandReply, IDocker } from "../controllers/IDocker";
import { DockerProvider } from "../providers/Docker";
import {Spinner} from "cli-spinner";
import { IMAGE_NAME, SERVER_IP, PORT_TGRID }from "../global/Dockerode-config"

import readline from 'readline';

const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
    
    async function UserInput(dock: Driver<IDocker>) {
        rl.question('Enter command in JSON format: ', async (input) => {
                // 사용자 입력값 그대로 출력
                console.log(`You entered: ${input}`);
    
                // "exit" 입력 시 무한루프 탈출
                if (input.trim().toLowerCase() === 'exit') {
                    return rl.close();
                }
    
                let obj;
                
                // JSON 파싱 시도
                try {
                    obj = JSON.parse(input);
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                    return UserInput(dock);  // 오류가 발생하면 다시 입력받기
                }
                // cmd key 확인
                if (obj.hasOwnProperty('cmd')) {
                    await dock.sendCommandToTerminal(obj['cmd']);
                    //console.log('sendCommandToTerminal function is executing...');
                        
                    // code key 확인   
                } else if (obj.hasOwnProperty('code')) {
                    await dock.sendSourceCode(CodeLanguage.TypeScript ,obj['code']);
                    //console.log('sendSourceCode function is executing...');
                        
                // 그 외 경우   
                } else {
                    console.error('Invalid command');
                }
                return UserInput(dock);  // 명령어를 처리한 후 다시 입력받기
            }
        );
    }

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
*/

    UserInput(dock);

    //----
    // TERMINATE
    //----
    await connector.close();
}
main();