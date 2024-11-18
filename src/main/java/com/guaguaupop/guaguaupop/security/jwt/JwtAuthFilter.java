package com.guaguaupop.guaguaupop.security.jwt;

import com.guaguaupop.guaguaupop.exception.AuthorizationException;
import com.guaguaupop.guaguaupop.service.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.guaguaupop.guaguaupop.service.CustomUserDetailsService;
import java.io.IOException;
import static com.guaguaupop.guaguaupop.security.jwt.JwtTokenUtil.TOKEN_HEADER;
import static com.guaguaupop.guaguaupop.security.jwt.JwtTokenUtil.TOKEN_PREFIX;

@RequiredArgsConstructor
@Component
@Log
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = getTokenFromRequest(request);
            if (StringUtils.hasText(token) && jwtTokenUtil.validateToken(token)) {
                Long idUser = jwtTokenUtil.getUserIdFromJWT(token);
                CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserById(idUser);
                if (userDetails.getAuthorities().stream() .anyMatch(grantedAuthority
                        -> grantedAuthority.getAuthority().equals("ROLE_BLOCKED"))) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "El usuario está bloqueado.");
                    return;
                }

                UsernamePasswordAuthenticationToken authentication
                        = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (CannotCreateTransactionException e) {
            log.info("No se pudo crear la transacción: " + e.getMessage());
            AuthorizationException.handleAuthorizationException(response, e, HttpStatus.UNAUTHORIZED);
        }
        filterChain.doFilter(request, response);
    }


    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(TOKEN_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length() + 1);
        }
        return null;
    }


}
