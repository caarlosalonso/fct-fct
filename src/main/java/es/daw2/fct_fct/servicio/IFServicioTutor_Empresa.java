package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Tutor_empresa;

public interface IFServicioTutor_Empresa {

    public List<Tutor_empresa> listaTutor_Empresa();
    public Tutor_empresa addTutor_Empresa(Tutor_empresa t);
    public Optional<Tutor_empresa> getTutor_EmpresaId(Long id);
    public boolean borrarTutor_Empresa(Long id);
}
