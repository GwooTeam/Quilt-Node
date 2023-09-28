#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <cstring>
#include <unistd.h>

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

    // Accept Incoming Connections from Supplier
    if ((new_socket = accept(user_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
        std::cerr << "Accept error" << std::endl;
        return -1;
    }

    // Receive Message from Supplier
    valread = read(new_socket, buffer, 1024);
    std::cout << buffer << std::endl;

    // Send message to the Supplier (Check Success)
    send(new_socket, hello, strlen(hello), 0);
    std::cout << "Hello message sent" << std::endl;

    return 0;
}