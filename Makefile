.PHONY: dev build start lint install docker-build docker-run k8s-deploy k8s-secret clean

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

install:
	npm install

docker-build:
	docker build -t dominion-leaderboard .

docker-run:
	docker run -p 3000:3000 \
		-e MASTER_PASSWORD=deliwala2024 \
		-e DATABASE_URL=file:/data/dominion.db \
		-v $(PWD)/data:/data \
		dominion-leaderboard

k8s-secret:
	@read -p "Master password: " pw; \
	kubectl create secret generic dominion-secrets --from-literal=MASTER_PASSWORD=$$pw

k8s-deploy:
	kubectl apply -f k8s/pvc.yaml
	kubectl apply -f k8s/deployment.yaml

clean:
	rm -rf .next node_modules dominion.db dominion.db-shm dominion.db-wal
