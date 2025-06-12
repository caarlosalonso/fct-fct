package es.daw2.fct_fct.servicio;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import es.daw2.fct_fct.modelo.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ServicioArchivo servicioArchivo;

    @Autowired
    private User user;
/*
    public void sendEmailWithFireBaseAttachment(String to, String nombreArchivoEnFirebase) throws Exception {
        File archivo = servicioArchivo.descargarArchivo(user, nombreArchivoEnFirebase);
        try {
            sendEmailWithAttachment(to, "Asunto del correo", "Contenido del correo", archivo);
        } finally {
            archivo.delete();
        }
    }
*/
    public void sendEmailWithAttachment(String to, String subject, String body, File attachment) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment(attachment.getName(), attachment);

        mailSender.send(message);
    }

    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);

        mailSender.send(message);
    }
}
