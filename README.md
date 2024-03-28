## Maior OverEngineering em um formulário simples xD

Antes de mais nada, respondendo algumas perguntas previamente:

1. Precisava de tudo isso?
R: Claramente não.

2. Pq fez isso?
R: Não tinha muita certeza sobre qual era o critério de avaliação, se seria a criatividade, usar conceitos do KISS (Keep It Simple and Stupid), fazer um meio termo ou mostrar o quão longe um candidato consegue ir com um problemas simples. Assim fiz minha aposta, chutei na ultima opção (mais divertida xD).

3. Você não vai abordar isso em um cenário real né?
R: Não, costumo fazer em cima da necessidade/futuro em cima dos padrões do time, prazo, recursos, pessoas alocadas, alinhamentos e etc.

That's it, agora vamos ao que interessa.

## System Design

Dado que a idéia é fazer algo muito complexo, precisamos de uma métrica para tal (pq só fazer por fazer é paia).

Então vamos supor o seguinte cenário:

- 50 milhões de pessoas cadastrando por dia;
- Pico de 5 milhões de pessoas cadastrando em 2 minutos;
- Ataques DDOS;
- A empresa tem de médio a grandes recursos;
- Não precisamos de uma resposta instântanea se o usuário foi criado ou não (apenas mensagens de erro, caso o usuário já exista e talz);

Com isso, escalabilidade e consistência são as palavras chaves dado o grande volume;

Assim vem as abordagens técnicas (dado a necessidade):

- Arquitetura de micro-serviços (indisponibilidade de um serviço por conta da carga ou problema interno, não derrubar o monolito e isolar a camada que irá ser responsável em subir N usuários) (improvisado dado a estrutura do projeto);
- Shardings no BD (alto indíce de writes, sobrecarga na mesma tabela, pois ao fazer um write a tabela fica locada até finalizar e dado o pico de milhões de pessoas cadastrando em um curto período de tempo, escalar de forma horizontal essas tabelas seja uma boa solução) (não tive tempo de fazer);
- Teremos que fazer algumas validações, ex: se email já existe, então no dia vai realizar 50 milhões de consultas no banco de dados verificando se aquele usuário já existe, talvez replicar o banco apenas para consultas e indexar essas colunas?
- Sistema de filas, caso o service responsável por subir esses dados caia ou não consiga salvar corretamente, assim subindo em uma fila de retry e no ultimo caso, em uma DLQ (Dead Letter Queue) para uma futura análise manual do pq esses carinhas não subiram (não teve tempo para fila de retry e DLQs).

dava para utilizar APM's, como New Relic, DataDog, Graphana, Prometheus Kibana, etc. Para fazer a gestão, análise e previsão de futuros erros com os logs, ou até mesmo criar um container pra simular um loadbalancer mas só tenho 2 dias então vou deixar para a próxima xD.

Algumas suposições:

- Suponha que cada container do docker seja um servidor dedicado com uma infraestrutura top capaz de suportar essa demanda;
- Dado a estrutura do projeto, suponha que o consumer seja um serverless da vida que se responsabiliza em subir para o BD (service responsável pela criação do usuário, se cair, só vai cair essa instância);


Resultado final:

## Arquitetura do projeto

não tive tempo para realizar os testes, mas usar o jest com algumas configurações não seria problema...