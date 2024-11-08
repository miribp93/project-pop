package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.dto.user.LoginUserDTO;
import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.exception.UserNotExistsException;
import com.guaguaupop.guaguaupop.repository.UserRepository;
import com.guaguaupop.guaguaupop.security.jwt.JwtTokenUtil;
import com.guaguaupop.guaguaupop.security.jwt.JwtUserResponse;
import com.guaguaupop.guaguaupop.service.MessageService;
import com.guaguaupop.guaguaupop.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    private final MessageService messageService;

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

    // ENLACE OLVIDASTE CONTRASEÑA
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        userService.initiatePasswordReset(email);

        // Aquí envía el correo
        String resetLink = "http://localhost:4200/reset-password";
        messageService.sendPasswordResetEmail(email, resetLink);

        return ResponseEntity.ok("Correo de restablecimiento enviado si el usuario existe.");
    }

    //ENLACE PARA RESETEAR CONTRASEÑA
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {

        boolean isUpdated = userService.resetPassword(email, newPassword);

        if (isUpdated) {
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario con ese email no existe.");
        }
    }
}
