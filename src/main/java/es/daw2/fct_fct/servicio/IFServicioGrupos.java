package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Grupo;

public interface IFServicioGrupos {

    public List<Grupo> listaGrupos();
    public Grupo addGrupos(Grupo g);
    public Optional<Grupo> getGruposId(Long grupo_id);
    public boolean borrarGrupos(Long grupo_id);
}
