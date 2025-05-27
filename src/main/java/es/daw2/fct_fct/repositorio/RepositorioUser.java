package es.daw2.fct_fct.repositorio;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import es.daw2.fct_fct.modelo.User;

public interface RepositorioUser extends CrudRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
