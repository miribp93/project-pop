package com.guaguaupop.guaguaupop.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() {
        super("Este email ya está en uso.");
    }
}
