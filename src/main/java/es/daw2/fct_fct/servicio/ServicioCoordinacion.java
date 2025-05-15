package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Coordinacion;
import es.daw2.fct_fct.repositorio.RepositorioCoordinacion;

@Service
public class ServicioCoordinacion implements IFServicioCoordinacion{
    
    @Autowired
    RepositorioCoordinacion repositorioCoordinacion;

    @Override
    public List<Coordinacion> listaCoordinacion(){
        return (List<Coordinacion>) repositorioCoordinacion.findAll();
    }

    @Override
    public Coordinacion addCoordinacion(Coordinacion a){
        return repositorioCoordinacion.save(a);
    }

    @Override
    public Optional<Coordinacion> getCoordinacionId(Long id){
        return repositorioCoordinacion.findById(id);
    }

    @Override
    public boolean borrarCoordinacion(Long id){
        Optional<Coordinacion> coordinacionOptional = repositorioCoordinacion.findById(id);

        if(coordinacionOptional.isPresent()){
            repositorioCoordinacion.delete(coordinacionOptional.get());
            return true;
        }else{
            return false;
        }
    }
}
