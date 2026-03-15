# Aplicação de Geoprocessamento

Aplicação web interativa para **visualização e manipulação de dados geográficos** utilizando **GeoJSON** em um mapa dinâmico.

O sistema permite importar dados geográficos, visualizá-los em um mapa interativo e realizar operações de **CRUD (Create, Read, Update, Delete)** diretamente na interface.

Este projeto foi desenvolvido como solução para um **desafio técnico de geoprocessamento**, demonstrando habilidades no trabalho com **dados geoespaciais, mapas interativos e manipulação de GeoJSON**.

---

# Demonstração

A aplicação permite:

* Visualizar elementos geográficos no mapa
* Criar novos pontos, linhas e polígonos
* Editar geometrias existentes
* Remover elementos do mapa
* Importar arquivos GeoJSON
* Exportar dados geográficos
* Persistir dados localmente no navegador

---

# Tecnologias utilizadas

* **HTML5**
* **CSS3**
* **JavaScript**
* **Leaflet.js** — Biblioteca para mapas interativos
* **Leaflet Draw** — Plugin para criação e edição de elementos geográficos
* **OpenStreetMap** — Fonte de dados do mapa base
* **GeoJSON** — Formato padrão para dados geoespaciais

---

# Estrutura do projeto

```
geoprocessamento-app
│
├── dados/
│   └── exemplo.geojson
│
├── src/
│   ├── script.js
│   └── style.css
│
├── index.html
└── README.md
```

**Descrição das pastas**

| Caminho         | Descrição                               |
| --------------- | --------------------------------------- |
| `dados/`        | Arquivos GeoJSON utilizados para testes |
| `src/script.js` | Lógica principal da aplicação           |
| `src/style.css` | Estilos e layout da interface           |
| `index.html`    | Estrutura da aplicação                  |

---

# Funcionalidades

## Importação de dados

A aplicação permite importar arquivos nos formatos:

* `.json`
* `.geojson`

Os elementos contidos no arquivo são automaticamente exibidos no mapa.

---

## Mapa interativo

O mapa permite:

* Zoom
* Navegação (pan)
* Visualização clara de elementos geográficos

Os dados são renderizados utilizando **Leaflet.js**.

---

## Operações CRUD

A aplicação permite manipular elementos geográficos diretamente no mapa.

| Operação | Descrição                              |
| -------- | -------------------------------------- |
| Create   | Criar novos pontos, linhas e polígonos |
| Read     | Visualizar elementos e propriedades    |
| Update   | Editar geometria ou propriedades       |
| Delete   | Remover elementos                      |

Essas operações são implementadas utilizando **Leaflet Draw**.

---

## Visualização de propriedades

Ao clicar em um elemento do mapa, é exibido um **popup contendo suas propriedades**, como:

* Nome
* Descrição
* Tipo de geometria
* Coordenadas

---

## Persistência de dados

Os dados criados ou importados são armazenados utilizando **LocalStorage**, permitindo que as informações permaneçam no mapa mesmo após recarregar a página.

---

## Exportação de dados

Os elementos presentes no mapa podem ser exportados novamente no formato:

```
GeoJSON
```

Isso permite reutilizar os dados em outros sistemas GIS ou aplicações geoespaciais.

---

# Tarefa adicional do desafio

O mapa inclui dois pontos representando **unidades da empresa Sanesul em Campo Grande – MS**.

Cada ponto apresenta:

* Nome da unidade
* Endereço
* Coordenadas geográficas

As informações são exibidas em popups ao clicar nos marcadores.

---

# Como executar o projeto

1. Clone o repositório ou baixe os arquivos

```
git clone <url-do-repositorio>
```

2. Acesse a pasta do projeto

3. Abra o arquivo:

```
index.html
```

em qualquer navegador moderno.

Não é necessário servidor ou instalação de dependências.

---

# Como utilizar a aplicação

### Importar dados

1. Clique em **Importar GeoJSON**
2. Selecione um arquivo `.geojson`
3. Os elementos serão exibidos automaticamente no mapa

---

### Criar elementos

Utilize as ferramentas no mapa para:

* adicionar pontos
* desenhar linhas
* desenhar polígonos

---

### Editar elementos

Clique na ferramenta **Editar** e modifique os elementos existentes.

---

### Remover elementos

Selecione a ferramenta **Remover** e clique no elemento desejado.

---

### Exportar dados

Clique em **Exportar** para baixar os dados atuais do mapa no formato GeoJSON.

---

# Decisões técnicas

Algumas decisões importantes foram tomadas durante o desenvolvimento:

### Uso do Leaflet

Leaflet foi escolhido por ser:

* leve
* open source
* amplamente utilizado em aplicações de mapas
* compatível com GeoJSON

---

### Uso de GeoJSON

GeoJSON foi utilizado como formato padrão porque:

* é um padrão amplamente adotado em GIS
* é simples de manipular em JavaScript
* possui integração nativa com Leaflet

---

### Persistência local

Foi utilizada **LocalStorage** para simplificar o armazenamento de dados sem necessidade de backend.

---

# Melhorias futuras

Possíveis evoluções do projeto incluem:

* integração com banco de dados geoespacial (PostGIS)
* suporte a múltiplas camadas de dados
* upload de shapefiles
* autenticação de usuários
* API backend para armazenamento permanente

---

# Autor

Desenvolvido como parte de um desafio técnico de geoprocessamento.
