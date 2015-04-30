# Connecta Portal

Interface principal dos aplicativos Connecta.

## Instalação

Versão mínima do Node: __v0.10.36__

Versão mínima do NPM: __2.1.17__

### Instalação do NodeJS no Linux

No Github da Joyent tem o how-to da instalação do Node para cada distribuição de Linux (https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager), sendo a mais comum o Ubuntu com o `curl` instalado, 

### Instalação do NodeJS no Windows

Baixar o instalador .msi do site https://nodejs.org/download/, e instalar normalmente.

### Instalação do Connecta

Rode os seguintes comandos na raiz do projeto para instalar:

* `npm install`
* `bower install`

## Build

Para rodar o build da aplicação execute o comando `grunt` ou `grunt default`.
O Grunt vai copiar a aplicação pra pasta /dist e remover todos os scripts de
desenvolvimento.

## Teste Unitário

Para rodar os testes unitários execute o comando `grunt test` na raiz do projeto,
o Grunt vai fazer o build da aplicação e depois rodas os testes unitários na
linha de comando com o PhantomJS.

## Execução

Para executar a aplicação execute o comando `grunt run` na raiz da aplicação, o
Grunt vai executar a build e iniciar um servidor HTTP para servir a pasta `dist`
da sua aplicação na porta especificada.
