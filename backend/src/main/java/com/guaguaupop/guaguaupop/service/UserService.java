package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.CreateUserDTO;
import com.guaguaupop.guaguaupop.dto.GetProfilePhotoDTO;
import com.guaguaupop.guaguaupop.dto.UpdateUserDTO;
import com.guaguaupop.guaguaupop.entity.*;
import com.guaguaupop.guaguaupop.exception.EmailAlreadyExistsException;
import com.guaguaupop.guaguaupop.exception.NewUserWithDifferentPasswordsException;
import com.guaguaupop.guaguaupop.exception.UserNotExistsException;
import com.guaguaupop.guaguaupop.exception.UsernameAlreadyExistsException;
import com.guaguaupop.guaguaupop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService extends BaseService<User, Long, UserRepository> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // BUSCAR USUARIO POR USERNAME
    public Optional<User> findUserByUsername(String username) {

        return userRepository.findByUsername(username);
    }

    // EXISTE USUARIO POR ID
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }

    //ASIGNAR ROLE A USUARIO
    public void assignRoleToUser(Long userId, UserRole role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
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
                    .userRoles(Collections.singleton(UserRole.MANAGER))  // Asignar rol por defecto
                    .build();

            User savedUser = save(user);
            log.info("Usuario registrado con éxito: {}", savedUser);
            return savedUser;
        } else {
            throw new NewUserWithDifferentPasswordsException();
        }
    }

    // GUARDAR DATOS USUARIO
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
                .userRoles(Collections.singleton(UserRole.USER))  // Asignar rol por defecto
                .build();
        return save(user);
    }

    // REGISTRAR UN NUEVO USUARIO
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

    // ADMINISTRATOR: BORRAR POR ID UN USUARIO NO LOGUEADO
    @Override
    public void deleteById(Long id) {

        userRepository.deleteById(id);
    }

    public Optional<User> getUser(Long id) {

        return userRepository.findById(id);
    }

    // ACTUALIZAR DATOS PERSONALES USUARIO
    public User updateUser(Long id, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findById(id).orElseThrow(UserNotExistsException::new);

        updateUserDTO.getUsername().ifPresent(user::setUsername);
        updateUserDTO.getName().ifPresent(user::setName);
        updateUserDTO.getLastName1().ifPresent(user::setLastName1);
        updateUserDTO.getLastName2().ifPresent(user::setLastName2);
        updateUserDTO.getPhone().ifPresent(user::setPhone);
        updateUserDTO.getStreet().ifPresent(user::setStreet);
        updateUserDTO.getCity().ifPresent(user::setCity);
        updateUserDTO.getPostalCode().ifPresent(user::setPostalCode);

        if (updateUserDTO.getPassword1().isPresent() &&
                updateUserDTO.getPassword1().get().equals(updateUserDTO.getPassword2().get())) {
            user.setPassword(updateUserDTO.getPassword1().get());
        } else if (updateUserDTO.getPassword1().isPresent()) {
            throw new IllegalArgumentException("Las contraseñas no coinciden");
        }

        return userRepository.save(user);
    }

    //SUBIR FOTO DE PERFIL
    public void uploadProfilePhoto(Long userId, MultipartFile file) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);
        user.setProfilePhoto(file.getBytes()); // BLOB
        userRepository.save(user);
    }

    // GET FOTO DE PERFIL
    public GetProfilePhotoDTO getProfilePhoto(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(UserNotExistsException::new);
        return new GetProfilePhotoDTO(user.getProfilePhoto());
    }
}
