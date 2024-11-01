package com.guaguaupop.guaguaupop.exception;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AuthorizationException {

    public static void handleAuthorizationException(HttpServletResponse response, Exception e, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        String dateString = (LocalDateTime.now()).format(
                DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm:ss"));
        response.getWriter().write("{\"status\": \"" + status.value() + "\" , \"date\"" + dateString + "\", \"message\": \"" + e.getMessage() + "\"}");
    }
}
