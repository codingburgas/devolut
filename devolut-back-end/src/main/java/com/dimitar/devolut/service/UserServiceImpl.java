package com.dimitar.devolut.service;

import com.dimitar.devolut.model.User;
import com.dimitar.devolut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<User> createUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) == null) return ResponseEntity.ok(userRepository.save(user));

        return new ResponseEntity<>(null, HttpStatus.FOUND);
    }

    @Override
    public ResponseEntity<User> signIn(User user) {
        if (userRepository.findByEmail(user.getEmail()) == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        if (userRepository.findByEmail(user.getEmail()).getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(userRepository.findByEmail(user.getEmail()));
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
}
