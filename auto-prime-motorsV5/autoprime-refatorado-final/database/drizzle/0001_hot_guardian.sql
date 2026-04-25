CREATE TABLE `funcionarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`setor` varchar(100) NOT NULL,
	`salario` int NOT NULL,
	`dataAdmissao` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `funcionarios_id` PRIMARY KEY(`id`),
	CONSTRAINT `funcionarios_cpf_unique` UNIQUE(`cpf`),
	CONSTRAINT `funcionarios_email_unique` UNIQUE(`email`)
);
