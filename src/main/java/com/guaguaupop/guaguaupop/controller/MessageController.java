package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.service.MessageService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;

    // FORMULARIO DE CONTACTO
    @PostMapping("/contact-form")
    public ResponseEntity<?> sendComment(
            @RequestParam String name,
            @RequestParam(required = false, defaultValue = "") String lastName,
            @RequestParam String email,
            @RequestParam(required = false) Integer phone,
            @RequestParam String comment) {

        try {
            messageService.sendContactForm(name, lastName, email, phone, comment);
            return ResponseEntity.ok("Mensaje enviado.");

        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Error al enviar el mensaje: " + e.getMessage());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    // USUARIO QUIERE CONTACTAR CON OTRO USUARIO
    //@PostMapping("/contact-user")

}
