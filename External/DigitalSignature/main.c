#include <stdio.h>
#include <string.h>

#include "nc_api.h"
#include "example.h"

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("enter your option.\n");
        return 1;
    }

    // "--keygen" 옵션에 대한 동작 : public key와 private key 쌍 생성
    if (strcmp(argv[1], "--keygen") == 0) {
        printf("option --keygen is selected. start generate key pair.\n");
        dilithium_keygen();
        printf("EOF\n");
    }

    // "-s" 옵션에 대한 동작 : 소유한 private key로 암호화하여 서명
    else if (strcmp(argv[1], "-s") == 0) {
        printf("optiion -s is selected. start singing.\n");
        
        const char *data_path = argv[2]; // 두 번째 인자를 data_path 변수에 저장
        const char *prk_path = argv[3]; // 세 번째 인자를 prk_path 변수에 저장

        dilithium_sign(data_path, prk_path);
        printf("EOF\n");
    }

     // "-v" 옵션에 대한 동작 : 소유한 public key로 서명 검증
    else if (strcmp(argv[1], "-v") == 0) {
        printf("optiion -v is selected. start verification.\n");
        const char *data_file_path =  argv[2]; 
        const char *signed_file_path = argv[3]; // 두 번째 인자를 signed_file_path 변수에 저장
        const char *puk_path = argv[4]; // 세 번째 인자를 prk_path 변수에 저장
        dilithium_verify(data_file_path, signed_file_path, puk_path);
        printf("EOF\n");
    }

    // 알 수 없는 옵션 처리
    else {
        printf("undefined opition. valid options are '--keygen','-s', and '-v'.\n");
        return 1;
    }

    return 0;
}