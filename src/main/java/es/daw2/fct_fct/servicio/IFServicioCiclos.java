package es.daw2.fct_fct.servicio;

import java.util.List;

import es.daw2.fct_fct.modelo.Ciclo;

public interface IFServicioCiclos {
    List<Ciclo> getAllCiclos();
    Ciclo getCicloById(Long ciclo_id);
    Ciclo createCiclo(Ciclo ciclo);
    Ciclo updateCiclo(Long ciclo_id, Ciclo ciclo);
    void deleteCiclo(Long ciclo_id);
}
