import 


@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {
    private final FuncionarioRepository repository;

    public FuncionarioController(FuncionarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Funcionario> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Funcionario salvar(@RequestBody Funcionario funcionario) {
        return repository.save(funcionario);
    }

    @PutMapping("/{id}")
    public Funcionario atualizar(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        return repository.findById(id)
                .map(f -> {
                    f.setNome(funcionario.getNome());
                    f.setCpf(funcionario.getCpf());
                    f.setCargo(funcionario.getCargo());
                    f.setSetor(funcionario.getSetor());
                    f.setDataAdmissao(funcionario.getDataAdmissao());
                    f.setSalario(funcionario.getSalario());
                    f.setEndereco(funcionario.getEndereco());
                    f.setTelefone(funcionario.getTelefone());
                    f.setEmail(funcionario.getEmail());
                    f.setFoto(funcionario.getFoto());
                    return repository.save(f);
                })
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado"));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
