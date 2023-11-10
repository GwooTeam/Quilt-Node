#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "nc_api.h"

/// @brief Dilithium3 Standard


/// - security level: Level 3
/// - matrix computation: No
/// - symmetric primitive: SHA3
void dilithium_keygen()
{
    /**
     * Step 0-1. 타입 지정
     */
    NT_ULONG kg_type = NOB_CTX_DILITHIUM_KEYPAIR_GEN; /* keygen type*/
    NT_ULONG puk_type = NOB_PUBLIC_KEY;               /* pk type*/
    NT_ULONG prk_type = NOB_PRIVATE_KEY;              /* sk type*/
    NT_ULONG sig_type = NOB_CTX_DILITHIUM;            /* sig type*/
    NT_ULONG data_type = NOB_DATA;                    /* message type*/

    NT_CONTEXT keygenctx = {
        {NAT_OBJECT_TYPE, &kg_type, 0, FALSE, FALSE},
        {NAT_DILITHIUM_SECURITY_LEVEL, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_IS_MATRIX_PRECOMPUTED, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_SYMMETRIC_PRIMITIVE_TYPE, NULL, 0, FALSE, FALSE},
        {NAT_RANDOM_FUNCTION_TYPE, NULL, 0, FALSE, FALSE}};

    NT_OBJECT oPublicKey = {
        {NAT_OBJECT_TYPE, &puk_type, sizeof(puk_type), FALSE, FALSE},
        {NAT_VALUE, NULL, 0, FALSE, FALSE}};

    NT_OBJECT oPrivateKey = {
        {NAT_OBJECT_TYPE, &prk_type, sizeof(prk_type), FALSE, FALSE},
        {NAT_VALUE, NULL, 0, TRUE, FALSE}};

    NT_RV ret;

    /**
     * Step 0-2. 암호모듈 상태 변경
     * 양자내성암호 모듈을 사용하기 위해 현재 암호모듈의 상태를 다음과 같이 변경한다.
     */
    printf("current status = %d\n", NS_get_state());
    NS_change_state(NST_MODULE_DISAPPROVAL_PQC);
    printf("current status = %d\n", NS_get_state());

    /**
     * Step 1. 키 쌍 생성
     * 함수 NS_generate_keypair를 호출하여 키 쌍을 생성한다.
     *
     * keygenctx(in): 키 생성에 필요한 정보들을 담은 컨텍스트
     * oPublicKey(out): 공개키 컨텍스트
     * oprivateKey(out): 개인키 컨텍스트
     */
    if ((ret = NS_generate_keypair(&keygenctx,
                                   (NT_OBJECT_PTR)&oPublicKey,
                                   (NT_OBJECT_PTR)&oPrivateKey)) != NRC_OK)
    {
        printf("NS_generate_keypair failed: %s\n", NS_get_errmsg(ret));
        goto err;
    }


   // pub key, priv key 별도 파일로 저장
    FILE *pub_key_file = fopen("dilithium_key.puk", "wb");
    if(pub_key_file == NULL) {
        printf("failed to create puk file.\n");
        goto err;
    }

    fwrite(oPublicKey[1].pValue, oPublicKey[1].ulValueLen, 1, pub_key_file);
    fclose(pub_key_file);
    puts("success to create public key!");
    printf("\ntype : %u\n", oPublicKey[1].type);



    FILE *priv_key_file = fopen("dilithium_key.prk", "wb");
    if(priv_key_file == NULL) {
        printf("failed to create puk file.\n");
        goto err;
    }
    fwrite(oPrivateKey[1].pValue, oPrivateKey[1].ulValueLen, 1, priv_key_file);
    fclose(priv_key_file);
    puts("success to create private key!");
    printf("\ntype : %u\n", oPrivateKey[1].type);

    NS_hex_dump(oPrivateKey[1].pValue, oPrivateKey[1].ulValueLen, (NT_BYTE_PTR) "private key"); 
    printf("\nprivate key len : %d",oPrivateKey[1].ulValueLen );



    NS_hex_dump(oPublicKey[1].pValue, oPublicKey[1].ulValueLen, (NT_BYTE_PTR) "public key");

    printf("\npub key len : %d",oPublicKey[1].ulValueLen );


err:
    NS_clear_object((NT_OBJECT_PTR)&oPublicKey, 2);
    NS_clear_object((NT_OBJECT_PTR)&oPrivateKey, 2);
}

void dilithium_sign(const char *data_path, const char *prk_path)
{
    /**
     * Step 0-1. 타입 지정
     */
    NT_ULONG kg_type = NOB_CTX_DILITHIUM_KEYPAIR_GEN; /* keygen type*/
    NT_ULONG puk_type = NOB_PUBLIC_KEY;               /* pk type*/
    NT_ULONG prk_type = NOB_PRIVATE_KEY;              /* sk type*/
    NT_ULONG sig_type = NOB_CTX_DILITHIUM;            /* sig type*/
    NT_ULONG data_type = NOB_DATA;                    /* message type*/


    NT_OBJECT oPublicKey = {
        {NAT_OBJECT_TYPE, &puk_type, sizeof(puk_type), FALSE, FALSE},
        {NAT_VALUE, NULL, 0, FALSE, FALSE}};
    oPublicKey->type=0;
    NT_OBJECT oPrivateKey = {
        {NAT_OBJECT_TYPE, &prk_type, sizeof(prk_type), FALSE, FALSE},
        {NAT_VALUE, NULL, 0, TRUE, FALSE}};
    oPrivateKey->type=0;

    NT_CONTEXT signctx = {
        {NAT_OBJECT_TYPE, &sig_type, sizeof(sig_type), FALSE, FALSE},
        {NAT_DILITHIUM_SECURITY_LEVEL, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_IS_MATRIX_PRECOMPUTED, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_SYMMETRIC_PRIMITIVE_TYPE, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_IS_RANDOMIZING_SIGNING, NULL, 0, FALSE, FALSE},
        {NAT_RANDOM_FUNCTION_TYPE, NULL, 0, FALSE, FALSE}};

    /**
     * Step 0-2. 암호모듈 상태 변경
     * 양자내성암호 모듈을 사용하기 위해 현재 암호모듈의 상태를 다음과 같이 변경한다.
     */
    printf("current status = %d\n", NS_get_state());
    NS_change_state(NST_MODULE_DISAPPROVAL_PQC);
    printf("current status = %d\n", NS_get_state());

    NT_BYTE DataBuf[10130]; // 문자열을 저장할 배열, 충분한 크기로 설정
    FILE *file = fopen(data_path, "r"); // 파일을 읽기 모드로 열기

    if (file == NULL) {
        printf("파일을 열 수 없습니다.\n");
        return 1;
    }

    // 파일에서 데이터 읽기
    if (fgets(DataBuf, sizeof(DataBuf), file) != NULL) {
        // 줄 바꿈 문자 제거
        size_t len = strlen(DataBuf);
        if (len > 0 && DataBuf[len - 1] == '\n') {
            DataBuf[len - 1] = '\0';
        }
    } else {
        printf("파일에서 데이터 읽기 실패\n");
    }
    fclose(file);
    // printf("data.txt : \n %s",DataBuf);

    NT_OBJECT oData = {
        {NAT_OBJECT_TYPE, &data_type, sizeof(data_type), FALSE, FALSE},
        {NAT_VALUE, DataBuf, (NT_ULONG)sizeof(DataBuf), FALSE, FALSE},
    };

    NT_OBJECT oSignData = {
        {NAT_OBJECT_TYPE, &data_type, sizeof(data_type), FALSE, FALSE},
        {NAT_VALUE, NULL, NMC_MAX_DILITHIUM_SIG_SIZE, FALSE, FALSE},
    };

    NT_RV ret;

    oPrivateKey[1].ulValueLen = 4000;

    NT_VOID_PTR prk_value = (NT_VOID_PTR)calloc(oPrivateKey[1].ulValueLen, 1);
    FILE* prk_file;
    prk_file = fopen(prk_path, "rb");

    if(prk_file == NULL) {
        puts("failed to open private key...");
        goto err;
    }

    fread(prk_value, 4000, 1, prk_file);
    fclose(prk_file);

    oPrivateKey[1].pValue = prk_value;

    // check private key
    NS_hex_dump(oPrivateKey[1].pValue, oPrivateKey[1].ulValueLen, (NT_BYTE_PTR) "private key");
   


    ////////////////////////////////////////////////////////////////////////////////
    ///                              single-part                                  ///
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * Step 2-1. 서명 생성을 위한 초기 작업
     * 함수 NS_sign_init를 호출하여 서명 생성을 위한 초기 작업을 수행한다.
     *
     * signctx(inout) : 서명 생성에 필요한 컨텍스트
     * oPublicKey(in): 개인키 컨텍스트
     */
    if ((ret = NS_sign_init(&signctx,
                            (NT_OBJECT_PTR)&oPrivateKey)) != NRC_OK)
    {
        printf("NS_sign_init failed: %s\n", NS_get_errmsg(ret));
        goto err;
    }

    /**
     * Step 2-2. 서명 생성
     * 함수 NS_sign을 호출하여 입력 데이터(메시지)에 대한 서명을 생성한다.
     *
     * signctx(in) : 서명 생성에 필요한 컨텍스트
     * oData(in): 데이터 컨텍스트
     * oSignData(out): 서명 컨텍스트
     */
    if ((ret = NS_sign(&signctx,
                       (NT_OBJECT_PTR)&oData,
                       (NT_OBJECT_PTR)&oSignData)) != NRC_OK)
    {
        printf("NS_sign failed: %s\n", NS_get_errmsg(ret));
        goto err;
    }

    NS_hex_dump(oSignData[1].pValue,
                oSignData[1].ulValueLen, (NT_BYTE_PTR) "signed data");

    FILE *signed_file = fopen("dilithium_signed.bin", "wb");
    if(signed_file == NULL) {
        printf("failed to create signed file.\n");
        goto err;
    }
    fwrite(oSignData[1].pValue,
                oSignData[1].ulValueLen, 1, signed_file);
    fclose(signed_file);
    puts("success to create signed file!");

err:
    NS_clear_object((NT_OBJECT_PTR)&oPublicKey, 2);
    NS_clear_object((NT_OBJECT_PTR)&oPrivateKey, 2);
    NS_clear_object((NT_OBJECT_PTR)&oSignData, 2);
}

void dilithium_verify(const char *signed_path, const char *puk_path)
{
    /**
     * Step 0-1. 타입 지정
     */
    NT_ULONG kg_type = NOB_CTX_DILITHIUM_KEYPAIR_GEN; /* keygen type*/
    NT_ULONG puk_type = NOB_PUBLIC_KEY;               /* pk type*/
    NT_ULONG prk_type = NOB_PRIVATE_KEY;              /* sk type*/
    NT_ULONG sig_type = NOB_CTX_DILITHIUM;            /* sig type*/
    NT_ULONG data_type = NOB_DATA;                    /* message type*/

    NT_CONTEXT keygenctx = {
        {NAT_OBJECT_TYPE, &kg_type, 0, FALSE, FALSE},
        {NAT_DILITHIUM_SECURITY_LEVEL, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_IS_MATRIX_PRECOMPUTED, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_SYMMETRIC_PRIMITIVE_TYPE, NULL, 0, FALSE, FALSE},
        {NAT_RANDOM_FUNCTION_TYPE, NULL, 0, FALSE, FALSE}};

    NT_OBJECT oPublicKey = {
        {NAT_OBJECT_TYPE, &puk_type, sizeof(puk_type), FALSE, FALSE},
        {NAT_VALUE, NULL, 0, FALSE, FALSE}};
    oPublicKey->type=0;
    NT_OBJECT oPrivateKey = {
        {NAT_OBJECT_TYPE, &prk_type, sizeof(prk_type), FALSE, FALSE},
        {NAT_VALUE, NULL, 0, TRUE, FALSE}};
    oPrivateKey->type=0;

    NT_CONTEXT signctx = {
        {NAT_OBJECT_TYPE, &sig_type, sizeof(sig_type), FALSE, FALSE},
        {NAT_DILITHIUM_SECURITY_LEVEL, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_IS_MATRIX_PRECOMPUTED, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_SYMMETRIC_PRIMITIVE_TYPE, NULL, 0, FALSE, FALSE},
        {NAT_DILITHIUM_IS_RANDOMIZING_SIGNING, NULL, 0, FALSE, FALSE},
        {NAT_RANDOM_FUNCTION_TYPE, NULL, 0, FALSE, FALSE}};

    NT_BYTE DataBuf[10130]; // 문자열을 저장할 배열, 충분한 크기로 설정
    FILE *file = fopen("data.txt", "r"); // 파일을 읽기 모드로 열기

    if (file == NULL) {
        printf("파일을 열 수 없습니다.\n");
        return 1;
    }

    // 파일에서 데이터 읽기
    if (fgets(DataBuf, sizeof(DataBuf), file) != NULL) {
        // 줄 바꿈 문자 제거
        size_t len = strlen(DataBuf);
        if (len > 0 && DataBuf[len - 1] == '\n') {
            DataBuf[len - 1] = '\0';
        }
    } else {
        printf("파일에서 데이터 읽기 실패\n");
    }
    fclose(file);
    printf("data.txt : \n %s",DataBuf);

    NT_OBJECT oData = {
        {NAT_OBJECT_TYPE, &data_type, sizeof(data_type), FALSE, FALSE},
        {NAT_VALUE, DataBuf, (NT_ULONG)sizeof(DataBuf), FALSE, FALSE},
    };


    NT_OBJECT oSignData = {
        {NAT_OBJECT_TYPE, &data_type, sizeof(data_type), FALSE, FALSE},
        {NAT_VALUE, NULL, NMC_MAX_DILITHIUM_SIG_SIZE, FALSE, FALSE},
    };



    /**
     * Step 0-2. 암호모듈 상태 변경
     * 양자내성암호 모듈을 사용하기 위해 현재 암호모듈의 상태를 다음과 같이 변경한다.
     */
    printf("current status = %d\n", NS_get_state());
    NS_change_state(NST_MODULE_DISAPPROVAL_PQC);
    printf("current status = %d\n", NS_get_state());

    oSignData[1].ulValueLen = 4000;

    NT_VOID_PTR sign_data = (NT_VOID_PTR)calloc(oSignData[1].ulValueLen, 1);
    FILE* sign_file;
    sign_file = fopen(signed_path, "rb");

    if(sign_file == NULL) {
        puts("fail to open sign data...");
        goto err;
    }

    fread(sign_data, 4000, 1, sign_file);
    fclose(sign_file);

    oSignData[1].pValue = sign_data;

    // check private key
    NS_hex_dump(oSignData[1].pValue, oSignData[1].ulValueLen, (NT_BYTE_PTR) "sign data");


    NT_RV ret;


    oPublicKey[1].ulValueLen = 1952;

    NT_VOID_PTR puk_value = (NT_VOID_PTR)calloc(oPublicKey[1].ulValueLen, 1);
    FILE* puk_file;
    puk_file = fopen(puk_path, "rb");

    if(puk_file == NULL) {
        puts("failed to open public key...");
        goto err;
    }

    fread(puk_value, 1952, 1, puk_file);
    fclose(puk_file);

    oPublicKey[1].pValue = puk_value;

    // check public key
    NS_hex_dump(oPublicKey[1].pValue, oPublicKey[1].ulValueLen, (NT_BYTE_PTR) "public key");
   

    ////////////////////////////////////////////////////////////////////////////////
    ///                              single-part                                  ///
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * Step 3-1. 서명 검증 위한 초기 작업
     * 함수 NS_verify_init를 호출하여 서명 생성을 위한 초기 작업을 수행한다.
     *
     * signctx(inout) : 서명 검증 필요한 컨텍스트
     * oPublicKey(in): 공개키 컨텍스트
     */
    if ((ret = NS_verify_init(&signctx,
                              (NT_OBJECT_PTR)&oPublicKey)) != NRC_OK)
    {
        printf("NS_verify_init failed: %s\n", NS_get_errmsg(ret));
        goto err;
    }

    /**
     * Step 3-2. 서명 검증(서명 검증 single-part)
     * 함수 NS_verify를 호출하여 서명 검증을 수행한다.
     *
     * signctx(in) : 서명 검증에 필요한 컨텍스트
     * oData(in): 데이터 컨텍스트
     * oSignData(in): 서명 컨텍스트
     */
    if ((ret = NS_verify(&signctx,
                         (NT_OBJECT_PTR)&oData,
                         (NT_OBJECT_PTR)&oSignData)) != NRC_OK)
    {
        printf("NS_verify failed: %s\n", NS_get_errmsg(ret));
        goto err;
    }

    printf("\nsuccess verify !!\n");

err:
    NS_clear_object((NT_OBJECT_PTR)&oPublicKey, 2);
    NS_clear_object((NT_OBJECT_PTR)&oPrivateKey, 2);
    NS_clear_object((NT_OBJECT_PTR)&oSignData, 2);
}