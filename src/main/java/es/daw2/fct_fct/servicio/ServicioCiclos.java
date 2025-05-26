package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.repositorio.RepositorioCiclos;

@Service
public class ServicioCiclos implements IFServicioCiclos{

    @Autowired
    RepositorioCiclos repositorioCiclos;

    @Override
    public List<Ciclo> listaCiclos(){
        return (List<Ciclo>) repositorioCiclos.findAll();
    }

    @Override
    public Ciclo addCiclos(Ciclo c){
        return repositorioCiclos.save(c);
    }

    @Override
    public Optional<Ciclo> getCiclosId(Long id){
        return repositorioCiclos.findById(id);
    }

    @Override
    public boolean borrarCiclos(Long id){
        Optional<Ciclo> ciclosOptional = repositorioCiclos.findById(id);

        if(ciclosOptional.isPresent()){
            repositorioCiclos.delete(ciclosOptional.get());
            return true;
        }
            return false;
    }
}
