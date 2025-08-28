package com.projetounio.auto_prime_motors.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {
     
    @GetMapping
    public String funcionarios(){
        return null;
    }


}
