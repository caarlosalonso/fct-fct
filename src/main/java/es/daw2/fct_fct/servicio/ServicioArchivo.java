package es.daw2.fct_fct.servicio;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.firebase.cloud.StorageClient;

import es.daw2.fct_fct.modelo.vAlumno;

@Service
public class ServicioArchivo {

    private final String bucketName = StorageClient.getInstance().bucket().getName();


    public void subirArchivo(vAlumno alumno, MultipartFile archivo) throws IOException {
        //Construir ruta: año/ciclo/curso/idAlumno/nombreArchivo
        String ruta = String.format("%s/%s/%s/%s/%s",
            alumno.getAño(),
            alumno.getCiclo(),
            alumno.getGrupo(),
            alumno.getId(),
            archivo.getOriginalFilename());

        // Crear el objeto en el bucket
        StorageClient.getInstance()
                    .bucket()
                    .create(ruta, archivo.getBytes(), archivo.getContentType());
}
}
