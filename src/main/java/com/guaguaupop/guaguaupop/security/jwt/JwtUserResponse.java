package com.guaguaupop.guaguaupop.security.jwt;

import com.guaguaupop.guaguaupop.dto.GetSimpleUserDTO;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class JwtUserResponse extends GetSimpleUserDTO {

    private String token;
    private Set<String> roles;

    @Builder(builderMethodName = "jwtUserResponseBuilder")
    public JwtUserResponse(Long idUser, String username, String token, Set<String> roles) {
        super(idUser, username);
        this.token = token;
        this.roles = roles;
    }
}
