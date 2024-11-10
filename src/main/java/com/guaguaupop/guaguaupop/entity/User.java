package com.guaguaupop.guaguaupop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.annotations.Type;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"user\"")
@Entity
public class User implements UserDetails {

    private static final long serialVersionUID = -2450942177410990788L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long idUser;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "lastName1", nullable = false)
    private String lastName1;

    @Column(name = "lastName2", nullable = false)
    private String lastName2;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone", length = 15)
    private Integer phone;

    @Column(name = "street")
    private String street;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "postalCode", nullable = false)
    @Pattern(regexp = "\\d{5}", message = "El código postal debe tener 5 dígitos")
    private String postalCode;


    @Column(name = "profile_photo", columnDefinition = "BYTEA")
    private byte[] profilePhoto;

    @OneToMany(mappedBy = "user")
    private List<Ad> services;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "userRoles", joinColumns = @JoinColumn(name = "idUser"))
    @Column(name = "role")
    private Set<UserRole> userRoles;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userRoles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());
    }

    public static class UserBuilder {
        private Set<UserRole> userRoles;

        public UserBuilder userRoles(Set<UserRole> userRoles) {
            this.userRoles = userRoles;
            return this;
        }
    }

    @CreatedDate
    private LocalDateTime localDateTime;

    @Builder.Default
    private LocalDateTime lastPasswordChangeAt = LocalDateTime.now();

    //

    @Override
    public boolean isAccountNonExpired() {

        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {

        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    /*
    @OneToMany(mappedBy = "sender")
    private List<Message> messagesSent;

    @OneToMany(mappedBy = "receiver")
    private List<Message> messagesReceived;

    @OneToMany(mappedBy = "user")
    private List<Ad> products;
*/

    @Override public String toString() {
        return "User{" + "idUser=" + idUser + ", " +
                "username='" + username + '\'' + '}';
    }


}
