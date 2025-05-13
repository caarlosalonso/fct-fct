package es.daw2.fct_fct.repositorio;

import org.springframework.data.repository.CrudRepository;

import es.daw2.fct_fct.modelo.Users;

public interface RepositorioUser extends CrudRepository<Users, Integer> {
    
}
