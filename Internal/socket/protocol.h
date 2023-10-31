#ifndef PROTOCOL_H
#define PROTOCOL_H

#include <cstdint>
#include <string>

enum class MessageType : uint8_t {
    STRING,
    FILE
};

// 문자열 메시지 프로토콜
struct StringMessage {
    MessageType type;
    uint32_t length;  // 문자열 길이
    char data[1];     // 가변 길이 문자열 데이터
};

// 파일 메시지 프로토콜
struct FileMessage {
    MessageType type;
    uint32_t fileSize;  // 파일 크기
    char data[1];       // 가변 길이 파일 데이터
};

// 메시지 최대 크기
constexpr uint32_t MAX_MESSAGE_SIZE = 1024 * 1024 * 10;  // 10MB

#endif
