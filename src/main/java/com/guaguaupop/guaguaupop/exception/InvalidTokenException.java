package com.guaguaupop.guaguaupop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidTokenException extends RuntimeException{

    public InvalidTokenException(){
        super("Credenciales incorrectas. Intente ingresar de nuevo.");
    }

    public InvalidTokenException(String message){
        super(message);
    }
}
