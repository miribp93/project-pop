package com.guaguaupop.guaguaupop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(name = "id_user", nullable = false, updatable = false)
    private Long idUser;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "last_name1")
    private String lastName1;

    @Column(name = "last_name2")
    private String lastName2;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "phone", length = 15, nullable = true)
    private Integer phone;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "profile_photo", columnDefinition = "BYTEA")
    private byte[] profilePhoto;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Ad> ads;

    @ManyToMany @JoinTable(name = "user_favorites", joinColumns = @JoinColumn
            (name = "id_user"), inverseJoinColumns = @JoinColumn(name = "id_ad"))
    @JsonIgnore
    private Set<Ad> favoriteAds;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "id_user"))
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
        return !userRoles.contains(UserRole.BLOCKED);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }


}
