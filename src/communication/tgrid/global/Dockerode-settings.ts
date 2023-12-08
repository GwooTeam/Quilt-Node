import Dockerode from 'dockerode'
/**
 * Dockerode.ExecCreateOptions 파라미터 소개
 * @param AttachStdin: 이 값이 true로 설정되면, 명령어 실행 시 표준 입력(stdin) 스트림에 연결됩니다. 즉, 호스트 시스템에서 컨테이너로 데이터를 전송할 수 있게 됩니다.
 * @param AttachStdout: 이 값이 true로 설정되면, 명령어 실행 시 표준 출력(stdout) 스트림에 연결됩니다. 즉, 컨테이너에서 호스트 시스템으로 데이터를 전송할 수 있게 됩니다.
 * @param AttachStderr: 이 값이 true로 설정되면, 명령어 실행 시 표준 에러(stderr) 스트림에 연결됩니다. 즉, 컨테이너에서 발생하는 에러 메시지를 호스트 시스템으로 전송할 수 있게 됩니다.
 * @param DetachKeys: 이 값을 사용하면 특정 키 조합을 눌러서 컨테이너에서 분리(detach) 할 수 있는 방법을 지정할 수 있습니다.
 * @param Tty: 이 값이 true로 설정되면 가상 터미널(tty)가 할당됩니다. 일반적으로 대화형 애플리케이션에서 사용합니다.
 * @param Env: 환경 변수를 지정하는 문자열 배열입니다. 각 항목은 'KEY=VALUE' 형태의 문자열입니다.
 * @param Cmd: 컨테이너 내부에서 실행하고자 하는 명령을 지정하는 문자열 배열입니다.
 * @param Privileged: 이 값이 true인 경우, 해당 컨테이너는 권한있는(privileged) 모드로 동작하며 컨테이너가 호스트 머신의 리소스에 직접 접근 가능해집니다. 보안 상 문제가 발생할 수 있으므로 주의해서 사용해야 합니다.
 * @param User: 해당 명령을 실행할 유저를 지정합니다. root나 다른 유저 이름 등으로 지정 가능합니다.
 * @param WorkingDir: 해당 명령어가 실행될 작업 디렉터리(working directory)를 지정합니다.
 * @param abortSignal: AbortController 인스턴스에서 생성된 AbortSignal 객체입니다. 이를 통해 실행 중인 작업을 취소할 수 있습니다.
 */
export const DefaultExecCreateOption: Dockerode.ExecCreateOptions = {
    AttachStdin:true,
    AttachStderr:true,
    AttachStdout:true,
    Privileged:false,
}

/**
 * Dockerode.ExecStartOptions 파라미터 소개
 *@param hijack: 이 프로퍼티는 docker-modem에서 사용되며, HTTP 연결을 하이재킹(즉, 연결을 인터셉트하고 데이터를 전송)할지 여부를 결정합니다. 보통 Docker 컨테이너와의 스트림 통신에 사용됩니다.
 *Docker-modem은 Docker Remote API와 통신하기 위한 Node.js 라이브러리입니다. Docker daemon과의 HTTP(S) 통신을 담당하며, 요청 및 응답 처리, 스트림 처리 등의 기능을 제공합니다.
 *hijack 프로퍼티는 docker-modem에서 사용되며, HTTP 연결을 "하이재킹"하는 것에 관련된 옵션입니다. "하이재킹"이란 원래의 연결을 인터셉트(가로채기)하여 새로운 데이터를 주고받는 것을 의미합니다.
 *일반적으로 HTTP 요청은 클라이언트가 서버에게 요청을 보내고, 서버가 응답을 반환하는 단방향 통신입니다. 그러나 Docker와 같은 경우에는 이런 패턴만으로는 충분하지 않습니다. 예를 들어, 컨테이너에서 실행되는 명령어의 출력 결과를 실시간으로 클라이언트에게 전송해야 하는 경우가 있습니다.
 *그래서 docker-modem은 이런 상황에서 HTTP 연결을 하이재크하여 양방향 스트림 통신을 가능하게 합니다. hijack 옵션이 true로 설정되면, docker-modem은 해당 연결에 대해 양방향 데이터 전송(즉, 클라이언트와 서버 모두에서 데이터를 전송할 수 있는)능력을 활성화합니다.
 *따라서 hijack 프로퍼티는 Docker 컨테이너와의 실시간 상호작용 기능 활성화 여부를 제어하는 역할을 합니다.
 *@param stdin: 이 프로퍼티도 docker-modem에서 사용되며, 표준 입력(stdin) 스트림에 데이터를 전송할지 여부를 결정합니다.
 *@param Detach: 이 프로퍼티는 Docker API에서 사용되며, 명령 실행 후에 즉시 분리(detach)할지 여부를 결정합니다. 만약 true라면, 명령이 실행된 후에도 컨트롤이 즉시 반환됩니다.
 *@param Tty: 이 프로퍼닰는 Docker API에서 사용되며, 가상 터미널(TTY)을 할당할지 여부를 결정합니다. 대화형 애플리케이션에서 주로 사용됩니다.
 *@param abortSignal: 진행 중인 작업을 취소하기 위한 신호입니다. AbortController 객체의 signal 속성으로 생성할 수 있습니다.
 *ExecCreateOptions와 비교하면 두 인터페이스 모두 Docker 컨트롤 API와 관련된 옵션들을 정의하지만 다른 종류의 작업들에 대해 다룹니다.
 *ExecCreateOptions는 exec 인스턴스 생성 시 필요한 옵션들을 담고 있으며, 그 반면 ExecStartOptions은 이미 생성된 exec 인스턴스를 시작하는 데 필요한 옵션들을 담고 있습니다.
 *딱 정확하게 말하자면, ExecCreateOptions은 주어진 명령어가 어떻게 동작해야 하는지 설정하는 것과 관련있고,
 *ExecStartOptions은 실제 실행 환경과 관련있습니다 (예: hijack 혹은 stdin으로 스트림 통신 등)
 */
export const DefaultExecStartOption: Dockerode.ExecStartOptions = {
    hijack: true,
    stdin: true,
}
