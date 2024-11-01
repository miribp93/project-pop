package com.guaguaupop.guaguaupop.dto;

import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginUserDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio.")
    @Size(min = 3, max=30, message = "El nombre de usuario debe tener al menos 3 caracteres y máximo 30")
    @Pattern(regexp = "^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$", message = "El nombre de usuario solo puede contener letras y números")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
