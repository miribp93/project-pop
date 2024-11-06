package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.dto.LoginUserDTO;
import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.exception.UserNotExistsException;
import com.guaguaupop.guaguaupop.repository.UserRepository;
import com.guaguaupop.guaguaupop.security.jwt.JwtTokenUtil;
import com.guaguaupop.guaguaupop.security.jwt.JwtUserResponse;
import com.guaguaupop.guaguaupop.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

import java.util.Set;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final UserService userService;


    //AUTENTICARSE PARA LOGIN
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

            Set<String> roles = userService.getUserRoles(userDetails.getUsername());

            log.info("Token JWT generado: {}", jwtToken);
            return JwtUserResponse.jwtUserResponseBuilder()
                    .username(userDetails.getUsername())
                    .token(jwtToken)
                    .roles(roles)
                    .build();

        } catch (BadCredentialsException e) {

            if (userRepository.existsByUsername(loginUserDTO.getUsername())) {

                log.error("Error de credenciales: {}", e.getMessage());
                throw e;

            } else {

                log.error("El usuario no existe: {}", loginUserDTO.getUsername());
                throw new UserNotExistsException();
            }

        } catch (Exception e) {

            log.error("Error durante el login: {}", e.getMessage());
            throw e;
        }
    }


    //CERRAR SESIÓN
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        return ResponseEntity.ok("Sesión cerrada correctamente.");
    }


    private JwtUserResponse convertUserEntityAndTokenToJwtUserResponse(User user, String jwtToken) {

        return JwtUserResponse.jwtUserResponseBuilder()
                .idUser(user.getIdUser())
                .username(user.getUsername())
                .token(jwtToken)
                .build();
    }
}
