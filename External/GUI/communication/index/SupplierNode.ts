import { WebAcceptor } from "tgrid/protocols/web/WebAcceptor";
import { WebServer } from "tgrid/protocols/web/WebServer";
import { DockerProvider } from "../providers/Docker";
import { PORT_TGRID } from "../global/Dockerode-config"
async function main():Promise<void>{
    let server: WebServer<Headers, DockerProvider> = new WebServer<Headers, DockerProvider>();
    await server.open(PORT_TGRID, async (acceptor:WebAcceptor<Headers, DockerProvider>)=>{
        let provider: DockerProvider = new DockerProvider();
        await acceptor.accept(provider); 
    });
}
main();