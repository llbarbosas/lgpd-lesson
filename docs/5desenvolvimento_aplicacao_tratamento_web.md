<div align="center">

<img alt="Cabeçalho UFMS" src="https://raw.githubusercontent.com/nes-facom/templates/main/.assets/cabecalho_docs.png" />

## lgpd-lesson: Desenvolvimento de uma aplicação web que realiza tratamento de dados pessoais sensíveis

</div>

A seguir, é descrito um método para a realização da criptografia dos dados do usuário e do compartilhamento seguro desses dados com entes autorizados.

#### Conceitos gerais

- _S_: [Chave simétrica](https://en.wikipedia.org/wiki/Symmetric-key_algorithm) (a mesma chave é utilizada para criptografar e descriptografar um dado)
- _P<sup>+</sup>_ e _P<sup>-</sup>_: Par de [chaves assimétricas](https://en.wikipedia.org/wiki/Public-key_cryptography) (chave pública e chave privada, respectivamente, sendo que a chave privada pode criptografar e descriptografar, enquanto a chave pública apenas criptografa)

## Processo

### Para armazenar a informação

- Gera-se uma _P<sup>+</sup>_ e uma _P<sup>-</sup>_ para cada usuário (_P<sup>+</sup>_<sub>u</sub> e _P<sup>-</sup>_<sub>u</sub>). A _P<sup>-</sup>_<sub>u</sub> é encriptada utilizando a senha do usuário e então é salva, e só deve ser decriptada temporariamente.

> ```js
> const { publicKey, privateKey } = generateAsymmetricKeys();
>
> const password = "123456";
>
> await db.user.insert({
>   username: "jose.silva",
>   password: bcrypt(password),
>   private_key: encryptSymmetric(privateKey, password),
>   public_key: publicKey,
> });
> ```

- Cada conjunto de dados (_d_) do usuário, cria-se uma chave simétrica aleatória _S_. O resultado _S_(_d_) é salvo.

> ```js
> const symmetricKey = generateRandomSymmetricKey();
>
> const encryptedMaritalStatus = encryptSymmetric("single", symmetricKey);
> const encryptedSkinColor = encryptSymmetric("black", symmetricKey);
> ```

- Encripta-se _S_ utilizando _P<sup>+</sup>_<sub>u</sub>. O resultado _P<sup>+</sup>_<sub>u</sub>(_S_) é salvo.

> ```js
> const encryptedSymmetricKey = encryptAsymmetric(symmetricKey, publicKey)
>
> await db.student_profile.insert({
>     marital_status: encryptedMaritalStatus,
>     skin_color: encryptedSkinColor,
>     username: "jose.silva"
>     symmetric_key: encryptedSymmetricKey,
> });
> ```

### Para acessar suas informações

- Recupera-se _S_ registrada junto das informações cadastradas

> ```js
> const studentProfile = await db.student_profile.find({
>   username: "jose.silva",
> });
>
> const { symmetric_key: encryptedSymmetricKey } = studentProfile;
> ```

- Decripta-se _P<sup>-</sup>_<sub>u</sub> utilizando a senha do usuário

> ```js
> const user = db.users.find({ username: "jose.silva" });
>
> const password = "123456"; // Senha fornecida pelo usuário
>
> const privateKey = decryptSymmetric(user["private_key"], password);
> ```

- Utilizando _P<sup>-</sup>_<sub>u</sub>, obtemos a chave _S_: _P<sup>-</sup>_<sub>u</sub>(_P<sup>+</sup>_<sub>u</sub>(_S_)) = _S_

> ```js
> const studentProfileSymmetricKey = decryptAsymmetric(
>   studentProfile["symmetric_key"],
>   privateKey
> );
> ```

- Utilizando _S_, decriptamos o conjunto de dados = _S_(_S_(_d_)) = _d_

> ```js
> const { encryptedMaritalStatus } = studentProfile;
>
> const maritalStatus = decryptSymmetric(encryptedMaritalStatus, symmetricKey);
> ```

### Para compartilhar informações com outro usuário (_x_)

- Decripta-se _P<sup>-</sup>_<sub>u</sub> utilizando a senha do usuário

> ```js
> const user = db.users.find({ username: "jose.silva" });
>
> const password = "123456"; // Senha fornecida pelo usuário
>
> const privateKey = decryptSymmetric(user["private_key"], password);
> ```

- Utilizando _P<sup>-</sup>_<sub>u</sub>, obtemos a chave _S_: _P<sup>-</sup>_<sub>u</sub>(_P<sup>+</sup>_<sub>u</sub>(_S_)) = _S_

> ```js
> const studentProfile = await db.student_profile.find({
>   username: "jose.silva",
> });
>
> const studentProfileSymmetricKey = decryptAsymmetric(
>   studentProfile["symmetric_key"],
>   privateKey
> );
> ```

- Encripta-se _S_ utilizando _P<sup>+</sup>_<sub>x</sub>. O resultado _P<sup>+</sup>_<sub>x</sub>(_S_) é salvo

> ```js
> const { username, publicKey } = userX;
>
> await db.student_profile_share.insert({
>   student_profile_id: studentProfileId,
>   username,
>   symmetric_key: encryptAsymmetric(studentProfileSymmetricKey, publicKey),
> });
> ```

### Para acessar a informação compartilhada com _x_

- Decripta-se _P<sup>-</sup>_<sub>x</sub> utilizando a senha do usuário

> ```js
> const privateKey = decryptSymmetric(userX["private_key"], plainPassword);
> ```

- Procura-se _P<sup>+</sup>_<sub>x</sub>(_S_). Se não existir, significa que o dado não foi compartilhado com _x_

> ```js
> const { username } = userX;
>
> const { symmetric_key: encryptedSymmetricKey } =
>   await db.student_profile_share.find({
>     student_profile_id: studentProfileId,
>     username: username,
>   });
> ```

- Utilizando _P<sup>-</sup>_<sub>x</sub>, obtemos a chave _S_: _P<sup>-</sup>_<sub>x</sub>(_P<sup>+</sup>_<sub>x</sub>(_S_)) = _S_

> ```js
> const symmetricKey = decryptAsymmetric(encryptedSymmetricKey, privateKey);
> ```

- Utilizando _S_, decriptamos o conjunto de dados = _S_(_S_(_d_)) = _d_

> ```js
> const { encryptedMaritalStatus } = studentProfile;
>
> const maritalStatus = decryptSymmetric(encryptedMaritalStatus, symmetricKey);
> ```
