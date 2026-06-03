package com.substring.chat.chat_app_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReactionRequest {
    private String messageId;
    private String emoji;
    private String username;
}
