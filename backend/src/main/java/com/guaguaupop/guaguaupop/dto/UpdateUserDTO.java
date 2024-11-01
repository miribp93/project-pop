package com.guaguaupop.guaguaupop.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Optional;

@Data
public class UpdateUserDTO {
    private Optional<String> username = Optional.empty();
    private Optional<String> name = Optional.empty();
    private Optional<String> lastName1 = Optional.empty();
    private Optional<String> lastName2 = Optional.empty();
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres.")
    private Optional<String> password1 = Optional.empty();
    private Optional<String> password2 = Optional.empty();
    private Optional<Integer> phone = Optional.empty();
    private Optional<String> street = Optional.empty();
    private Optional<String> city = Optional.empty();
    @Pattern(regexp = "\\d{5}", message = "El código postal debe tener 5 dígitos.")
    private Optional<String> postalCode = Optional.empty();
}
