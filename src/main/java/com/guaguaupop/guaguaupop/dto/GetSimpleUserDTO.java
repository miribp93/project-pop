package com.guaguaupop.guaguaupop.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetSimpleUserDTO {

    private String username;
    private byte[] profilePhoto;
}
