const {spawn} = require('child_process');

const exeFilePath = '../dmodule';
const exeFile = spawn(exeFilePath, ['-v', '-r', 'a1b2c3d4e5', '4b7b9870cb5e9c80440968f614b34e92da67f2f818d5188b1fc6209706536f07f0c9cf2830dac22cefd2a2a917b8bda896a44c138b2d889e2c4c0ed9c6d183f4f598917034777220cae6eb2efbfc7b3f795864ccb303632035eeac5bb597e4000e92bb5b0f0ea36a4c5883fea50ca48bfae11c245b755449ee63a6cd50a19bcd193d1d3d7b904a7697fb049b18e6a1affcc984b9f2cdf29e8e25f6a854c71c7473079683b1c8abadb64224255f464d23a1017413e03d3a1b416eb8bdc5776f6cd29b0c179cbaf48cd74b7c2a17e4c64ead8ebed2eff3bf7304386206911cfce3697631a2ea9cc506fe5146d295ea438458ebed0fcd30139bcc6767f32a9f13a8b038675fc6110c0e10c47b21609c9d43178477313bcefec9dfb339adf26f25ee7fe424130bac05f203815115fcf684083381d0df0f1c7b00539484787028f4677b958274fee329d8558f0aff92e6fdd228c57af2a9b08013a01d646ca68a70bc1c6aa45f58bc9c943f4e3f17cf23ae8161bdef71d7264dc41ce7f7db81a345fce3e10138e8297c6c51313add1b26f511d8da96475195b4b019f2c0f8c244946e5c84490ecb54162dc5d49424b014f7adc1f38920cd149c9d14fcaf1a8bab171176e1bf549928eb920c3d300e84cd333bc3231e5def1b5490cb930027dad0bf50dc50232314f88c17475f9f27602dc6d20f329e4f8694ccb2a25368c5a2a74bb7246f39e6b1d5d0da1cff9467b2742613d1aad80110ceac22c20ca87862b1e79244a2c30f57c5459d01050836d94b5967cd14b45a4271090287bfb515977d82ff0207be3f55ba860b316e9f4b49b5f78b1b246df8d0ce85aa1826af556f9c4b647e8682b2bb47f4a4078b0b0eaa07aa54559aedfb2198ae4c16f33109272c0be99c847ba443550634180c89e55834385534e5bcf49cf5dedae356a135b82662794e1923f104555a51e01796196eed8aa0cb75e4e44086abf428fa6170a848b5d66838308ec983e323dbc2b9fcc398ec48e7a5437c1bf69d3c6249792b2f3a8d47481e7f60a082f1b65fa35bdb113c8ff84d947e2b64bb6af889e283b09644fa1a3ec6aeede99b529845beca79d69c501149baa8f19f2104be4b304c836b470c4ae07e4dfbea22dbb5d66e1d1e4ecccae9418d2b9f0ae83d1b38b464823b1cbc5a3397ccd3d124670545eaffc27bdc7566f423e27b0829a90cafba92f02341bf2caf3b7bdf4f90032f0a56bea6e49336509bfa828a99988ef4fb4e2f45be51bc259e59a6a48c0a0941cf9e99bc08f1c78f3d144a9be1d3012a27a79dafb90cb9b5fc14bd88e9a07218ba1572d649e5cf85675511b24033014550432daae35e3a8d897dcc61b0808dc3b410a71e8467537524192f409024739107500e45da21f5b58ecbd170829e3f1808388f386977aa1e01552679615c74e5bf65c9f80409ff7309f608a730f867e64d465c49054feb0134f4fe15b77a0485a94546b34b17b08cf231abb9d8e54e7a6589704cf9d27689b5cad50852fc097c6cd1afd638b00b64ad7f0b7a7c2228021cfdd843cd90228bd7293755d25978c2060b58eba04c4365ef8ce78e9233538f212fe2bc2f177458b9876d6b9674c97bb826980fc749b37f41ad2d2c3fb234e4054013be1f41da21a16a5efb086dbff2eb3dc4deb4532e1f60432c48d62f213946bfbd26da67cc0d83cad64a83af75067e92cacf39baedbb7409b1c879c7452390e762558d2a7e100963b247634634dac8842ffc498a48d822992255a6a001c357fe0147f9580c82f216c557b82fc63f137496000ba2f13c518f2bea027f635a4a3cb39d746a6e8e0fdeeb8bffe73f6af3dab3597cc40ec28d3a1fbba339067ba1caf08dc8fac2d438899146a330dfb0e7d003fbe52d3493c2f3af598c9be7c32e15ac452d4a42d39ba053fc761a4eaec85a5da5c4352494f5a942a2cc057f3289adf3eab2c9182a8f6d47046fb527a1ad087c49afa4ad8fe97c87537b77a6373fd98ac9949bb2a63bb842d21af0a8c8ec6ca7bac5db6a126c651b561348527c20a039ce75375f11c9ab85259a9324acdff93d3e403557d3272eb89255d4c9dbc99ea147fc2790ede5e5be26245af505d53f110adfa6c06eb28da675682f1cf68f73c8dd709724041af880368495050802cf64f96a8662ba056ca04707d727db4dc60c2061b1ba9304281d3dfcd437d9ba881778076a8f3375e62d1a557dd29f1c13ff8a397bd93e41a52598d3b3bc06a4d0e73979783762d2161a69d18f54e6711cabe50bf1bc9967643f51737d545f18a14437c62c3bbc29c212df3e9cb55e2e2cb80ece4e584b476c32cadc81c57739a40531eaa31f949da8a40974bc4477292107f115b404a3636e8eb4c2c2e617d829622fd9260c11dbeb92adb234a3d120b9d9e005188e4a4f6aedd932511201313bd3525a37c7dd4f2643383a08dc3418f7607660977e2cc7a6927995005810b03f36e2e72ce5379e4947b7af6010f1fe0a9c87d9e88c9249d298869b00d047be65aac64915b586a38000aef02cef44c87e98f5a5e86f4d79a13712c8fc9585ad4d229dace81fabf46d80dc63ad7a5e22c187c18f8e750cccb2052911fda19a84f441cd975ff387dfc0d7492e31548fdc99c7b1e677b326a847ae89c8ad38d8b99edbfcbdc25d549e23ff8a244e928796a7310af9ad0b69e9901bd07977f44edb7862ceb5720505fc3927006e78f0b4d9ce9e095d8a59b816e673c26b9877d73947e57112a5feedc96312499158a89fbbdf249a1a873b846dae6b71bae071ac8c4c2fc2745e392c684340d05354bdaac92112313e53dc62376624e2fa867058eda03a09177b2e235ca1a182e61c4816b06a80c7ab3a4962d29d2da5ff735c15e67bd45d1f856afb57ec09f5b692666df0394e376c9f5cb43a4c1546dda12873bf273a14117ea1366652182fa5168bf1db299e7a6f6689ad6c22025820829b143ef52a3b797da83260f59d2d64da1c1c5648690e17f5e5391c705bd7678dd3bdb3d847b860b65d9c5fd4895f7c0f9383a21c7ac14158b5bad58ff2fe9e56a11d8d04a2957c4ecaaf2e152acb3e5d042c6bda22fd17c8b7e7312d066f29afe768e1c3198df8799c67f15b13a68a8ffc8ae49158b8ba324e5b66c66e29f887e1b55b117e10fa8c57cbe613d204abfe6607625f5f45e6b241e4fb6dbbdb729b71c3edd969add8ebc434167452b69de84ee1b75cc3ae08350cfb688d1b941987ebf56b4b11993ac0b0db78702ae5ac0a5173eec33743157a4c30f9819145f8812d625658cd706e5c18d2c15a81a8921eaf4a026949f8670a6f25d49604265427ad860ac2e5fe536d9cda277e29c7bb2396a59a70dd829b79532bb0679047a44a77a22fc5a03e6654749202ae06de810ffc7073ced047bbd62d9c8c739ed869137c8a2e78e51e5e1d4f6b2cc84101d5a1b9dc737bff5b55619b1d0bcfc47baf5d7e2ca4cc439fec2d664b1340b522f465aa7931a3facdd28d1a974d26524e974c5fe0308c489d52a6ab1f890a3d93e56915a2159dff3804fa084a31a9b61bebdaac26bb5e6ca9d15afe893fa124ea6e1307cfb9eb2ab9b8a948e0bb00b4211acf76668eb2a587964b6aa3f57e5044906549a24d1f221c11ff6a4738dced9d644eb0f04a89353625ee8e500d3b6f0be23f46b1a2c2ea8bf424fc5f3913c9cc2fe77cbd3f4d7bfb622a6446faf973ea833362c5feb3d666f61f297b4867505f5e6ce6b0f3735f41234925aeba0a9664d7818a0a8610191ba6bcdc0ee07cf23e959f7b1941d41e5a6b4cf6a4a85b26d1f592b92bb16d966d036cac8bbc5e3af0999b79aed8c4911776a624e9c5048a4430d07107c32ef7765bba07c226b3a088953002e5925999fb02f9dc1dbc646f04b4182d967e7c770283ddd72f0529e6d0fca4ca145088a196346febb76ab1548a11ffd621bb29390866137d140f29ab956dab30aed73477cb2d73f859f8c2558f8eecd91133675c893aa454b22627d27e89f06da76cf8b2bee12a602d3dfea48fa1a5ed3c2d2b4ca938fc3a247467d9403fcd07abfcb889168b635158f72a7eaed1f3b935f6972966e9322c742ebe0cd1cf232324326e5497154bf3f7f1e70c1b4435d8aec743e2debf743640611a060d0fee2e213c0a5979d2e0e02798d01e36947a2185e8664cec18385bcd09c9ef329a3468ee0cae4b532bbf3b1d0d0f1dab140580effcebf744a76eb7ba44beb8fac49cf6380444ce4f4222ff87054bfa02f6b6646e932759a8019860cad9d43157f766fbaed42cc4c7097645140b7473d479982fbaea40baa1289dca3683cdacabd4d334b61ae7af7c5db8267a8cd0f300a2108047065ac23b421d8a5a50ce4c7c505a6fca49876ffe46c37a514eb00a0cdc5e29bb87f2dd5f323941863cb703523aeebe01bc412a105cdf2dac7b28e5757a90027e2ffc2c930b7bb0e904ed9fe7abd37d9f2c0c68d4b4efae54ad818990f2a7a2cc2df3f42523997badb00e5949918b4fda28dc12836c91e3c2bd238a13558f86270462dc890409c2b2b7c87e801d47ada56869f01a97b5c09816233a83a9273e64c7045477f70a20576983d9f5031a2428394bd7e0fd090f456d6f7078a8e7f10000000000000000000000000000000005090d141d27', 
'8be1d500257f7ec2efe26d58dc3c4a56ffa90d801f435514bbe55b21a6e68f203de3c16ebf34c65db145e0bd7407bce0dd99cfa8ac8c4daf62a6ca4c526fcb8be89ed8ec7c76badf3433c828e4f70fd4fe9959348c4e92e6f4d5ae7c617921d9c87fda916c314d1d00db9a757d47100841fa45e63885fdc5c0ff6bbf487e7683632e15b6de1c6324b87510097ab450831967a2f81b19b9689ae30bc99fbe8c8b66500517a9bd5439a485668efc9eacef9f9f1829cd8b77514160d3c164c18022bdf2342b1db69c694ebff665a5c1e623cd879ce373c9853b035360aaa46fa7a8d6fbaa108e5b6ffb6a745b61fcbb9892893f66966583e806cba3e5c1b8d562363b7156f987de67a549e0960ecac71dcc9f6f8f98d2b5a2be10184f2e5721d046af2c955f8ba33208d46035f0deeae1061d96e112d5b88fa373060d32b232bba36dc0f7f0deaadcfc3346dd16b53d3acf274c965e9dca4ab21390337c9a0b8c2b0d6c09e5de06fa8cab033d58bfab341c09eeaa98dcfbdfa994a0dc48089062b4d8e3462ed0f262d14af6ccf64b4f601a9c7af62df390c528decbf221a00c7176168453e8d403965368766d788aaa112d51d0fc43453311f1edf7ff6e1e4674ad3379187713a9eaf87942b0fd638192019d6baf69b0e122db129692d46e8b7913cfbfc01de3a753d59e4a112a6aa89a7275f75b5bcfbb632b4a1ee041f43bb343463e5c86c989681d7dc7d9db170b7b5867de5acf4487afe413995b39baca12b4d1d3aba65d7cba78e25859003adebb909a202c9ac2376b4ea830eafb0b565529cd36714a658420601ed35710f6ca380186dcf51f4529b09345cd9935e3265ff715a5a8c63719da108488d5a959a3b4f85f1672f498ca2aef2e837c2a042f30d4092f396ed0c937fb3fb0574147bffc0923c4b02eff98f58ec132d397bcd9ea704dbdc2b7cddf62edcd386b671eec0172eb32413d33aa5da9753868ff3750a9e187935841a7b5ce4b86a4c2af341d092e78be707c5a30d1bef9755ba9cc47bbca75edf0ba52ebabb6a437c69994eb1e55abfd21e5f667462faa23826c13a494822962e782690a2c15bb59348b2e145561cd8a5ec9e0befb19dc9744ab23198d90836995976f02bd329a58c0fe8d07cc885619397a79682d67dd8be738fe7fb92e4405b743cd0a923ba8f773e57686dea1433dc82690f67b4e73a9e69df8ee1bb08fe660aee39e3492220bd8c977b4aeae77e46009fb624ecd906341942f0e2e075c189f87159767d3d7c97b22ae39beb2a948a9d12de09dbf61f51954edd2020a4ae721ff40766db1192093489490b2364da1657daa98eef0d8da9d0bb134c7bbd3a2e0b829d2702b9177dd94ac692938de84730c16f3b1c9feba7230967e7cbb867c1aa530a9edc359f31e76ccc5d08ddaeb7eba9368f62fc702e95ec3ea79ebad5d5f0ea0e36c0b2ff03ed899d25eca325ae846c3a3e984c39ac182c3f739ff773dfecee7382e6e30b88810b967e968504528019bdf1c62d52b6e7611e952fd625487219955ba10b005eb46be61f190a9985fd335b59f210f21159ea3ee9f760a4a564912dca041d3ce530733786ba11b76094be2d1e4b1bcfe25bb9699925a82d79de3147ad94f045085149c606afd6e0f9c1f65ce005e2e6ce63460d7a71d41cebdaf67ff8cb8eba3811a6eeb10e5a80cbf7c2f4c14e92d7aaf0b99082af825b181cabbfbc75a519e9a0f41930057904831e88f62d26264cadb520ff878aceae573a2ca12fc410ca16703fea0e408fd0b760e14221a3f671c7d02dcf2389da0f921e5e7bf533fa6a5c2bef621d5e12d8c7c3a6e392303060beffb78be33efb395cf6630969ab39aef359cba323dc8413710bdfb6676106ac806db809311d8b6c924e5436b0fbf25c12771124540d087383685fc2bb01e0f234c453fe873df4daf6cbcb38bf24638f952d02928ffb025145b9fe28916d3a2c6f30111ad4d2253d730a3788e71c60ea74533ff0ed0267677938606707d3d2820c44b0a3efbe051f4a50dd358e98cdf2d47bea5f83b242d463f34f1e591a73d93b3f25112856ee603efceb634090aac9a2b72cfc02317d1f89bc262284c03a1187064e06a184cfabc54740118d68631ea5e5a8debdcc37d64299a98519501a13e795e203b08f9d71601cce464d00b61f697201b6f703505f29b751f9c4385dceca24c4d07eabe70fbcb67e4667aa673d3ae977cd3858e6a4aa7a43dcae8de5a3ec6de67efe31705f6a84ccffdfb75097b139e33c466dec68bf8fc05ade5fe48d93749f5721dfdc66fb6fd99131ef64f4dff64cb0605f590a0cfbb8ee1dc51d4424dfd7805e2b238f75a80f37e0df7a84a198d3f98269789b9dfa6e0153ace1d50fe6ba2e8bdab737f8e50d3a16b40c2b9ea4fb8ec4d2d1a6871d68eec11773ec2d7e72f7e36857ee809b260eb16a800e5d844cb07aa0c6011b546100b3a1ae95e8a28e4a3336f1caa79ed6e9ad427012f837d3e331e688a49fb214aefa622f07cd1786cb5fde72b260e94b81159d1f219585849487a1217a8e39f03b1ebd079969a52be3095ed31673e2681c250fecdefff476c528a342f0913fef0ebe418dc66b6b26ed3273d92de3b7f9159cf835554bbdfc0200db0a582ca846998b4e7ef7184c53ee696df8638eefa74b1b0cf1c4378d3454e976aa9f288af0d400fd7e57bb5a29d9990a7992add817a4a3624bc38df39ebc9b76a904fd1c82ac3fcb03c3fcffc4c1aa3c9']);

// const externalProgram = spawn('external_program/a.out', ['arg1', 'arg2']);

let res = '';

exeFile.stdout.on('data', (data) => {
    console.log(`execute result of c code: ${data}`);
    res = data;
});

exeFile.on('close', (code) => {
    console.log(`exit code of c program: ${code}`);
    // console.log(`\nlet res: ${res}`);
    // console.log('typeof(res): ' + typeof(res));
});

