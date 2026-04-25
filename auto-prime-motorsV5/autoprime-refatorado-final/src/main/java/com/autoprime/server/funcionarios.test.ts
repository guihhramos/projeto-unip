import { describe, it, expect } from "vitest";

// Funções de validação (copiadas para teste)
function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function maskCPF(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function maskPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 14);
  } else {
    return cleaned
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }
}

describe("Validações de Funcionários", () => {
  describe("validateCPF", () => {
    it("deve validar CPF correto", () => {
      expect(validateCPF("111.444.777-35")).toBe(true);
    });

    it("deve rejeitar CPF com todos os dígitos iguais", () => {
      expect(validateCPF("111.111.111-11")).toBe(false);
    });

    it("deve rejeitar CPF com comprimento incorreto", () => {
      expect(validateCPF("123.456.789")).toBe(false);
    });

    it("deve rejeitar CPF com dígito verificador inválido", () => {
      expect(validateCPF("111.444.777-36")).toBe(false);
    });

    it("deve aceitar CPF sem formatação", () => {
      expect(validateCPF("11144477735")).toBe(true);
    });
  });

  describe("validateEmail", () => {
    it("deve validar e-mail correto", () => {
      expect(validateEmail("joao@example.com")).toBe(true);
    });

    it("deve rejeitar e-mail sem @", () => {
      expect(validateEmail("joaoexample.com")).toBe(false);
    });

    it("deve rejeitar e-mail sem domínio", () => {
      expect(validateEmail("joao@")).toBe(false);
    });

    it("deve rejeitar e-mail vazio", () => {
      expect(validateEmail("")).toBe(false);
    });

    it("deve validar e-mail com subdomínio", () => {
      expect(validateEmail("joao@mail.example.com")).toBe(true);
    });
  });

  describe("maskCPF", () => {
    it("deve formatar CPF corretamente", () => {
      expect(maskCPF("11144477735")).toBe("111.444.777-35");
    });

    it("deve limitar a 14 caracteres", () => {
      expect(maskCPF("111444777351234").length).toBeLessThanOrEqual(14);
    });

    it("deve remover caracteres não numéricos", () => {
      expect(maskCPF("111-444-777-35")).toBe("111.444.777-35");
    });

    it("deve lidar com entrada vazia", () => {
      expect(maskCPF("")).toBe("");
    });
  });

  describe("maskPhone", () => {
    it("deve formatar telefone com 10 dígitos", () => {
      expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
    });

    it("deve formatar telefone com 11 dígitos", () => {
      expect(maskPhone("11999998888")).toBe("(11) 99999-8888");
    });

    it("deve limitar a 15 caracteres", () => {
      expect(maskPhone("119999988881234").length).toBeLessThanOrEqual(15);
    });

    it("deve remover caracteres não numéricos", () => {
      expect(maskPhone("(11) 99999-8888")).toBe("(11) 99999-8888");
    });
  });

  describe("Integração de Validações", () => {
    it("deve validar um funcionário completo com dados corretos", () => {
      const nome = "João Silva";
      const cpf = "111.444.777-35";
      const email = "joao@example.com";
      const telefone = "(11) 99999-8888";

      expect(nome.length > 0).toBe(true);
      expect(validateCPF(cpf)).toBe(true);
      expect(validateEmail(email)).toBe(true);
      expect(telefone.length > 0).toBe(true);
    });

    it("deve rejeitar funcionário com dados inválidos", () => {
      const cpf = "000.000.000-00";
      const email = "email_invalido";

      expect(validateCPF(cpf)).toBe(false);
      expect(validateEmail(email)).toBe(false);
    });
  });
});
