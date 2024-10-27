package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.CreateUserDTO;
import com.guaguaupop.guaguaupop.entity.*;
import com.guaguaupop.guaguaupop.exception.EmailAlreadyExistsException;
import com.guaguaupop.guaguaupop.exception.NewUserWithDifferentPasswordsException;
import com.guaguaupop.guaguaupop.exception.UsernameAlreadyExistsException;
import com.guaguaupop.guaguaupop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    //Buscar usuario por username
    public Optional<User> findUserByUsername(String username) {

        return userRepository.findByUsername(username);
    }


    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }


    //ASIGNAR ROLE A USUARIO
    public void assignRoleToUser(Long userId, UserRole role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.getUserRoles().add(role);
        userRepository.save(user);
    }


    //CREAR AL MANAGER
    public User registerManager(CreateUserDTO createUserDTO) {
        if (createUserDTO.getPassword().equals(createUserDTO.getPassword2())) {

            log.info("Datos del usuario a registrar: {}", createUserDTO);

            if (userRepository.existsByEmail(createUserDTO.getEmail())) {
                throw new EmailAlreadyExistsException();
            }

            if(userRepository.existsByUsername(createUserDTO.getUsername())){
                throw new UsernameAlreadyExistsException();
            }

            User user = User.builder()
                    .username(createUserDTO.getUsername())
                    .password(passwordEncoder.encode(createUserDTO.getPassword()))
                    .name(createUserDTO.getName())
                    .lastName1(createUserDTO.getLastName1())
                    .lastName2(createUserDTO.getLastName2())
                    .email(createUserDTO.getEmail())
                    .phone(createUserDTO.getPhone())
                    .street(createUserDTO.getStreet())
                    .city(createUserDTO.getCity())
                    .postalCode(createUserDTO.getPostalCode())
                    .profilePhoto(createUserDTO.getProfilePhoto())
                    .userRoles(Collections.singleton(UserRole.MANAGER))  // Asignar rol por defecto
                    .build();

            User savedUser = save(user);
            log.info("Usuario registrado con éxito: {}", savedUser);
            return savedUser;
        } else {
            throw new NewUserWithDifferentPasswordsException();
        }
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

    public User createUser(CreateUserDTO createUserDTO) {

        if (createUserDTO.getPassword().equals(createUserDTO.getPassword2())) {

            log.info("Datos del usuario a registrar: {}", createUserDTO);

            if (userRepository.existsByEmail(createUserDTO.getEmail())) {
                throw new EmailAlreadyExistsException();
            }

            if(userRepository.existsByUsername(createUserDTO.getUsername())){
                throw new UsernameAlreadyExistsException();
            }

            User user = User.builder()
                    .username(createUserDTO.getUsername())
                    .password(passwordEncoder.encode(createUserDTO.getPassword()))
                    .name(createUserDTO.getName())
                    .lastName1(createUserDTO.getLastName1())
                    .lastName2(createUserDTO.getLastName2())
                    .email(createUserDTO.getEmail())
                    .phone(createUserDTO.getPhone())
                    .street(createUserDTO.getStreet())
                    .city(createUserDTO.getCity())
                    .postalCode(createUserDTO.getPostalCode())
                    .profilePhoto(createUserDTO.getProfilePhoto())
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
