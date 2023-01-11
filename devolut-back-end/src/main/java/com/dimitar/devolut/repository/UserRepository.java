package com.dimitar.devolut.repository;

import com.dimitar.devolut.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    public User findById(int id);
    public User findByEmail(String email);

    public User findBydTag(String dTag);

    public User findBydTagAndIdAndPassword(String dTag, int id, String password);
}
