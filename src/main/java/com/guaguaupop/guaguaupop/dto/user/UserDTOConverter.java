package com.guaguaupop.guaguaupop.dto.user;

import com.guaguaupop.guaguaupop.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserDTOConverter {

    public CreateUserDTO convertUserToCreateUserDTO(User user){

        return CreateUserDTO.builder()
                .username(user.getUsername())
                .name(user.getName())
                .lastName1(user.getLastName1())
                .lastName2(user.getLastName2())
                .email(user.getEmail())
                .city(user.getCity())
                .postalCode(user.getPostalCode())
                .street(user.getStreet())
                .phone(user.getPhone()).build();
    }

    public GetSimpleUserDTO convertUserToGetUserDTO(User user){

        return GetSimpleUserDTO.builder()
                .username(user.getUsername()).build();
    }

    public GetUserDTOAdmin convertUserToGetUserDTOProfile(User user){

        if (user == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo");
        }

        return GetUserDTOAdmin.builder()
                .idUser(user.getIdUser())
                .username(user.getUsername())
                .name(user.getName())
                .lastName1(user.getLastName1())
                .lastName2(user.getLastName2())
                .email(user.getEmail())
                .city(user.getCity())
                .postalCode(user.getPostalCode())
                .street(user.getStreet())
                .phone(user.getPhone()).build();
    }
}
