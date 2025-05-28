package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Grupo;
import es.daw2.fct_fct.repositorio.RepositorioGrupos;

@Service
public class ServicioGrupo implements IFServicioGrupos{

    @Autowired
    RepositorioGrupos repositorioGrupos;

    @Override
    public List<Grupo> listaGrupos(){
        return (List<Grupo>) repositorioGrupos.findAll();
    }

    @Override
    public Grupo addGrupos(Grupo g){
        return repositorioGrupos.save(g);
    }

    @Override
    public Optional<Grupo> getGruposId(Long id){
        return repositorioGrupos.findById(id);
    }

    @Override
    public boolean borrarGrupos(Long id){
        Optional<Grupo> gruposOptional = repositorioGrupos.findById(id);

        if(gruposOptional.isPresent()){
            repositorioGrupos.delete(gruposOptional.get());
            return true;
        }
            return false;
    }
}
