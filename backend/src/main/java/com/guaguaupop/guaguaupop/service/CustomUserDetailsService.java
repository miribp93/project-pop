package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        log.info("User loaded: {}", user.getUsername());

        return new CustomUserDetails(user.getIdUser(), user.getUsername(), user.getPassword(), user.getAuthorities());
    }

    public UserDetails loadUserById(Long id) throws UsernameNotFoundException {
        User user = userService.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        log.info("User loaded by ID: {}", user.getUsername());

        return new CustomUserDetails(
                user.getIdUser(),
                user.getUsername(),
                user.getPassword(),
                user.getAuthorities());
    }
}
