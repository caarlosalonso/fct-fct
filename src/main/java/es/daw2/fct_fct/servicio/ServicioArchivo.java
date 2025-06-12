package es.daw2.fct_fct.servicio;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.firebase.cloud.StorageClient;

import es.daw2.fct_fct.modelo.Alumno;
import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.repositorio.RepositorioCurso;
import es.daw2.fct_fct.repositorio.RepositorioUser;

@Service
public class ServicioArchivo extends AbstractService<Long, User, RepositorioUser> {

    @Autowired
    private ServicioAlumno servicioAlumno;
    @Autowired
    private RepositorioCurso repositorioCurso;
    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    public String subirArchivo(Long id, MultipartFile archivo) throws IOException {
        String bucketName = StorageClient.getInstance().bucket().getName();

        Optional<User> va = repository.findById(id);

        if (va.isEmpty()) throw new IllegalArgumentException("El usuario no es un alumno válido");

        User user = va.get();
        Alumno al = servicioAlumno.getByUserId(user.getId())
            .orElseThrow(() -> new IllegalArgumentException("El usuario no es un alumno válido"));

        List<Curso> cursos = ((List<Curso>) repositorioCurso.findAll())
            .stream()
            .filter((curso) -> curso.getAlumno().getId() == al.getId())
            .toList();

        if (cursos.isEmpty()) throw new IllegalArgumentException("El alumno no tiene cursos asociados");

        Curso curso = cursos.get(0);
        Grupo grupo = curso.getGrupo();
        Ciclo ciclo = grupo.getCiclo();

        CicloLectivo cicloLectivoActual = servicioCicloLectivo.getCicloLectivoActual()
            .orElseThrow(() -> new IllegalArgumentException("No hay ciclo lectivo actual"));

        String ruta = String.format("%d/%s/%d/%s/%s",
            cicloLectivoActual.getFechaInicio().getYear(),
            ciclo.getAcronimo(),
            grupo.getNumero(),
            user.getName(),
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
