package com.dev.backdev.Auth.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dev.backdev.Auth.service.UserDetailsServiceImpl;
import com.dev.backdev.Auth.util.JwtUtil;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) 
    throws IOException, ServletException {
    try {
        String jwt = parseJwt(request);
        if (jwt != null && jwtUtils.validateToken(jwt)) {
            Claims claims = jwtUtils.extractAllClaims(jwt);
            String username = jwtUtils.extractUsername(jwt);
            List<String> roles = claims.get("roles", List.class);
            
            System.out.println("=== JWT AUTH DEBUG ===");
            System.out.println("Username: " + username);
            System.out.println("Raw roles from token: " + roles);
            
            List<GrantedAuthority> authorities = roles.stream()
            .map(role -> {
                String roleName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                System.out.println("Creating authority: " + roleName); // Debug
                return new SimpleGrantedAuthority(roleName);
            })
            .collect(Collectors.toList());
            
            System.out.println("Final authorities: " + authorities);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    } catch (Exception e) {
        logger.error("Cannot set authentication: {}", e);
    }
    chain.doFilter(request, response);
}

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}