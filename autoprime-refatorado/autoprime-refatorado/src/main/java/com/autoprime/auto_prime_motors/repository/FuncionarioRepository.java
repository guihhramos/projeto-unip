package com.autoprime.auto_prime_motors.repository;

import com.autoprime.auto_prime_motors.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// @Repository: Indica ao Spring que esta é uma interface de acesso a dados.
@Repository
// extends JpaRepository<Funcionario, Long>: Herda todos os métodos de CRUD para a entidade Funcionario,
// cuja chave primária (@Id) é do tipo Long.
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    // Nenhuma implementação é necessária aqui por enquanto!
}