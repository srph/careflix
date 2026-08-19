# Care.tv — top-level developer entry points.
#
#   make install   install API + UI dependencies (and bootstrap the .env files)
#   make start     run the API and the UI dev server side by side
#
# The API is driven through Valet's PHP/Composer so it resolves the older PHP
# that api/composer.json expects; the UI is driven through nvm so it picks up
# the Node version pinned in ui/.nvmrc.

SHELL := /bin/bash

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

.PHONY: help install install-api install-ui start start-api start-ui

help:
	@echo "make install   — install API + UI dependencies"
	@echo "make start     — run the API and UI dev servers together"
	@echo ""
	@echo "Also available: install-api, install-ui, start-api, start-ui"

install: install-api install-ui
	@echo ""
	@echo "==> Dependencies installed. Fill in api/.env and ui/.env, then set up the database:"
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

# Runs both dev servers in the foreground. Ctrl-C stops the pair, and if either
# server exits on its own it takes the other down with it (rather than leaving a
# half-running stack behind).
start:
	@trap 'kill 0' EXIT INT TERM; \
	{ $(MAKE) start-api; kill 0; } & \
	{ $(MAKE) start-ui; kill 0; } & \
	wait

start-api:
	@set -e; cd api; \
	if [ ! -f .env ]; then echo "api/.env is missing — run 'make install' first."; exit 1; fi; \
	$(PHP) artisan serve

start-ui:
	@set -e; cd ui; \
	if [ ! -f .env ]; then echo "ui/.env is missing — run 'make install' first."; exit 1; fi; \
	$(use_nvm); \
	npm start
