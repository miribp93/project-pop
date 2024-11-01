package com.guaguaupop.guaguaupop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class DataBaseConnectionException extends RuntimeException{

    public DataBaseConnectionException(){
        super("No hay conexión a la Base de Datos. Inténtelo más tarde.");
    }
}
