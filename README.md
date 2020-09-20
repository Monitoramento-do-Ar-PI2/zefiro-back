# Gaia-Esporte

![Hex.pm](https://img.shields.io/hexpm/l/plug)
[![Generic badge](https://img.shields.io/badge/StyleGuide-Eslint-<COLOR>.svg)](https://shields.io/)
[![Version](https://img.shields.io/badge/Version-v0.0-blue.svg)]()

---

## Como contribuir

Se tiver interesse em como contribuir para o projeto, olhe mais sobre o projeto em nossa [wiki](https://github.com/Monitoramento-do-Ar-PI2/wiki) e dê uma lida também no nosso guia de [contribuição](https://github.com/Monitoramento-do-Ar-PI2/wiki/blob/master/CONTRIBUTING.md).

## Como usar

### Como rodar

O nosso projeto utiliza o Docker e o Docker Compose como ferramentas de desenvolvimento. Para instalar eles, siga o tutorial no site oficial do [Docker](https://www.docker.com/).

Após instalar o docker rode o projeto como desenvolvimento da seguinte maneira, ele será disponibilizado em `localhost:3000`:

```$ sudo docker-compose up --build```

Para rodar a folha de estilo, utilize este comando:

``` $ sudo docker-compose run zefiro-back npm run lint ```