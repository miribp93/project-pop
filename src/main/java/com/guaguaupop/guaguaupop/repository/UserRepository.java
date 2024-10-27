package com.guaguaupop.guaguaupop.repository;

import com.guaguaupop.guaguaupop.entity.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional <User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    void deleteById(@NotNull Long idUser);
}

