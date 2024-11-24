package com.guaguaupop.guaguaupop.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private String name;
    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
    private String password;
    @NotBlank(message = "La confirmación de contraseña es obligatoria.")
    private String password2;
    @JsonProperty("last_name1")
    private String lastName1;
    @JsonProperty("last_name2")
    private String lastName2;
    @NotBlank(message = "El email es obligatorio.")
    private String email;
    private Integer phone;
    private String street;
    private String city;
    @JsonProperty("postal_code")
    private String postalCode;
    private Set<String> roles;
}
