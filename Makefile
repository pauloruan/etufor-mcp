.PHONY: help up down shell rebuild logs

APP_SERVICE_NAME=app

help:
	@echo "Comandos disponíveis:"
	@echo "  make up        -> Sobe os contêineres em background"
	@echo "  make down      -> Para e remove os contêineres"
	@echo "  make shell     -> Acessa o shell do contêiner da aplicação"
	@echo "  make rebuild   -> Força o build da imagem e sobe os contêineres"
	@echo "  make logs      -> Exibe os logs do serviço da aplicação"

up:
	docker compose up -d

down:
	docker compose down

shell:
	docker compose exec $(APP_SERVICE_NAME) bash

rebuild:
	docker compose up -d --build

logs:
	docker compose logs -f $(APP_SERVICE_NAME)