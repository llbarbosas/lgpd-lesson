<div align="center">

<img alt="Cabeçalho UFMS" src="https://raw.githubusercontent.com/nes-facom/templates/main/.assets/cabecalho_docs.png" />

## lgpd-lesson: Desenvolvimento de uma aplicação mobile que realiza tratamento de dados pessoais sensíveis
A seguir, é descrito um método para a realização da criptografia de chaves da api e ofuscação do código.
  
# Persistência criptografada de chaves localmente
</div>
Foi utilizada a biblioteca EncryptedSharedPreferences, que é uma implementação da biblioteca SharedPreferences que criptografa chaves e valores. É uma biblioteca oficial do sistema android.


```
    private val keyGenParameterSpec = MasterKeys.AES256_GCM_SPEC
    private val masterKeyAlias = MasterKeys.getOrCreate(keyGenParameterSpec)
    private val sharedPreferences = EncryptedSharedPreferences.create(
        "tokens",
        masterKeyAlias,
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
```

Além disso, foi realizada a ofuscação do código utilizando o próprio compilador do android através do arquivo build.gradle, como mostrado a seguir: 
![OfuscacaoDoCodigo](https://user-images.githubusercontent.com/36047428/201571168-2b292456-cd74-4123-a6ef-0e87164782e1.png)

# Como rodar o projeto
Para rodar o projeto basta ter instalado o android studio e ter seguido os passos de execução da api descritos no documento "Desenvolvimento de uma aplicação web que realiza tratamento de dados pessoais sensíveis".
