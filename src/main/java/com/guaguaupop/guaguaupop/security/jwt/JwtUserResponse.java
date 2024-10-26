package com.guaguaupop.guaguaupop.security.jwt;

import com.guaguaupop.guaguaupop.dto.GetSimpleUserDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class JwtUserResponse extends GetSimpleUserDTO {

    private String token;

    @Builder(builderMethodName = "jwtUserResponseBuilder")
    public JwtUserResponse(Long idUser, String username, byte[] profilePhoto, String token) {
        super(idUser, username, profilePhoto);
        this.token = token;
    }
}
