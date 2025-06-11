package es.daw2.fct_fct.servicio;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.firebase.cloud.StorageClient;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.modelo.vAlumno;
import es.daw2.fct_fct.repositorio.RepositorioVAlumno;

@Service
public class ServicioArchivo extends AbstractService<Long, vAlumno, RepositorioVAlumno> {

    @Autowired
    private servicioVAlumno servicioVAlumno;

    public String subirArchivo(Long idUsuario, MultipartFile archivo) throws IOException {

        String bucketName = StorageClient.getInstance().bucket().getName();

        Optional<vAlumno> va = servicioVAlumno.getByUserId(idUsuario);

        if (va.isEmpty()) {
            throw new IllegalArgumentException("El usuario no es un alumno válido");
        }

        vAlumno vAlumno = va.get();
        String ruta = String.format("%s/%s/%s/%s/%s",
            vAlumno.getAño(),
            vAlumno.getCiclo(),
            vAlumno.getGrupo(),
            vAlumno.getId(),
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
