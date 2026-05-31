package com.substring.chat.chat_app_backend.dto.request;

import com.substring.chat.chat_app_backend.enums.ActivityType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserActivityRequest {
    private String roomId;
    private String username;
    private ActivityType type;
}
