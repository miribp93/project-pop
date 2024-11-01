package com.guaguaupop.guaguaupop.exception;

public class NewUserWithDifferentPasswordsException extends RuntimeException{

    public NewUserWithDifferentPasswordsException(){
        super("Las contraseñas no coinciden");
    }
}
