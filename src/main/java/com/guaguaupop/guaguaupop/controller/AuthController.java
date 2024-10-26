package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.dto.LoginUserDTO;
import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.security.jwt.JwtTokenUtil;
import com.guaguaupop.guaguaupop.security.jwt.JwtUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public JwtUserResponse login(@Validated @RequestBody LoginUserDTO loginUserDTO) {
        log.info("Datos recibidos en login: {}", loginUserDTO);
        log.info("Nombre de usuario: {}", loginUserDTO.getUsername());
        log.info("Contraseña: {}", loginUserDTO.getPassword());

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginUserDTO.getUsername(),
                            loginUserDTO.getPassword()
                    )
            );
            log.info("Autenticación exitosa para el usuario: {}", loginUserDTO.getUsername());
            SecurityContextHolder.getContext().setAuthentication(auth);
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            log.info("Usuario autenticado: {}", userDetails.getUsername());
            String jwtToken = jwtTokenUtil.generateToken(auth);
            log.info("Token JWT generado: {}", jwtToken);
            return JwtUserResponse.jwtUserResponseBuilder()
                    .username(userDetails.getUsername())
                    .profilePhoto(null)  // Ajusta según necesites para obtener la foto de perfil
                    .token(jwtToken)
                    .build();
        } catch (BadCredentialsException e) {
            log.error("Error de credenciales: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error durante el login: {}", e.getMessage());
            throw e;
        }
    }



    /*public JwtUserResponse login(@Validated @RequestBody LoginUserDTO loginUserDTO) {


        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUserDTO.getUsername(),
                        loginUserDTO.getPassword()
                )
        );

        log.info("Autenticación exitosa para el usuario: {}", loginUserDTO.getUsername());

        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = (User) auth.getPrincipal();

        String jwtToken = jwtTokenUtil.generateToken(auth);

        return convertUserEntityAndTokenToJwtUserResponse(user, jwtToken);
    }*/






    private JwtUserResponse convertUserEntityAndTokenToJwtUserResponse(User user, String jwtToken) {
        return JwtUserResponse.jwtUserResponseBuilder()
                .idUser(user.getIdUser())
                .username(user.getUsername())
                .profilePhoto(user.getProfilePhoto())
                .token(jwtToken)
                .build();
    }
}
