#!/bin/bash

MOD=$1

if [ "$MOD" == "" ]; then
    echo "=== USAGE ==="
    echo ""
    echo "Invocar esse script de dentro da src/main/webapp, passando a nova pasta do modulo como parâmetro."
    echo ""
    echo "Exemplo: "
    echo "./new-module.sh app/portal/novo"
    echo ""
    echo "Resulta em:"
    echo "app/"
    echo "--portal/"
    echo "----novo/"
    echo "------animation/"
    echo "------controller/"
    echo "------directive/"
    echo "--------template/"
    echo "------filter/"
    echo "------template/"
    echo "------service/"
    echo "------translate/"

    exit
fi

echo "Criando estrutura de pastas no módulo $MOD..."

ANIMATION="$MOD/animation"
CONTROLLER="$MOD/controller"
DIRECTIVE="$MOD/directive/template"
FILTER="$MOD/filter"
TEMPLATE="$MOD/template"
SERVICE="$MOD/service"
TRANSLATE="$MOD/translate"

mkdir -p $ANIMATION $CONTROLLER $DIRECTIVE $FILTER $TEMPLATE $SERVICE $TRANSLATE

echo "Criando arquivos de internacionalização..."

read -d '' EN_JSON << EOF
{


    "HELLO": "Hello World!"


}
EOF
read -d '' PT_JSON << EOF
{


    "HELLO": "Olá, mundo!"


}
EOF

echo $EN_JSON > "$TRANSLATE/en-us.json"
echo $PT_JSON > "$TRANSLATE/pt-br.json"

echo "Pronto."