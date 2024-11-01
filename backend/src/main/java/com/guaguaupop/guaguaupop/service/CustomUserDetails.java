package com.guaguaupop.guaguaupop.service;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
public class CustomUserDetails implements UserDetails {
    private Long idUser;
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Long idUser, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.idUser = idUser;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }
}
