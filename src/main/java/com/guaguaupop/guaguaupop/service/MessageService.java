package com.guaguaupop.guaguaupop.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.Builder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

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

    public void sendContactForm(String name, String lastName, String email, Integer phone, String comment) throws MessagingException, UnsupportedEncodingException {

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo("miribp09@gmail.com");
        helper.setFrom(new InternetAddress(email, name + " " + lastName));
        helper.setReplyTo(email);
        helper.setSubject("Quiere contactar.");
        helper.setText("Email: " + email + "\nTeléfono: " + (phone != null ? phone.toString() : "No proporcionado") + "\nComentario: " + comment);
        javaMailSender.send(message);
    }
}
