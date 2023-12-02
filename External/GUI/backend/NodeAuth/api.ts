import axios from "axios";
import fs from "fs"

interface ServerURLPath{
    getServerPubKey: string;
    enrollNonce: string;
    verify: string;
}

interface NodeAuthConfig{
    SERVER_DOMAIN:string;
    SERVER_URL_PATH:ServerURLPath;
}

class NodeAuthAPI{
    nodeAuthConfig:NodeAuthConfig;
    constructor(){
        //현재 파일의 폴더경로는 External/GUI/dist/backend/NodeAuth이다. json은 .ts가 있는 dist바깥에 있다.
        //let config_string = fs.readFileSync("../../../backend/NodeAuth/config.json", "utf-8");
        let config_string = fs.readFileSync("./config.json", "utf-8");
        this.nodeAuthConfig = JSON.parse(config_string) as NodeAuthConfig;
        /*
            이곳은 필요시 나중에 세션or토큰 키 저장을 위한 공간
        */
    }
    public async requestServerPubKey(){
        const url = this.nodeAuthConfig.SERVER_DOMAIN + this.nodeAuthConfig.SERVER_URL_PATH.getServerPubKey;
        const data = {};
        try{
            const response = await axios.post(url, data);
            console.log("[API] requestServerPubKey Complete");
            console.log(response);
        }catch(error){
            console.error("[API] requestServerPubKey Error");
        }
    }
    public async enrollNonce(node_id:string){
        const url = this.nodeAuthConfig.SERVER_DOMAIN + this.nodeAuthConfig.SERVER_URL_PATH.enrollNonce.replace(`{id}`, node_id);
        const data = {};
        /*
          response에 온 값을 카이버 인크립션 해야함
        */
        try{
            const response = await axios.post(url, data);
            console.log(`[API] enrollNonce Complete`);
            console.log(response);
        }catch(error){
            console.error("[API] enrollNonce Error");
        }
    }
    public async verify(node_id:string, node_mac:string, node_sign:string, node_encrypt_pubkey:string, node_sign_pubkey:String, node_pubip:string){
        const url = this.nodeAuthConfig.SERVER_DOMAIN + this.nodeAuthConfig.SERVER_URL_PATH.verify.replace(`{id}`, node_id);
        const data = {
            "nodeMac": node_mac,
            "nodeSign": node_sign,
            "nodeEncryptPubK": node_encrypt_pubkey,
            "nodeSignPubK": node_sign_pubkey,
            "nodePublicIP": node_pubip
        };
        try{
            const response = await axios.post(url, data);
            console.log(`[API] verify Complete`);
            console.log(response);
        }catch(error){
            console.error("[API] verify Error");
        }
    }
}
const temp = new NodeAuthAPI();
temp.requestServerPubKey();
