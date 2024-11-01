package com.guaguaupop.guaguaupop.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

@Setter
@Getter
@RequiredArgsConstructor
@NoArgsConstructor
public class ApiErrorResponseJSON {

    @NonNull
    private HttpStatus status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy hh:mm:ss")
    private LocalDateTime date = LocalDateTime.now();

    @NonNull
    private Map<String, String> message;
}
