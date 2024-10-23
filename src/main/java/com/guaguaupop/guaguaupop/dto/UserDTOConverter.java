package com.guaguaupop.guaguaupop.dto;

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
                .phone(user.getPhone())
                .profilePhoto(user.getProfilePhoto()).build();

    }

    public GetSimpleUserDTO convertUserToGetUserDTO(User user){
        return GetSimpleUserDTO.builder()
                .username(user.getUsername())
                .profilePhoto(user.getProfilePhoto()).build();

    }

    public GetUserDTOAdmin convertUserToGetUserDTOProfile(User user){
        return GetUserDTOAdmin.builder()
                .username(user.getUsername())
                .name(user.getName())
                .lastName1(user.getLastName1())
                .lastName2(user.getLastName2())
                .email(user.getEmail())
                .city(user.getCity())
                .postalCode(user.getPostalCode())
                .street(user.getStreet())
                .phone(user.getPhone())
                .profilePhoto(user.getProfilePhoto()).build();
    }
}
