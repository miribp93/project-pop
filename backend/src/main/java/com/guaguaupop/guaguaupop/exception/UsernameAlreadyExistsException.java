package com.guaguaupop.guaguaupop.exception;

public class UsernameAlreadyExistsException extends RuntimeException{

    public UsernameAlreadyExistsException() {
        super("Este usuario ya existe, elige otro.");
    }
}
