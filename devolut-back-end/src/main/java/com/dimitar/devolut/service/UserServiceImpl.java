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
        if (userRepository.findByEmail(user.getEmail()) != null) return new ResponseEntity<>(null, HttpStatus.FOUND);
        if (userRepository.findBydTag(user.getdTag()) != null) return new ResponseEntity<>(null, HttpStatus.IM_USED);

        return ResponseEntity.ok(userRepository.save(user));
    }

    @Override
    public ResponseEntity<User> signIn(User user) {
        if (userRepository.findByEmail(user.getEmail()) == null && userRepository.findBydTag(user.getEmail()) == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        if (userRepository.findByEmail(user.getEmail()) != null && userRepository.findByEmail(user.getEmail()).getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(userRepository.findByEmail(user.getEmail()));
        } else if (userRepository.findBydTag(user.getEmail()) != null && userRepository.findBydTag(user.getEmail()).getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(userRepository.findBydTag(user.getEmail()));
        }

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<String> getDTagById(int id) {
        if (userRepository.findById(id) == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(userRepository.findById(id).getdTag());
    }

    @Override
    public ResponseEntity<Integer> getIdByDTag(String dTag) {
        if (userRepository.findBydTag(dTag) == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(userRepository.findBydTag(dTag).getId());
    }
}
