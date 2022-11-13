<div align="center">

<img alt="Cabeçalho UFMS" src="https://raw.githubusercontent.com/nes-facom/templates/main/.assets/cabecalho_docs.png" />

## lgpd-lesson: Introdução à LGPD: Por que me preocupar?

</div>

Quando falamos em Lei Geral de Proteção de Dados, precisamos ter em mente seu contexto, sua função e quais os impactos que de ambos na forma que desenvolvemos aplicações.

#### Contexto

A existência de uma legislação como a LGPD e o debate fomentado sobre assunto são indicadores claros de que devemos ter um olhar mais cuidadoso para segurança das nossas aplicações.
Além disso, a lei faz um convite claro às pessoas para fiscalizarem as aplicações que utilizam, permitindo que elas, quando desejarem, tenham poder de questionar como seus dados estão sendo tratados e se a segurança e prevenção da violação desses dados está acontecendo[^1]

[^1]: Artigo 17º e 18º

Entretanto, para quem vai lidar com _dados pessoais sensíveis_ do usuário, essa atenção é obrigatória, salvo em alguns casos específicos.

_Dados pessoais sensíveis_, segundo a lei, são _dados pessoais sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural_[^2]

[^2]: Artigo 5º, item III

A aplicação da lei deve ser observada salvo nos casos estabelecidos pelo artigo 4º:

> Art. 4º Esta Lei não se aplica ao tratamento de dados pessoais:
>
> I - realizado por pessoa natural para fins exclusivamente particulares e não econômicos;
>
> II - realizado para fins exclusivamente:
>
> a) jornalístico e artísticos; ou
>
> b) acadêmicos, aplicando-se a esta hipótese os arts. 7º e 11 desta Lei;
>
> III - realizado para fins exclusivos de:
>
> a) segurança pública;
>
> b) defesa nacional;
>
> c) segurança do Estado; ou
>
> d) atividades de investigação e repressão de infrações penais; ou
>
> IV - provenientes de fora do território nacional e que não sejam objeto de comunicação, uso compartilhado de dados com agentes de tratamento brasileiros ou objeto de transferência internacional de dados com outro país que não o de proveniência, desde que o país de proveniência proporcione grau de proteção de dados pessoais adequado ao previsto nesta Lei.
>
> § 1º O tratamento de dados pessoais previsto no inciso III será regido por legislação específica, que deverá prever medidas proporcionais e estritamente necessárias ao atendimento do interesse público, observados o devido processo legal, os princípios gerais de proteção e os direitos do titular previstos nesta Lei.
>
> § 2º É vedado o tratamento dos dados a que se refere o inciso III do caput deste artigo por pessoa de direito privado, exceto em procedimentos sob tutela de pessoa jurídica de direito público, que serão objeto de informe específico à autoridade nacional e que deverão observar a limitação imposta no § 4º deste artigo.
>
> § 3º A autoridade nacional emitirá opiniões técnicas ou recomendações referentes às exceções previstas no inciso III do caput deste artigo e deverá solicitar aos responsáveis relatórios de impacto à proteção de dados pessoais.
>
> § 4º Em nenhum caso a totalidade dos dados pessoais de banco de dados de que trata o inciso III do caput deste artigo poderá ser tratada por pessoa de direito privado, salvo por aquela que possua capital integralmente constituído pelo poder público. (Redação dada pela Lei nº 13.853, de 2019)

#### Função

Quanto à sua função, é importante lembrar que lei não é técnica. Não é seu objetivo descrever tecnologias, metodologias, protocolos ou práticas específicas que devem ser seguidas. Seu objetivo é definir responsabilidades, direitos deveres e recomendações de ambas as partes.

Por exemplo, o artigo 6° define os seguintes princípios:

> Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios:
> VI - transparência: garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre a realização do tratamento e os respectivos agentes de tratamento, observados os segredos comercial e industrial;
> VII - segurança: utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão;
> VIII - prevenção: adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais;
> X - responsabilização e prestação de contas: demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais e, inclusive, da eficácia dessas medidas.

Enquanto o artigo 46° define as responsabilidades que temos ao tratar os dados:

> Art. 46. Os agentes de tratamento devem adotar medidas de segurança, técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito.

E caso essa responsabilidade não seja exercida, devemos arcar com os prejuízos:

> Art. 42. O controlador ou o operador que, em razão do exercício de atividade de tratamento de dados pessoais, causar a outrem dano patrimonial, moral, individual ou coletivo, em violação à legislação de proteção de dados pessoais, é obrigado a repará-lo.
> Parágrafo único. Responde pelos danos decorrentes da violação da segurança dos dados o controlador ou o operador que, ao deixar de adotar as medidas de segurança previstas no art. 46 desta Lei, der causa ao dano.

Ou seja, a lei define que é nossa responsabilidade não apenas utilizar medidas de segurança para proteger as aplicações, mas também se antecipar à possíveis falhas nessas medidas. Agora, como isso será feito e quais serão essas tais medidas, é com você. Assim como um engenheiro civil deve certificar-se de que o imóvel que está construindo não irá cair na cabeça de ninguém, é função de um engenheiro de software auxiliar na implantação dessas medidas de segurança nos locais em que atuam. E caso as nossas medidas de segurança venham a desabar, o responsável por elas deve arcar com os prejuízos causados.

Nosso objetivo com este projeto é justamente indicar algumas dessas medidas de maneira pratica, indicando o caminho das pedras para a implantação da segurança e prevenção já citadas. São elas:

- Autorização (utilizando OAuth 2.0)
- Autenticação (utilizando HTTPS para trafego das credenciais de maneira segura)
- Criptografia dos dados do usuário armazenados no banco de dados (utilizando chaves assimétricas e simétricas)
- Compartilhamento seguro dos dados do usuário (utilizando chaves assimétricas e simétricas)

<div align="right">

#### Navegação

[Próximo (Introdução à autenticação e autorização: O que são e qual a diferença?)](./2introducao_autenticacao_autorizacao.md)

</div>
