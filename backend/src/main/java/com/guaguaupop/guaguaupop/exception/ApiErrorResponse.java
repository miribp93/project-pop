package com.guaguaupop.guaguaupop.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;


@Setter
@Getter
@RequiredArgsConstructor
@NoArgsConstructor
public class ApiErrorResponse {

    @NonNull
    private HttpStatus status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyy hh:mm:ss")
    private LocalDateTime date = LocalDateTime.now();

    @NonNull
    private String message;
}
