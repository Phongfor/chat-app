package com.substring.chat.chat_app_backend.controller;

import com.substring.chat.chat_app_backend.dto.request.MessageRequest;
import com.substring.chat.chat_app_backend.dto.request.UserActivityRequest;
import com.substring.chat.chat_app_backend.dto.response.UserActivityResponse;
import com.substring.chat.chat_app_backend.entity.Message;
import com.substring.chat.chat_app_backend.entity.Room;
import com.substring.chat.chat_app_backend.repository.RoomRepository;
import com.substring.chat.chat_app_backend.servies.RoomUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final RoomRepository roomRepository;
    private final RoomUserService roomUserService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId,
                               @Payload MessageRequest request) {
        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Message message = new Message();
        message.setSender(request.getSender());
        message.setContent(request.getContent());
        message.setTimeStamp(LocalDateTime.now());

        room.getMessages().add(message);
        roomRepository.save(room);

        return message;
    }

    @MessageMapping("/activity/{roomId}")
    public void handleActivity(@DestinationVariable String roomId,
                               @Payload UserActivityRequest request) {
        List<String> onlineUsers;

        switch (request.getType()) {
            case JOIN  -> onlineUsers = roomUserService.userJoin(roomId, request.getUsername());
            case LEAVE -> onlineUsers = roomUserService.userLeave(roomId, request.getUsername());
            default      -> onlineUsers = roomUserService.getOnlineUsers(roomId);
        }

        messagingTemplate.convertAndSend(
                "/topic/activity/" + roomId,
                new UserActivityResponse(request.getUsername(), request.getType(), onlineUsers)
        );
    }

}
