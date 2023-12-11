//import { NodeAuthAPI } from "./api.js";
const {NodeAuthAPI} = require("./api.js");
const {WSL} = require("./wsl.js");
async function main(){
    let node_id;
    let node_pubip;
    if (process.argv.length < 3){
        console.error(`[NodeAuth]plz command arg : node main.js <node_id> <node_public_ip>/ First, I'll set node_id to 1 and node_pub_ip to "1.2.3.4" and run it`);
        node_id = "1";
        node_pubip = "1.2.3.4";
        //process.exit(1);
    }else{
        node_id = process.argv[2];
        node_pubip = process.argv[3];
    }
    console.log(`node_id : `+node_id);
    console.log(`node_public_ip : `+node_pubip);

    //MK는 메인서버에서 오프라인으로 발급되거나 전용 다운로드링크를 줘서 스니핑없이 주는게 맞지만 MVP에선 서버에게 http로 달라함
    let mk;
    wsl = new WSL(false);
    //pubks : sign을 위한 딜리시움 개인키, priks : sign을 위한 딜리시움 공개키
    //pubke : encap을 위한 카이버 개인키, pubke : encap을 위한 카이버 개인키
    let [pubks, priks] = await wsl.KyberKeyGen();
    let [pubke, prike] = await wsl.DilithiumKeyGen();

    let nodeAuthAPI = new NodeAuthAPI(false);
    mk = await nodeAuthAPI.requestMacKey(node_id);
    console.log(`MAC : ` + mk);
    
    let server_pubkey = await nodeAuthAPI.requestServerPubKey();
    let temp = await wsl.KyberEncapsulate(server_pubkey);
    temp = temp.split("encapsulated=");
    temp = temp[1].split("ssk=");
    let encapsulated_server_pubkey_with_kyber = temp[0];
    let session_key = temp[1];
    console.log(`kyber key: ${encapsulated_server_pubkey_with_kyber}\nsession_key : ${session_key}`);
    
    let nonce = await nodeAuthAPI.enrollNonce(node_id, encapsulated_server_pubkey_with_kyber, session_key);
    console.log(`nonce : ${nonce}`);
    
    let mac = await wsl.hashing(nonce, mk);
    let sign = await wsl.DilithiumSign(priks, nonce+pubks);
    let [node_certificate_with_sign, node_certificate_with_encap] = await nodeAuthAPI.verify(node_id, mac, sign, pubks, pubke, node_pubip);
}

main();