.PHONY: build test inst

build:
	`npm bin`/webpack

test:
	python3 -m http.server 8000

inst:
	npm install --save-dev webpack babel-loader babel-preset-es2015