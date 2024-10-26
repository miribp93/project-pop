package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.CreateUserDTO;
import com.guaguaupop.guaguaupop.entity.*;
import com.guaguaupop.guaguaupop.exception.EmailAlreadyExistsException;
import com.guaguaupop.guaguaupop.exception.NewUserWithDifferentPasswordsException;
import com.guaguaupop.guaguaupop.exception.UsernameAlreadyExistsException;
import com.guaguaupop.guaguaupop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService extends BaseService<User, Long, UserRepository> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User save(CreateUserDTO userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .name(userDTO.getName())
                .lastName1(userDTO.getLastName1())
                .lastName2(userDTO.getLastName2())
                .email(userDTO.getEmail())
                .phone(userDTO.getPhone())
                .street(userDTO.getStreet())
                .city(userDTO.getCity())
                .postalCode(userDTO.getPostalCode())
                .profilePhoto(userDTO.getProfilePhoto())
                .userRoles(Collections.singleton(UserRole.USER))  // Asignar rol por defecto
                .build();
        return save(user);
    }

    public User createUser(CreateUserDTO createUserDto) {
        if (createUserDto.getPassword().equals(createUserDto.getPassword2())) {

            log.info("Datos del usuario a registrar: {}", createUserDto);

            if (userRepository.existsByEmail(createUserDto.getEmail())) {
                throw new EmailAlreadyExistsException();
            }

            if(userRepository.existsByUsername(createUserDto.getUsername())){
                throw new UsernameAlreadyExistsException();
            }
            User user = User.builder()
                    .username(createUserDto.getUsername())
                    .password(passwordEncoder.encode(createUserDto.getPassword()))
                    .name(createUserDto.getName())
                    .lastName1(createUserDto.getLastName1())
                    .lastName2(createUserDto.getLastName2())
                    .email(createUserDto.getEmail())
                    .phone(createUserDto.getPhone())
                    .street(createUserDto.getStreet())
                    .city(createUserDto.getCity())
                    .postalCode(createUserDto.getPostalCode())
                    .profilePhoto(createUserDto.getProfilePhoto())
                    .userRoles(Collections.singleton(UserRole.USER))  // Asignar rol por defecto
                    .build();

            User savedUser = save(user);
            log.info("Usuario registrado con éxito: {}", savedUser);
            return savedUser;
        } else {
            throw new NewUserWithDifferentPasswordsException();
        }
    }

    public User newUser(User newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return userRepository.save(newUser);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }
}
