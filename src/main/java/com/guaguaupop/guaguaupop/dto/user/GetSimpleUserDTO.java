package com.guaguaupop.guaguaupop.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetSimpleUserDTO {

    @JsonProperty("id_user")
    private Long idUser;
    private String username;
}
