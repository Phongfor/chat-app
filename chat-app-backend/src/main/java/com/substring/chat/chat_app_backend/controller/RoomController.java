package com.substring.chat.chat_app_backend.controller;

import com.substring.chat.chat_app_backend.dto.request.ReactionRequest;
import com.substring.chat.chat_app_backend.dto.response.RoomResponse;
import com.substring.chat.chat_app_backend.entity.Message;
import com.substring.chat.chat_app_backend.entity.Room;
import com.substring.chat.chat_app_backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomRepository roomRepository;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody String roomId) {

        if (roomRepository.findByRoomId(roomId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room already exists");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RoomResponse(savedRoom.getRoomId(), 0));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> joinRoom(@PathVariable String roomId) {
        return roomRepository.findByRoomId(roomId)
                .map(room -> ResponseEntity.ok(
                        new RoomResponse(room.getRoomId(), room.getMessages().size())
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return roomRepository.findByRoomId(roomId)
                .map(room -> {
                    List<Message> messages = room.getMessages();
                    int start = Math.max(0, messages.size() - (page + 1) * size);
                    int end = Math.min(messages.size(), start + size);
                    return ResponseEntity.ok(messages.subList(start, end));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{roomId}/messages/{messageId}/reactions")
    public ResponseEntity<?> addReaction(@PathVariable String roomId,
                                         @PathVariable String messageId,
                                         @RequestBody ReactionRequest reactionRequest) {

        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.getMessages().stream()
                .filter(m-> messageId.equals(m.getId()))
                .findFirst()
                .ifPresent(message -> {
                    Map<String, List<String>> reactions = message.getReactions();
                    List<String> users = reactions.computeIfAbsent(reactionRequest.getEmoji(), k -> new ArrayList<>());

                    if(users.contains(reactionRequest.getUsername())){
                        users.remove(reactionRequest.getUsername());
                        if(users.isEmpty()) reactions.remove(reactionRequest.getEmoji());
                    }else{
                        users.add(reactionRequest.getUsername());
                    }
                });
        roomRepository.save(room);
        return ResponseEntity.ok().build();
    }

}
