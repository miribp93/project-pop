package com.guaguaupop.guaguaupop.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guaguaupop.guaguaupop.entity.UserRole;
import lombok.*;

import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetUserDTOAdmin {

    @JsonProperty("id_user")
    private Long idUser;
    private String username;
    private String name;
    @JsonProperty("last_name1")
    private String lastName1;
    @JsonProperty("last_name2")
    private String lastName2;
    private String email;
    private Integer phone;
    private String street;
    private String city;
    @JsonProperty("postal_code")
    private String postalCode;
    private Set<UserRole> roles;
}
