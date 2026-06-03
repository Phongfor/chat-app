package com.substring.chat.chat_app_backend.repository;

import com.substring.chat.chat_app_backend.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {

    Optional<Room> findByRoomId(String roomId);
}
