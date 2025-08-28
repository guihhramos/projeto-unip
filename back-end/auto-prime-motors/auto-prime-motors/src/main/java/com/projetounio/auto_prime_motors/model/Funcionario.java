package com.projetounio.auto_prime_motors.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "funcionarios")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, length = 11)
    private String cpf;

    private String cargo;
    private String setor;

    @Column(name = "data_admissao")
    private LocalDate dataAdmissao;

    private BigDecimal salario;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    private String telefone;
    private String email;
    private String foto;
}
