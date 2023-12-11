const axios = require("axios");
const child_process = require("child_process");
const spawn = child_process.spawn;
const spawnSync = child_process.spawnSync;
const fs = require("fs");
const path = require("path");
const os = require("os");
const {WSL} = require("./wsl.js");

function isSuccessResponse(response){
    if(response.status<200 || response.status>=300){
        return false;
    }
    return true;
}

function byteCodeToString(byteCode) {
    let result = '';
  
    for (let i = 0; i < byteCode.length; i += 2) {
      let part = byteCode.slice(i, i + 2);
      let ascii = parseInt(part, 16);
      result += String.fromCharCode(ascii);
    }
  
    return result;
}

class NodeAuthAPI{
    node_auth_config;
    server_pubkey;
    debug;
    wsl;
    constructor(debug){
        //현재 파일의 폴더경로는 External/GUI/dist/backend/NodeAuth이다. json은 .ts가 있는 dist바깥에 있다.
        //let config_string = fs.readFileSync("../../../backend/NodeAuth/config.json", "utf-8");
        let config_string = fs.readFileSync(path.join(__dirname, "config.json"), "utf-8");
        this.wsl = new WSL(false);
        this.node_auth_config = JSON.parse(config_string);
        if (debug !== undefined){
            this.debug = debug;
        }
    }
    async requestMacKey(node_id){
        const url = `${this.node_auth_config.SERVER_DOMAIN}:${this.node_auth_config.SERVER_PORT}${this.node_auth_config.SERVER_URL_PATH.requestMacKey.replace("{id}", node_id)}`;
        const data = {};
        let response;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] requestMacKey Error ${error}`);
            throw error;
        }
        /** response body
        {
        "keyType": "SECRET_KEY",
        "keyAlgorithm": "MAC",
        "keyVal": "MAC키",
        "keyLength": 32
        } */
        if(this.debug)console.log(response);
        if(!isSuccessResponse(response)) throw new Error("[API] requestMacKey http Error");

        console.log("[API] requestServerPubKey Complete");
        return response.data.keyVal;
    }

    async requestServerPubKey(){
        const url = `${this.node_auth_config.SERVER_DOMAIN}:${this.node_auth_config.SERVER_PORT}${this.node_auth_config.SERVER_URL_PATH.getServerPubKey}`;
        const data = {};
        let response;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] requestServerPubKey Error ${error}`);
            throw error;
        }
        if(this.debug)console.log(response);
        if(!isSuccessResponse(response)) throw new Error("[API] requestServerPubkey http Error");

        console.log("[API] requestServerPubKey Complete");

        this.server_pubkey = response.data.keyVal;
        if(this.debug)console.log(`server_pubkey : ${this.server_pubkey}`);
        return this.server_pubkey;
    }

    async enrollNonce(node_id, kyber_encapsuled, session_key){
        const url = `${this.node_auth_config.SERVER_DOMAIN}:${this.node_auth_config.SERVER_PORT}${this.node_auth_config.SERVER_URL_PATH.enrollNonce.replace(`{id}`, node_id)}`;
        const data = {
            "capVal" : kyber_encapsuled
        };
        let response = null;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] enrollNonce Error ${error}`);
            throw error;
        }
        if(!isSuccessResponse(response)) throw new Error("[API] enrollNonce http Error");
        console.log(`[API] enrollNonce Complete`);
        if(this.debug)console.log(response);

        /**
         * 서버로부터 온 nonce는 사실 세션키로 암호화되어있고, 바이트코드로된 encrypted_nonce_byte_code이다.
         * 그래서 이를 session_key로 복호화해야하고 2글자씩 끊어서 아스키코드화해야한다.
         * nonce는 10자리 알파벳+숫자이다.
         */
        let encrypted_nonce_byte_code = response.data;
        let wsl_return;
        try{
            wsl_return = await this.wsl.KyberDecrypt(session_key, encrypted_nonce_byte_code.nonce);
        }catch(error){
            throw error;
        }
        //암호모듈반환값은 00000으로 패딩처리되어있으니 이후를 무시
        //let nonce_byte_code = wsl_return.split("dec=")[1].split("length=")[0];
        let nonce_byte_code = wsl_return.split("dec=")[1].split("00000")[0];
        let nonce = byteCodeToString(nonce_byte_code);
        return nonce;
    }
    async verify(node_id, mac, sign, pubks, pubke, node_pubip){
        const url = `${this.node_auth_config.SERVER_DOMAIN}:${this.node_auth_config.SERVER_PORT}${this.node_auth_config.SERVER_URL_PATH.verify.replace(`{id}`, node_id)}`;
        const data = {
            "nodeMac": mac,
            "nodeSign": sign,
            //pubke
            "nodeEncryptPubK": pubke,
            //[ubks]
            "nodeSignPubK": pubks,
            "nodePublicIP": node_pubip
        };
        let response;
        try{
            response = await axios.post(url, data);
        }catch(error){
            console.error(`[API] verify Error ${error}`);
            throw error;
        }
        if(!isSuccessResponse(response)){
            if(response.status===400){
                throw new Error("[API] verify FAILED! this node can't be verified by server!");
            }
            throw new Error("[API] verify http Error");
        }
        console.log(`[API] verify Complete`);
        if(this.debug)console.log(response);
        /**
         * 여기에 받아오는 값을 파싱하고 저장하는 로직 필요함
         * NodeCertificate(s), NodeCertificate(e)
         */
        return response.data;
    }
}

module.exports = { NodeAuthAPI };