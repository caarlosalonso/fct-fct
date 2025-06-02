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

    private final String bucketName = StorageClient.getInstance().bucket().getName();

    @Autowired
    private servicioVAlumno servicioVAlumno;

    public void subirArchivo(User user, MultipartFile archivo) throws IOException {

        Optional<vAlumno> va = servicioVAlumno.getByUserId(user.getId());

        if (va.isEmpty()) {
            throw new IllegalArgumentException("El usuario no es un alumno válido");
        }

        vAlumno vAlumno = va.get();
        //Construir ruta: año/ciclo/curso/idAlumno/nombreArchivo
        String ruta = String.format("%s/%s/%s/%s/%s",
            vAlumno.getAño(),
            vAlumno.getCiclo(),
            vAlumno.getGrupo(),
            vAlumno.getId(),
            archivo.getOriginalFilename());

        // Crear el objeto en el bucket
        StorageClient.getInstance()
                    .bucket()
                    .create(ruta, archivo.getBytes(), archivo.getContentType());
}
}
