const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

// let repositories = [];
const repositories = [];

function validateId (request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Id Inválido'});
  }

  return next();
}

app.use('/repositories/:id', validateId);

app.get("/repositories", (request, response) => {
  
  return response.status(200).json(repositories);

});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);
  
  if (!repository)
  {
    return response.status(400).json({ error: 'Id Not Found!' });
  }

  const { title, url, techs } = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  // repositories = [...repositories.filter(repository => repository.id !== id), repository];

  const index = repositories.findIndex(repository => repository.id === id);
  repositories[index] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const index = repositories.findIndex(repository => repository.id === id);
  
  if (index < 0)
  {
    return response.status(400).json({ error: 'Id Not Found!' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;
  
  const repository = repositories.find(repository => repository.id === id);
  
  if (!repository)
  {
    return response.status(400).json({ error: 'Id Not Found!' });
  }

  repository.likes += 1;

  // repositories = [...repositories.filter(repository => repository.id !== id), repository];

  const index = repositories.findIndex(repository => repository.id === id);
  repositories[index] = repository;  

  return response.status(200).json(repository);
});

module.exports = app;
