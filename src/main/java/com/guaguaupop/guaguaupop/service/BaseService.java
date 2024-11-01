package com.guaguaupop.guaguaupop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public abstract class BaseService<T, ID, R extends JpaRepository<T, ID>> {

    @Autowired
    protected R repository;

    public T save(T entity) {
        return repository.save(entity);
    }

    public Optional<T> findById(ID id) {
        return repository.findById(id);
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public void delete(T entity) {
        repository.delete(entity);
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }
}
