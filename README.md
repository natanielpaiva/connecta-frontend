# Connecta Frontend

Interface principal dos aplicativos Connecta.

[![Build Status](https://travis-ci.org/connecta-solutions/connecta-frontend.svg?branch=master)](https://travis-ci.org/connecta-solutions/connecta-frontend)
[![Test Coverage](https://codeclimate.com/github/connecta-solutions/connecta-frontend/badges/coverage.svg)](https://codeclimate.com/github/connecta-solutions/connecta-frontend/coverage)
[![Code Climate](https://codeclimate.com/github/connecta-solutions/connecta-frontend/badges/gpa.svg)](https://codeclimate.com/github/connecta-solutions/connecta-frontend)
[![Issue Count](https://codeclimate.com/github/connecta-solutions/connecta-frontend/badges/issue_count.svg)](https://codeclimate.com/github/connecta-solutions/connecta-frontend)

## Instalação

### Instalação das dependências no Linux

No Github da Joyent tem o how-to da instalação do Node para cada distribuição de Linux (https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager), sendo a mais comum o Ubuntu com o `curl` instalado, baixe o shell da instalação e passe ele para o bash com o comando:

```
curl -sL https://deb.nodesource.com/setup | sudo bash -
```

O script acima adiciona o repositório do NodeJS no seu APT e executa um `apt-get update`. Agora é só instalar o nodejs direto do APT:

```
apt-get install nodejs
```

Após o comando acima, estarão instalados o NodeJS e o NPM.

Para instalar o Sass é necessário apenas rodar o comando:

```
gem install sass
```

Instalar o Git com o comando:

```
sudo apt-get install git
```

Instalar o Bower, o Grunt e o Karma:

```
npm install -g bower grunt-cli karma-cli
```


### Instalação das dependências no Windows

Baixar o instalador .msi do site https://nodejs.org/download/, e instalar normalmente.

Baixar o Ruby Installer no site oficial (http://rubyinstaller.org/downloads/)
pelo link: http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-1.9.3-p551.exe
utilizar a versão rubyinstaller-1.9.3

O Ruby installer já instala o Ruby Gems. A instalação do Sass no windows é o mesmo comando do Linux.

Baixar e instalar o  http://git-scm.com/.

Na rede interna, utilizar o comando abaixo para usar o protocolo HTTPS ao invés de git://, que não funciona aqui.

```
git config --global url."https://".insteadOf git://
```


### Instalação do Connecta

Rode os seguintes comandos na raiz do projeto para instalar:

```
npm install
bower install
```

## Build

Para rodar o build da aplicação execute o comando `grunt` ou `grunt default`.
O Grunt vai copiar a aplicação pra pasta /dist e remover todos os scripts de
desenvolvimento.

## Teste Unitário

Para rodar os testes unitários execute o comando `grunt test` na raiz do projeto,
o Grunt vai fazer o build da aplicação e depois rodas os testes unitários na
linha de comando com o PhantomJS.

## Execução

### Desenvolvimento

Para executar a aplicação execute o comando `grunt run` na raiz da aplicação, o
Grunt vai executar a build de desenvolvimento e iniciar um servidor HTTP para servir a pasta raiz
da sua aplicação na porta especificada.

Caso opte por usar o LiveReload, é só rodar o comando com `grunt run --reload`.

### Produção

Para executar a aplicação execute o comando `grunt run` na raiz da aplicação, o
Grunt vai executar a build de produção e iniciar um servidor HTTP para servir a pasta `dist`
da sua aplicação na porta especificada.
