package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Ciclos;

public interface IFServicioCiclos {

    public List<Ciclos> listaCiclos();
    public Ciclos addCiclos(Ciclos c);
    public Optional<Ciclos> getCiclosId(Long id);
    public boolean borrarCiclos(Long id);
}
