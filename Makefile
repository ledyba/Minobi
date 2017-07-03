.PHONY: build test inst

all: build

test:
	open http://localhost:8080/
	`npm bin`/webpack-dev-server --progress --colors

build: js/app.js

js/app.js: src/app.js src/minobi.js src/seekbar.js src/util.js
	`npm bin`/webpack

inst:
	npm install --save-dev webpack babel-loader babel-preset-es2015
	npm install --save-dev webpack-dev-server
