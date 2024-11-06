package com.guaguaupop.guaguaupop.service;

import lombok.Builder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Builder
@Service
public class MessageService {

    private final JavaMailSender javaMailSender;

    public void sendPasswordResetEmail(String email, String resetLink){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Restablecimiento de contraseña");
        message.setText("Para restablecer tu contraseña, haz clic en el siguiente enlace: " + resetLink);
        javaMailSender.send(message);
    }
}
