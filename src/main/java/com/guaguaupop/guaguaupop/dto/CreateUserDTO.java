package com.guaguaupop.guaguaupop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio.")
    private String username;
    @NotBlank(message = "El nombre es obligatorio.")
    private String name;
    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
    private String password;
    @NotBlank(message = "La confirmación de contraseña es obligatoria.")
    private String password2;
    @NotBlank(message = "El primer apellido es obligatorio.")
    private String lastName1;
    private String lastName2;
    @NotBlank(message = "El email es obligatorio.")
    private String email;
    private Integer phone;
    private String street;
    @NotBlank(message = "La ciudad es obligatoria.")
    private String city;
    @NotBlank(message = "El código postal es obligatorio.")
    @Pattern(regexp = "\\d{5}", message = "El código postal debe tener 5 dígitos.")
    private String postalCode;
    private byte[] profilePhoto;
    private Set<String> roles;
}
