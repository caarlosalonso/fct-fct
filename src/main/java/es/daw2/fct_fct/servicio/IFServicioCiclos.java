package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Ciclo;

public interface IFServicioCiclos {

    public List<Ciclo> listaCiclos();
    public Ciclo addCiclos(Ciclo c);
    public Optional<Ciclo> getCiclosId(Long ciclo_id);
    public boolean borrarCiclos(Long ciclo_id);
}
