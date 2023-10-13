#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <cstring>
#include <unistd.h>
#include "protocol.h"

#define PORT 9000

int main() {
    int user_fd, new_socket, valread;
    struct sockaddr_in address;
    int opt = 1; // Activate boolean option: 1, 비활성화: 0
    int addrlen = sizeof(address);

    char buffer[1024] = {0};
    const char* hello = "Hello from user";

    // Create Socket Descriptor
    if ((user_fd = socket(AF_INET, SOCK_STREAM, 0)) <= 0) {
        std::cerr << "Socket creation error" << std::endl;
        return -1;
    }

    // Configure Socket Option
    if (setsockopt(user_fd, SOL_SOCKET, SO_REUSEPORT, &opt, sizeof(opt)) < 0) {
        std::cerr << "Setsockopt error" << std::endl;
        return -1;
    }

    // user Information Configuration
    address.sin_family = AF_INET; // IPv4
    address.sin_addr.s_addr = INADDR_ANY; // htonl(INADDR_ANY)
    address.sin_port = htons(PORT); // port 2000

    // binding Socket with IP address/PORT
    if (bind(user_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        std::cerr << "Bind failed" << std::endl;
        return -1;
    }

    // Listening State, max connections: 3
    if (listen(user_fd, 3) < 0) {
        std::cerr << "Listen error" << std::endl;
        return -1;
    }

    while(true) {
        if ((new_socket = accept(user_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
            std::cerr << "Accept error" << std::endl;
            continue; // 에러 발생 시 다음 연결 시도
        }

        // Handle Client's Data here using the defined protocol (StringMessage or FileMessage)
        StringMessage stringMsg;
        FileMessage fileMsg;

        // 먼저, 메시지 유형을 읽어옵니다.
        MessageType msgType;
        valread = read(new_socket, &msgType, sizeof(msgType));

        if (msgType == MessageType::STRING) {
            // 문자열 메시지를 처리합니다.
            valread = read(new_socket, &stringMsg, sizeof(stringMsg));
            std::cout << "Received String Message: " << stringMsg.data << std::endl;

            // Reply to Supplier
            send(new_socket, hello, strlen(hello), 0);
            std::cout << "String message has sent" << std::endl;

        } else if (msgType == MessageType::FILE) {
            
            // 파일 메시지를 처리합니다.
            valread = read(new_socket, &fileMsg, sizeof(fileMsg));
            std::cout << "Received File Message with Size: " << fileMsg.fileSize << " bytes" << std::endl;
    
            // 파일 내용을 터미널에 출력
            // File Msg 크기 가져오기
            std::cout << "File Content: " << std::endl;
            for (uint32_t i = 0; i < 10; ++i) {
                std::cout << fileMsg.data[i];
            }
            std::cout << std::endl;

            // Reply to Supplier
            send(new_socket, hello, strlen(hello), 0);
            std::cout << "File message has sent" << std::endl;
        }
    }

    // Send message to the Supplier (Check Success)
    send(new_socket, hello, strlen(hello), 0);
    std::cout << "Hello message sent" << std::endl;
    std::cout << std::endl;

    return 0;
}