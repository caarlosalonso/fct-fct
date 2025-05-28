package es.daw2.fct_fct.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Ciclo;
import es.daw2.fct_fct.repositorio.RepositorioCiclos;

@Service
public class ServicioCiclo implements IFServicioCiclos {

    @Autowired
    private RepositorioCiclos repositorioCiclos;

    @Override
    public List<Ciclo> getAllCiclos() {
        return (List<Ciclo>) repositorioCiclos.findAll();
    }

    @Override
    public Ciclo getCicloById(Long ciclo_id) {
        return repositorioCiclos.findById(ciclo_id).orElse(null);
    }

    @Override
    public Ciclo createCiclo(Ciclo ciclo) {
        return repositorioCiclos.save(ciclo);
    }

    @Override
    public Ciclo updateCiclo(Long ciclo_id, Ciclo ciclo) {
        if (repositorioCiclos.existsById(ciclo_id)) {
            ciclo.setId(ciclo_id);
            return repositorioCiclos.save(ciclo);
        }
        return null; // O lanzar una excepción si se prefiere
    }

    @Override
    public void deleteCiclo(Long ciclo_id) {
        if (repositorioCiclos.existsById(ciclo_id)) {
            repositorioCiclos.deleteById(ciclo_id);
        }
    }
}
