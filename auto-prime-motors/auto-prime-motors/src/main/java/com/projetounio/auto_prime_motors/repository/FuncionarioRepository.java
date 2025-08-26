package com.projetounio.auto_prime_motors.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projetounio.auto_prime_motors.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
}
