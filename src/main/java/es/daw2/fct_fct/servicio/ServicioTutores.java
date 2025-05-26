package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Tutor;
import es.daw2.fct_fct.repositorio.RepositorioTutores;


@Service
public class ServicioTutores implements IFServicioTutores{
    
    @Autowired
    RepositorioTutores repositorioTutores;

    @Override
    public List<Tutor> listaTutores(){
        return (List<Tutor>) repositorioTutores.findAll();
    }

    @Override
    public Tutor addTutores(Tutor a){
        return repositorioTutores.save(a);
    }

    @Override
    public Optional<Tutor> getTutoresId(Long id){
        return repositorioTutores.findById(id);
    }

    @Override
    public boolean borrarTutores(Long id){
        Optional<Tutor> tutorOptional = repositorioTutores.findById(id);

        if(tutorOptional.isPresent()){
            repositorioTutores.delete(tutorOptional.get());
            return true;
        }else{
            return false;
        }
    }
}
