package com.guaguaupop.guaguaupop.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetUserDTOAdmin {

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
}
