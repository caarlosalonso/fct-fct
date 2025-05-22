package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Ciclos;
import es.daw2.fct_fct.repositorio.RepositorioCiclos;

@Service
public class ServicioCiclos implements IFServicioCiclos{

    @Autowired
    RepositorioCiclos repositorioCiclos;

    @Override
    public List<Ciclos> listaCiclos(){
        return (List<Ciclos>) repositorioCiclos.findAll();
    }

    @Override
    public Ciclos addCiclos(Ciclos c){
        return repositorioCiclos.save(c);
    }

    @Override
    public Optional<Ciclos> getCiclosId(Long id){
        return repositorioCiclos.findById(id);
    }

    @Override
    public boolean borrarCiclos(Long id){
        Optional<Ciclos> ciclosOptional = repositorioCiclos.findById(id);

        if(ciclosOptional.isPresent()){
            repositorioCiclos.delete(ciclosOptional.get());
            return true;
        }
            return false;
    }
}
