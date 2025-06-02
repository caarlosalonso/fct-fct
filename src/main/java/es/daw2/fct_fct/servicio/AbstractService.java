package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;

public abstract class AbstractService<Id, T, R extends CrudRepository<T, Id>> implements CrudService<Id, T> {
    
    @Autowired
    protected R repository;

    @Override
    public List<T> list() {
        return (List<T>) repository.findAll();
    }

    @Override
    public Optional<T> getById(Id id) {
        return repository.findById(id);
    }

    @Override
    public T save(T obj) {
        return repository.save(obj);
    }

    @Override
    public Optional<T> update(Id id, T obj) {
        if (repository.existsById(id)) {
            return Optional.of(repository.save(obj));
        }
        return Optional.empty();
    }

    @Override
    public boolean delete(Id id) {
        if (! repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}
