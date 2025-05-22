package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Tutor_empresa;
import es.daw2.fct_fct.repositorio.RepositorioTutor_Empresa;

@Service
public class ServicioTutor_Empresa implements IFServicioTutor_Empresa{

    @Autowired
    RepositorioTutor_Empresa repositorioTutor_Empresa;

    @Override
    public List<Tutor_empresa> listaTutor_Empresa() {
        return (List<Tutor_empresa>) repositorioTutor_Empresa.findAll();
    }

    @Override
    public Tutor_empresa addTutor_Empresa(Tutor_empresa t) {
        return repositorioTutor_Empresa.save(t);
    }

    @Override
    public Optional<Tutor_empresa> getTutor_EmpresaId(Long id) {
        return repositorioTutor_Empresa.findById(id);
    }

    @Override
    public boolean borrarTutor_Empresa(Long id) {
        Optional<Tutor_empresa> tutor_empresaOptional = repositorioTutor_Empresa.findById(id);

        if(tutor_empresaOptional.isPresent()){
            repositorioTutor_Empresa.delete(tutor_empresaOptional.get());
            return true;
        }
            return false;
    }
}
