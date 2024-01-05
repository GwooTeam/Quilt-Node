const net = require("net");
const { execSync } = require("child_process");
const { exec } = require("child_process");

const readline = require("readline");

const config = require("./supplier_config.json");
const host = config.user_ip;
const userPort = config.user_port;

let puk_val;
let prk_val;
let sign_val;

function powershellAsAdmin(command) {
  exec(command, { shell: "powershell" }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    console.log(`Command executed successfully. Output:${stdout} `);
  });
}

const textClient = new net.Socket();
textClient.connect(userPort, host, () => {
  console.time("sign_time");
  textClient.write("auth request");
});

textClient.on("data", (data) => {
  const message = data.toString().trim();
  console.log(message);
  // Check if the message is a random value
  if (message.startsWith("Random Value: ")) {
    const randomValue = message.split("Random Value: ")[1];
    handleNonceSign(randomValue);
  } else if (message.startsWith("verify OK")) {
    // console.log('message: ' + message); -- test code
    console.timeEnd("sign_time");
    textClient.end();
  }
});

textClient.on("close", () => {
  console.log("Connection to the text server closed");
  // rl.close();
});

textClient.on("error", (err) => {
  console.error(`Error: ${err.message}`);
});

function handleNonceSign(randomValue) {
  keygen_sign(() => {
    nonce_sign_raw(randomValue, prk_val);
  });
}

function keygen_sign(callback) {
  let keygen_out = execSync(
    `wsl bash -c "export LD_LIBRARY_PATH=./DigitalSignature && ./DigitalSignature/dmodule --keygen -r"`,
    { shell: "powershell" }
  );
  // console.log('키사인 실행 경로'+process.cwd());
  puk_val = keygen_out.toString().match(/puk=(.*?)prk=/)[1];
  prk_val = keygen_out.toString().match(/prk=([^&]+)/)[1];

  textClient.write("puk=" + puk_val);
  callback();
}

function nonce_sign_raw(dataVal, prkVal) {
  let sign_out = execSync(
    `wsl bash -c "export LD_LIBRARY_PATH=./DigitalSignature && ./DigitalSignature/dmodule -s -r ${dataVal} ${prkVal}"`,
    { shell: "powershell" }
  );

  sign_val = sign_out.toString().match(/sign=([^&]+)/)[1];
  // console.log('sign_val: ' + sign_val);
  textClient.write("sign=" + sign_val);
}
