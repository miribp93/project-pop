package com.guaguaupop.guaguaupop.repository;

import com.guaguaupop.guaguaupop.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
}
