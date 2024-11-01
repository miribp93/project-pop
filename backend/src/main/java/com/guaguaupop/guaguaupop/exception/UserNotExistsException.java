package com.guaguaupop.guaguaupop.exception;

public class UserNotExistsException extends RuntimeException{

    public UserNotExistsException(){
        super("El nombre de usuario no existe.");
    }
}
