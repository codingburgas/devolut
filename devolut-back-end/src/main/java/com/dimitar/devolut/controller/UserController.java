package com.dimitar.devolut.controller;

import com.dimitar.devolut.model.User;
import com.dimitar.devolut.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/read")
    public ResponseEntity<User> signIn(@RequestBody User user) {
        return userService.signIn(user);
    }

    @PostMapping("/getIdByDTag")
    public ResponseEntity<Integer> getIdByDTag(@RequestBody String dTag) { return userService.getIdByDTag(dTag); }
}
