package es.daw2.fct_fct.servicio;

import java.util.Optional;

import java.util.List;

public interface CrudService<Id, T> {
    
    public List<T> list();
    public Optional<T> getById(Id id);
    public T save(T obj);
    public Optional<T> update(Id id, T obj);
    public boolean delete(Id id);
}
