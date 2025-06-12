package es.daw2.fct_fct.servicio;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.firebase.cloud.StorageClient;

import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.modelo.vistas.VistaAlumno;
import es.daw2.fct_fct.repositorio.vistas.VistaAlumnoRepository;

@Service
public class ServicioArchivo extends AbstractService<Long, VistaAlumno, VistaAlumnoRepository> {

    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    public String subirArchivo(Long id, MultipartFile archivo) throws IOException {

        String bucketName = StorageClient.getInstance().bucket().getName();
        List<VistaAlumno> vas = ((List<VistaAlumno>) repository.findAll())
            .stream()
            .filter(v -> v.getUserId() == id)
            .toList();

        System.out.println(vas);

        if (vas.isEmpty()) throw new IllegalArgumentException("El usuario no es un alumno válido");

        Optional<CicloLectivo> cicloLectivoOpt = servicioCicloLectivo.getCicloLectivoActual();
        if (cicloLectivoOpt.isEmpty()) {
            throw new IllegalArgumentException("No hay un ciclo lectivo activo");
        }

        Optional<VistaAlumno> va = vas.stream()
            .filter(v -> v.getCicloLectivoId() == cicloLectivoOpt.get().getId())
            .findFirst();

        if (va.isEmpty()) throw new IllegalArgumentException("El usuario no es un alumno válido 2");

        VistaAlumno user = va.get();

        String ruta = String.format("%d/%s/%d/%d/%s",
            user.getUserId(),
            user.getAcronimo(),
            user.getNumero(),
            user.getNombreAlumno(),
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
