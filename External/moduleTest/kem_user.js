//tcp server
const net = require('net');
const fs = require('fs');
const { execSync } = require('child_process');


/* ################ server conntect ################# */
const text_port = 31245;
const file_port = 31246;
const host = 'localhost';

const socket = new net.Socket();

let fileCount = 0; // To keep track of the number of files received

const textServer = net.createServer(socket => {
    console.log('Client connected');
    socket.on('data', data => {
        const message = data.toString().trim();
        if (message === 'auth request') {
            console.log('Authentication request received');
           // Generate a random value
           const randomValue = Math.random().toString(36).substr(2, 9);
           console.log(`Generated Random Value: ${randomValue}`);

           // Send the random value to the client
           socket.write(`Random Value: ${randomValue}`);
          }
        }
      )
}); // const textServer


socket.on('end', () => {
  console.log('Client disconnected');
});

socket.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

textServer.listen(text_port, host, () => {
    console.log(`Text Server listening at ${host}:${text_port}`);
});


// File transfer server
const fileServer = net.createServer(socket => {
  console.log('File transfer connection established');
  let fileWriteStream;

  // capsule 데이터를 받았을 때
  socket.on('data', (data) => {

    // capsule 데이터 파일로 저장
    if (!fileWriteStream) {
        // Determine the filename based on the order of files received
        const filename = 'userResource/received_capsule.cap';
        fs.writeFileSync(filename, data);
        // fileWriteStream = fs.createWriteStream(filename);
        console.log(`Receiving file: ${filename}`);
    }
    // console.log('before await');
    
    // fileWriteStream.write(data);

    const prk_path = 'userResource/kyber_key.prk';
    const capsule_path = 'userResource/received_capsule.cap';
    const result_path = 'userResource/';
    const ssk_path = 'userResource/kyber_sharedsecret.ssk';
    const data_path = 'userResource/testData.txt';
    const encryptFilePath = 'userResource/kyber_encrypted.bin';
    // console.log('before decap')
    // capslue 파일을 prk로 디캡슐화 하고 암호화 파일을 생성한다.

    kem_decapsulate(prk_path, capsule_path, result_path);

    ssk_encrypt(ssk_path, data_path, result_path);
    
    // const encryptFilePath = 'userResource/kyber_encrypted.bin';
    const content = fs.readFileSync(encryptFilePath); 
    socket.write(content);
    socket.end();


  }); // socket.on('data')

  socket.on('end', () => {
   // const encryptFilePath = 'userResource/kyber_encrypted.bin';
   // const content = fs.readFileSync(encryptFilePath);
    // socket.write(content);
    // console.log('data transfer end: ' + (new Date()).getTime());
    console.log('File transfer completed');
    socket.end();
  });

  socket.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });


}); // const fileServer


fileServer.listen(file_port, 'localhost', () => {
  console.log(`File server listening at ${host}:${file_port}`);
});



/* #################### functions ####################### */


function kem_decapsulate(prk_path, capsule_path, res_path) {
  console.log('into decapsulte.')
  var res = execSync(`../KEM/modules/kmodule -f --decap --key=${prk_path} --target=${capsule_path} --result=${res_path}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`Execution error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
      }
      console.log(`decapsulate Output: ${stdout.toString()}`);
  });

  // console.log(res.toString());
  
}



function ssk_encrypt(ssk_path, data_path, result_path) {
  console.log('into encrypt.')
  execSync(`../KEM/modules/kmodule -f --encrypt --key=${ssk_path} --target=${data_path} --result=${result_path}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Execution error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`decrypt Output: ${stdout}`);
    
});

}

// const prk_path = 'userResource/kyber_key.prk';
// const capsule_path = 'userResource/received_capsule.cap';
// const result_path = 'userResource/';
// const ssk_path = 'userResource/kyber_sharedsecret.ssk';
// const data_path = 'userResource/testData.txt';
// const encryptFilePath = 'userResource/kyber_encrypted.bin';

// async function runFunctions() {
//   await kem_decapsulate(prk_path, capsule_path, result_path);
//   await ssk_encrypt(ssk_path, data_path, result_path);
// }




