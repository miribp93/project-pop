package com.guaguaupop.guaguaupop.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetSimpleUserDTO {

    private Long idUser;
    private String username;
}
