package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.modelo.Fct;

@Service
public class ServicioStats {

    @Autowired
    private ServicioCicloLectivo servicioCicloLectivo;

    @Autowired
    private ServicioFCT servicioFCT;

    public Map<String, Object> generateStats() {
        List<CicloLectivo> ciclosLectivos = servicioCicloLectivo.list();
        List<Fct> fcts = servicioFCT.list();

        Map<Long, Long> alumnosPorCicloLectivo = fcts.stream()
            .collect(Collectors.groupingBy(fct -> fct.getCurso().getGrupo().getCicloLectivo().getId(), Collectors.counting()));

        long totalPracticas = fcts.stream().filter(fct -> fct.getMotivoRenuncia() == null).count();
        long totalRenuncias = fcts.stream().filter(fct -> fct.getMotivoRenuncia() != null).count();

        return Map.of(
            "alumnosPorCicloLectivo", ciclosLectivos.stream()
                .map(ciclo -> Map.of("nombre", ciclo.getNombre(), "totalAlumnos", alumnosPorCicloLectivo.getOrDefault(ciclo.getId(), 0L)))
                .collect(Collectors.toList()),
            "totalPracticas", totalPracticas,
            "totalRenuncias", totalRenuncias
        );
    }
}
