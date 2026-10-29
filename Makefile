# Care.tv — top-level developer entry points.
#
#   make install   install API + UI dependencies (and bootstrap the .env files)
#   make start     start MySQL, then run the API and web dev servers together
#   make start:api run just the API
#   make start:db  start Docker MySQL in the background and wait until ready
#   make start:web run just the web dev server
#
# The API is driven through Valet's PHP/Composer so it resolves the older PHP
# that api/composer.json expects; the UI is driven through nvm so it picks up
# the Node version pinned in ui/.nvmrc.

SHELL := /bin/bash
DOCKER_COMPOSE ?= docker compose

# Prefer Valet's shims (`valet php`, `valet composer`); fall back to whatever is
# on PATH when Valet isn't installed.
ifneq ($(shell command -v valet 2>/dev/null),)
PHP := valet php
COMPOSER := valet composer
else
PHP := php
COMPOSER := composer
endif

# nvm is a shell function, so it has to be sourced before `nvm use` can read
# .nvmrc. Falls through to the current node when nvm isn't installed.
define use_nvm
for candidate in "$${NVM_DIR:-$$HOME/.nvm}/nvm.sh" /opt/homebrew/opt/nvm/nvm.sh /usr/local/opt/nvm/nvm.sh; do \
	if [ -s "$$candidate" ]; then . "$$candidate"; break; fi; \
done; \
if command -v nvm >/dev/null 2>&1; then \
	nvm use || nvm install; \
else \
	echo "==> nvm not found; using $$(node --version 2>/dev/null || echo 'no node on PATH')"; \
fi
endef

.PHONY: help install install-api install-ui start start-api start-db start-ui

help:
	@echo "make install   — install API + web dependencies and create missing .env files"
	@echo "make start     — start MySQL, then run the API and web dev servers together"
	@echo "make start:api — run the API on http://localhost:8000"
	@echo "make start:db  — start Docker MySQL on 127.0.0.1:3307 (root/root, database: tv)"
	@echo "make start:web — run the web dev server on http://localhost:1234"
	@echo ""
	@echo "Also available: install-api, install-ui, start-api, start-ui"

install: install-api install-ui
	@echo ""
	@echo "==> Dependencies installed. Fill in api/.env and ui/.env, then set up the database:"
	@echo "    make start:db"
	@echo "    cd api && $(PHP) artisan migrate"
	@echo "    cd api && $(PHP) artisan db:seed && $(PHP) artisan db:seed --class=ShowSeeder"
	@echo "    cd api && $(PHP) artisan passport:install && $(PHP) artisan passport:client --password"

install-api:
	@echo "==> Installing API dependencies with '$(COMPOSER)'"
	@set -e; cd api; \
	[ -f .env ] || { cp .env.example .env; echo "==> Created api/.env from .env.example"; }; \
	$(COMPOSER) install; \
	if grep -q '^APP_KEY=$$' .env; then $(PHP) artisan key:generate; fi

install-ui:
	@echo "==> Installing UI dependencies"
	@set -e; cd ui; \
	$(use_nvm); \
	[ -f .env ] || { cp .env.example .env; echo "==> Created ui/.env from .env.example"; }; \
	npm install

# Start the database before either server. Give each server its own process
# group so cleanup also stops its children without signalling the caller.
# MySQL stays running; stop it separately with `docker compose stop db`.
start: start-db
	@set -m; \
	trap 'trap - EXIT INT TERM; kill -- -"$$api_pid" -"$$web_pid" 2>/dev/null || true; wait 2>/dev/null || true' EXIT; \
	trap 'exit 130' INT; \
	trap 'exit 143' TERM; \
	$(MAKE) start:api & api_pid=$$!; \
	$(MAKE) start:web & web_pid=$$!; \
	while kill -0 "$$api_pid" 2>/dev/null && kill -0 "$$web_pid" 2>/dev/null; do sleep 1; done; \
	if kill -0 "$$api_pid" 2>/dev/null; then wait "$$web_pid"; else wait "$$api_pid"; fi

start-db:
	@echo "==> Starting MySQL on 127.0.0.1:3307 (root/root, database: tv)"
	@$(DOCKER_COMPOSE) up -d --wait db

start-api:
	@set -e; cd api; \
	if [ ! -f .env ]; then echo "api/.env is missing — run 'make install' first."; exit 1; fi; \
	$(PHP) artisan serve

start-ui:
	@set -e; cd ui; \
	if [ ! -f .env ]; then echo "ui/.env is missing — run 'make install' first."; exit 1; fi; \
	$(use_nvm); \
	npm start

# Escape colons only in target names: Make 3.81 keeps the backslash literally
# in prerequisite names (including .PHONY). These aliases inherit phony recipes.
start\:api: start-api
start\:db: start-db
start\:web: start-ui
