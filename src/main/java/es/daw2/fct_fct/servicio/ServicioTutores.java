package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Tutores;
import es.daw2.fct_fct.repositorio.RepositorioTutores;


@Service
public class ServicioTutores implements IFServicioTutores{
    
    @Autowired
    RepositorioTutores repositorioTutores;

    @Override
    public List<Tutores> listaTutores(){
        return (List<Tutores>) repositorioTutores.findAll();
    }

    @Override
    public Tutores addTutores(Tutores a){
        return repositorioTutores.save(a);
    }

    @Override
    public Optional<Tutores> getTutoresId(Long id){
        return repositorioTutores.findById(id);
    }

    @Override
    public boolean borrarTutores(Long id){
        Optional<Tutores> alumnoOptional = repositorioTutores.findById(id);

        if(alumnoOptional.isPresent()){
            repositorioTutores.delete(alumnoOptional.get());
            return true;
        }else{
            return false;
        }
    }
}
