package es.daw2.fct_fct.servicio;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.firebase.cloud.StorageClient;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.modelo.vAlumno;
import es.daw2.fct_fct.repositorio.RepositorioAlumno;
import es.daw2.fct_fct.repositorio.RepositorioVAlumno;

@Service
public class ServicioArchivo extends AbstractService<Long, Alumno, RepositorioAlumno> {

    public String subirArchivo(Long id, MultipartFile archivo) throws IOException {

        String bucketName = StorageClient.getInstance().bucket().getName();
        System.out.println("Bucket Name: " + bucketName);

        System.out.println("ID: " + id);
        System.out.println(
            ((List<Alumno>) repository.findAll()).stream()
                .map(Alumno::toString)
                .toList()
        );

        Optional<Alumno> va = repository.findById(id);
        System.out.println("Alumno encontrado: " + va);

        if (va.isEmpty()) {
            throw new IllegalArgumentException("El usuario no es un alumno válido");
        }

        Alumno alumno = va.get();
        String ruta = String.format("%d/%s/%d/%d/%s",
            /*vAlumno.getAño()*/ 2024,
            /*vAlumno.getCiclo()*/ "DAW",
            /*vAlumno.getGrupo()*/ 2,
            /*vAlumno.getId()*/ alumno.getId(),
            archivo.getOriginalFilename());

        var blob = StorageClient.getInstance()
                                .bucket()
                                .create(ruta, archivo.getBytes(), archivo.getContentType());

        return String.format(
            "https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
            bucketName,
            java.net.URLEncoder.encode(blob.getName(), java.nio.charset.StandardCharsets.UTF_8)
        );
    }
}
