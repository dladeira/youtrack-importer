# Makefile for YouTrack Importer

IMAGE_NAME = youtrack-importer
CONTAINER_NAME = youtrack-importer

build:
	docker build -t $(IMAGE_NAME) .

start:
	docker run -d --name $(CONTAINER_NAME) --env-file .env $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)
