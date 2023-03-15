package com.dimitar.devolut.service;

import com.dimitar.devolut.model.User;
import org.springframework.http.ResponseEntity;

public interface UserService {
    public ResponseEntity<User> createUser(User user);

    public ResponseEntity<User> signIn(User user);

    public ResponseEntity<Double> getUserBalance(User user);

    public ResponseEntity<Integer> getIdByDTag(String dTag);
}
