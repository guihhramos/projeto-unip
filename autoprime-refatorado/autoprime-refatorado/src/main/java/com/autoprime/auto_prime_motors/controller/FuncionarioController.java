package com.autoprime.auto_prime_motors.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.autoprime.auto_prime_motors.model.Funcionario;
import com.autoprime.auto_prime_motors.repository.FuncionarioRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @PostMapping
    public Funcionario cadastrar(@RequestBody Funcionario novoFuncionario) {
        return funcionarioRepository.save(novoFuncionario);
    }

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

@DeleteMapping("/{id}")
public ResponseEntity<Void> excluir(@PathVariable Long id) {
    // 1. VERIFICA SE O FUNCIONÁRIO COM O ID FORNECIDO EXISTE NO BANCO
    if (!funcionarioRepository.existsById(id)) {
        // 2. SE NÃO EXISTIR, RETORNA O CÓDIGO HTTP 404 (NOT FOUND)
        return ResponseEntity.notFound().build();
    }

    // 3. SE EXISTIR, DELETA O FUNCIONÁRIO
    funcionarioRepository.deleteById(id);
    
    // 4. RETORNA O CÓDIGO HTTP 204 (NO CONTENT) PARA INDICAR SUCESSO
    return ResponseEntity.noContent().build();
}
}