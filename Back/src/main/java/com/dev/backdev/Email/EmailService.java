package com.dev.backdev.Email;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendCredentials(String toEmail, String username, String rawPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your ENICarthage Account Credentials");
        message.setText(
            "Your account has been created by the admin.\n\n" +
            "Username: " + username + "\n" +
            "Temporary Password: " + rawPassword + "\n\n" +
            "Please change your password after logging in.\n" 
           
        );
        mailSender.send(message);
    }

    public void sendClubCreationInfo(String toEmail, String clubName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Club Creation Info");
        message.setText(
            "Your club"+clubName+" has been created successfully.\n\n" +
            "You can now log in to your personal account which has the role president in this club and you'll be able to open the manager account from there and manage your club.\n\n" +
            "You can find you credentials in another email sent to you.\n"+
            "Thank you for your patience.\n" +
            "Best regards,\n" 
            
        );
        mailSender.send(message);
    }
}