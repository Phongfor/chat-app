package com.substring.chat.chat_app_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String id = UUID.randomUUID().toString();
    private String sender;
    private String content;
    private LocalDateTime timeStamp;

    private String replyToId;
    private String replyToContent;
    private String replyToSender;

    private Map<String, List<String>> reactions = new HashMap<>();
}
