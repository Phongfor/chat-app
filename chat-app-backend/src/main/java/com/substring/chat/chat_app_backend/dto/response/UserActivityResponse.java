package com.substring.chat.chat_app_backend.dto.response;

import com.substring.chat.chat_app_backend.enums.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class UserActivityResponse {
    private String username;
    private ActivityType type;
    private List<String> onlineUsers;
}
