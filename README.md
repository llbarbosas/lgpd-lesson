<div align="center">

<img alt="Cabeçalho UFMS" src="https://raw.githubusercontent.com/nes-facom/templates/main/.assets/cabecalho_docs.png" />

## lgpd-lesson

Projeto de AoE de introdução á técnicas de segurança voltadas à proteção de dados pessoais.

</div>

### Contexto

Os alunos do curso de [Engenharia de Software](https://www.facom.ufms.br/engenharia-de-software/) da [Universidade Federal de Mato Grosso do Sul (UFMS)](https://www.ufms.br/) têm, ao final de sua formação, uma experiência profissionalizante muito produtiva, que acontece no [Núcleo de Práticas em Engenharia de Software (NES)](https://nes.facom.ufms.br/).

Entretanto, parte do conhecimento prático de certos aspectos do desenvolvimento de aplicações seguras no cenário do mercado de trabalho ainda não são tão acessíveis no âmbito da academia, mais especificamente nos tópicos referentes à autenticação e autorização de aplicações e usuários, e proteção dos dados destes.

Além disso, a [Lei Geral de Proteção dos Dados (LGPD)](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm), de 14 de agosto de 2018, introduz uma série de cuidados que devem ser observados por estar aplicações. Apesar de se tratar de um tópico não tão recente, suas implicações ainda não fazem parte do conhecimento geral de muitos acadêmicos e desenvolvedores.

O contexto desse projeto leva também em consideração a existência de uma variedade de cursos, palestras e conteúdos na internet sobre o tema, mas identifica uma carência da orientação prática do mesmo.

### Objetivo

Este projeto de Atividades Orientadas de Ensino (AoE) visa prover uma introdução à temática descrita aos alunos que estão cursando as disciplinas de Prática em Desenvolvimento de Software I e II no NES, provendo uma abordagem mais voltada para a prática, porém devidamente baseada na teoria e legislação vigente.

### Resultados esperados

- Introduzir os alunos à LGPD e suas implicações no desenvolvimento de aplicações que lidam com dados sensíveis de seus usuários.

- Proporcionar o conhecimento sobre os temas de autorização e autenticação de aplicações num contexto de aplicações distribuídas (cliente-servidor e microsserviços) através de protocolos utilizados no mercado ([OAuth 2.0](https://oauth.net/2/)), visando a segurança e proteção dos dados do usuário.

### Atividades desenvolvidas

##### Introdução à LGPD e técnicas para sua implementação

- Desenvolvimento de uma introdução textual à LGPD;
- Desenvolvimento de uma introdução textual à mecanismos de _tratamento_ (coleta, armazenamento, acesso e compartilhamento seguro) de dados pessoais sensíveis;

##### Autenticação e autorização

- Desenvolvimento de uma introdução textual aos conceitos de autenticação e autorização e sua diferenciação;
- Desenvolvimento de uma aplicação distribuída de autorização;

###### Proteção dos dados na web

- Desenvolvimento de uma aplicação web que utiliza protocolos de autorização e aplica mecanismos de _tratamento_ de dados pessoais sensíveis;

###### Proteção dos dados no mobile

- Desenvolvimento de uma introdução textual à tecnicas de _tratamento_ de dados pessoais para aplicações mobile;
- Desenvolvimento de uma aplicação mobile Android nativa que utiliza protocolos de autorização e aplica mecanismos de _tratamento_ de dados pessoais sensíveis.
