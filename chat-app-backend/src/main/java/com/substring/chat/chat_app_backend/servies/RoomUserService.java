package com.substring.chat.chat_app_backend.servies;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomUserService {
    private final Map<String, Set<String>> roomUsers = new ConcurrentHashMap<>();

    public List<String> userJoin(String roomId, String username) {
        roomUsers.computeIfAbsent(roomId, k -> new HashSet<>()).add(username);
        return getOnlineUsers(roomId);
    }

    public List<String> userLeave(
            String roomId,
            String username
    ) {

        roomUsers.computeIfPresent(roomId, (id, users) -> {
                    users.remove(username);
                    return users.isEmpty()
                            ? null
                            : users;
                }
        );

        return getOnlineUsers(roomId);
    }

    public List<String> getOnlineUsers(String roomId) {
        return new ArrayList<>(roomUsers.getOrDefault(roomId, new HashSet<>()));
    }
}
