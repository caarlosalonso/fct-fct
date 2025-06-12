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

        Map<Long, Long> practicasPorCicloLectivo = fcts.stream()
            .filter(fct -> fct.getMotivoRenuncia() == null)
            .collect(Collectors.groupingBy(fct -> fct.getCurso().getGrupo().getCicloLectivo().getId(), Collectors.counting()));

        Map<Long, Long> renunciasPorCicloLectivo = fcts.stream()
            .filter(fct -> fct.getMotivoRenuncia() != null)
            .collect(Collectors.groupingBy(fct -> fct.getCurso().getGrupo().getCicloLectivo().getId(), Collectors.counting()));

        Map<Long, Long> titulanPorCicloLectivo = fcts.stream()
            .filter(fct -> !"EXTRAORDINARIA".equals(fct.getCurso().getRating()))
            .collect(Collectors.groupingBy(fct -> fct.getCurso().getGrupo().getCicloLectivo().getId(), Collectors.counting()));

        Map<String, Long> motivosRenuncia = fcts.stream()
            .filter(fct -> fct.getMotivoRenuncia() != null)
            .collect(Collectors.groupingBy(Fct::getMotivoRenuncia, Collectors.counting()));

        return Map.of(
            "alumnosPorCicloLectivo", ciclosLectivos.stream()
                .map(ciclo -> Map.of("nombre", ciclo.getNombre(), "totalAlumnos", alumnosPorCicloLectivo.getOrDefault(ciclo.getId(), 0L)))
                .collect(Collectors.toList()),
            "practicasPorCicloLectivo", ciclosLectivos.stream()
                .map(ciclo -> Map.of("nombre", ciclo.getNombre(), "totalPracticas", practicasPorCicloLectivo.getOrDefault(ciclo.getId(), 0L)))
                .collect(Collectors.toList()),
            "renunciasPorCicloLectivo", ciclosLectivos.stream()
                .map(ciclo -> Map.of("nombre", ciclo.getNombre(), "totalRenuncias", renunciasPorCicloLectivo.getOrDefault(ciclo.getId(), 0L)))
                .collect(Collectors.toList()),
            "titulanPorCicloLectivo", ciclosLectivos.stream()
                .map(ciclo -> Map.of("nombre", ciclo.getNombre(), "totalTitulan", titulanPorCicloLectivo.getOrDefault(ciclo.getId(), 0L)))
                .collect(Collectors.toList()),
            "motivosRenuncia", motivosRenuncia
        );
    }
}
