#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include "protocol.h"

#define PORT 9000

int main(int argc, char const *argv[]) {
    int sock = 0, valread;
    struct sockaddr_in user_addr;
    const char* hello = "Hello from Supplier";
    char buffer[1024] = {0};

    // Create socket file descriptor
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        std::cerr << "Socket creation error" << std::endl;
        return -1;
    }

    user_addr.sin_family = AF_INET;
    user_addr.sin_port = htons(PORT);

    // Convert IPv4 and IPv6 addresses from text to binary form
    if(inet_pton(AF_INET, "127.0.0.1", &user_addr.sin_addr)<=0) {
        std::cerr << "Invalid address/ Address not supported" << std::endl;
        return -1;
    }

    // Connect to the user
    if (connect(sock, (struct sockaddr *)&user_addr, sizeof(user_addr)) < 0) {
        std::cerr << "Connection Failed" << std::endl;
        return -1;
    }

    // Send message to the user
    FileMessage fileMsg;
    fileMsg.type = MessageType::FILE;

    std::string filePath = "/Users/youngjunlee/BoB/gwooteam/socket/example.txt"; // Replace with the actual file path
    FILE* file = fopen(filePath.c_str(), "rb");
    if (file) {
        fseek(file, 0, SEEK_END);
        fileMsg.fileSize = ftell(file);
        fseek(file, 0, SEEK_SET);

        // 파일 내용을 읽어 FileMessage에 복사
        fread(fileMsg.data, 1, fileMsg.fileSize, file);
        fclose(file);

        send(sock, &fileMsg, sizeof(fileMsg) + fileMsg.fileSize, 0);
        std::cout << "Sent File Message to Server." << std::endl;
    } else {
        std::cerr << "Failed to open file for sending." << std::endl;
    }

    // send(sock, hello, strlen(hello), 0);
    // std::cout << "Hello message sent" << std::endl;

    // Receive message from the user
    valread = read(sock, buffer, 1024);
    std::cout << buffer << std::endl;

    close(sock);

    return 0;
}