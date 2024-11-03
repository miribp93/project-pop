package com.guaguaupop.guaguaupop;

import org.springframework.boot.SpringApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


public class BCryptPasswordEncoderTestApp  {
    public static void main(String[] args) {
        SpringApplication.run(BCryptPasswordEncoderTestApp.class, args);

        testBCryptPasswordEncoder();
    }

    public static void testBCryptPasswordEncoder() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String rawPassword = "1111111111";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        System.out.println("Contraseña en texto plano: " + rawPassword);
        System.out.println("Contraseña codificada: " + encodedPassword);
    }
}
