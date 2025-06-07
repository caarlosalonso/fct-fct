package es.daw2.fct_fct.servicio;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;

import es.daw2.fct_fct.modelo.User;
import es.daw2.fct_fct.modelo.vAlumno;
import es.daw2.fct_fct.repositorio.RepositorioVAlumno;

@Service
public class ServicioArchivo extends AbstractService<Long, vAlumno, RepositorioVAlumno> {

    @Autowired
    private servicioVAlumno servicioVAlumno;

    public void subirArchivo(User user, MultipartFile archivo) throws IOException {
        Optional<vAlumno> va = servicioVAlumno.getByUserId(user.getId());

        if (va.isEmpty()) {
            throw new IllegalArgumentException("El usuario no es un alumno válido");
        }

        vAlumno vAlumno = va.get();
        //Construir ruta: año/ciclo/curso/idAlumno/nombreArchivo
        /*String ruta = String.format("%s/%s/%s/%s/%s",
            vAlumno.getAño(),
            vAlumno.getCiclo(),
            vAlumno.getGrupo(),
            vAlumno.getId(),
            archivo.getOriginalFilename());*/

        String ruta = String.format("%s",
            archivo.getOriginalFilename());
        

        // Crear el objeto en el bucket
        StorageClient.getInstance()
                    .bucket()
                    .create(ruta, archivo.getBytes(), archivo.getContentType());
    }

    public File descargarArchivo(User user, String nombreArchivo) throws IOException {
        Bucket bucketName = StorageClient.getInstance().bucket();
        Blob blob = bucketName.get(nombreArchivo);

        File tempFile = File.createTempFile("firebase-","-" + nombreArchivo);
        try (OutputStream os = new FileOutputStream(tempFile)) {
            blob.downloadTo(os);
        } catch (IOException e) {
            throw new IOException("Error al descargar el archivo: " + nombreArchivo, e);
        }

        return tempFile;
    }
}
