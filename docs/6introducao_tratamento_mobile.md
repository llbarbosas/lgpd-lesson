<div align="center">

<img alt="Cabeçalho UFMS" src="https://raw.githubusercontent.com/nes-facom/templates/main/.assets/cabecalho_docs.png" />

## lgpd-lesson: Introdução à técnicas de tratamento de dados pessoais sensíveis em aplicações mobile

</div>

Além das técnicas de segurança aplicadas na comunicação entre API e cliente discutidas nos documentos anteriores, é necessário aplicar técnicas que protejam os dados salvos localmente dos usuários em casos de furtos ou acessos indevidos aos dispositivos móveis.

É comum, tanto em aplicações na web quanto em aplicativos móveis, a coleta de dados (i.e analytics) a fim de identificar o padrão de uso do usuário no serviço em questão. Estes, por si só, não são um problema. Porém, diferentemente das aplicações web, os dispositivos móveis oferecem muitas ferramentas de coleta de dados, como localização, hábitos de consumo, além de acompanharem o usuário em todos os momentos do dia.

De acordo com pesquisas, cerca de 3,95 bilhões de pessoas utilizam smartphones no mundo (Strategy Analytics), o que equivale a, pelo menos, metade da população mundial. Estes dispositivos se adaptaram a diversas necessidades como entretenimento, criação de conteúdos digitais, estudo, controle financeiro ou até mesmo trabalho. Isto torna estes aparelhos muito poderosos, ao passo que os tornam, também, muito sensíveis. São diversas as informações coletadas e acessadas por estes dispositivos, o que torna cada vez mais necessário a adoção de técnicas de segurança por parte dos aplicativos que busquem proteger os dados neles contidos.

A união dos dados do padrão de uso, dados das atividades do usuário e dados que os associam a esse usuário torna os dados facilmente identificáveis e, se vazados, possivelmente danosos. Por isso, ao desenvolver um aplicativo, antes de se preocupar em armazenar esses dados, é necessário, primeiramente, avaliar cuidadosamente quais dados realmente são necessários coletar, dada a vasta quantidade de ferramentas de coleta disponibilizadas por dispositivos móveis.

### Técnicas de segurança para dados armazenados localmente no dispositivo móvel

A seguir serão apresentadas algumas técnicas que contribuem para a proteção de dados persistidos localmente em dispositivos móveis.

#### 1. Ofuscação de código

A ofuscação de código é o processo de tornar as aplicações difíceis ou impossíveis de decompilar. Essa técnica é muito importante para dispositivos móveis pois, como o aplicativo está instalado no hardware utilizado(o dispositivo móvel), um usuário com permissões de super-administrador(root) e com intenções maliciosas pode ter acesso ao código fonte aplicando técnicas de engenharia reversa. Isso deixaria expostas lógicas de segurança, variáveis de ambiente, tokens ou chaves, que podem dar livre acesso a uma API autenticada ou até mesmo descriptografar dados do usuário salvos localmente.

#### 2. Bloquear acesso de dispositivos com permissões de super-administrador(root) no aplicativo

Dispositivos com root concedem a seus proprietários privilégios de super-administrador para modificar o sistema operacional e aplicativos de terceiros instalados. Isso representa riscos quando, por exemplo, o usuário têm seu dispositivo roubado, ficando expostos, como dito no tópico anterior, “lógicas de segurança, variáveis de ambiente, tokens ou chaves, que podem dar livre acesso a uma API autenticada ou até mesmo descriptografar dados do usuário salvos localmente”.

#### 3. Bancos de dados locais

É muito comum o uso de bancos de dados locais para armazenamento de dados do usuário em aplicativos mobile. Caso sejam armazenados dados pessoais, é necessário, porém, ficar atento para escolher bancos de dados que disponibilizam formas de criptografia, pois muitos destes salvam os dados no disco do dispositivo em arquivos plaintext, sendo facilmente acessíveis. Se não for possível criptografar o banco de dados, recomenda-se utilizar outras formas de armazenamento. Afins de exemplificação, seguem dois exemplos de bibliotecas seguras para armazenamento local em dispositivos android:

**EncryptedSharedPreferences**: Uma implementação da biblioteca SharedPreferences que criptografa chaves e valores. É uma biblioteca oficial do sistema android. ([Documentação](https://developer.android.com/reference/androidx/security/crypto/EncryptedSharedPreferences))

**Keystore**: A biblioteca keystore foca especificamente no armazenamento seguro de chaves. Isso é muito importante tanto para salvar chaves da API(que caso expostas podem expor também os dados do usuário) quanto para salvar chaves de criptografia que são usadas para criptografar algum dado salvo localmente. Sem o armazenamento adequado de chaves de criptografia a mesma pode ser facilmente quebrada. Segundo a documentação oficial, “quando as chaves estão no Keystore, elas podem ser usadas para operações criptográficas, e o material delas permanece não exportável. Além disso, esse recurso oferece instalações para restringir como e quando as chaves podem ser usadas, por exemplo, solicitando a autenticação do usuário para usar as chaves ou restringindo o uso das chaves apenas em certos modos criptográficos”.([Documentação](https://developer.android.com/training/articles/keystore))
