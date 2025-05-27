package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Tutor;

public interface IFServicioTutores {
    public List<Tutor> listaTutores();
    public Tutor addTutores(Tutor a);
    public Optional<Tutor> getTutoresId(Long tutor_id);
    public boolean borrarTutores(Long tutor_id);
}
