package es.daw2.fct_fct.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.CicloLectivo;
import es.daw2.fct_fct.repositorio.RepositorioCicloLectivo;

@Service
public class ServicioCicloLectivo implements IFServicioCicloLectivo {

    @Autowired
    RepositorioCicloLectivo repositorioCicloLectivo;

    @Override
    public List<CicloLectivo> listarCiclosLectivos() {
        return (List<CicloLectivo>) repositorioCicloLectivo.findAll();
    }

    @Override
    public CicloLectivo addCicloLectivo(CicloLectivo cicloLectivo) {
        return repositorioCicloLectivo.save(cicloLectivo);
    }

    @Override
    public CicloLectivo getCicloLectivoId(Long cicloLectivoId) {
        return repositorioCicloLectivo.findById(cicloLectivoId).orElse(null);
    }

    @Override
    public boolean borrarCicloLectivo(Long cicloLectivoId) {
        if (repositorioCicloLectivo.existsById(cicloLectivoId)) {
            repositorioCicloLectivo.deleteById(cicloLectivoId);
            return true;
        }
        return false;
    }

}
