.PHONY: build inst

build:
	browserify ./src/app.js -t babelify --outfile ./dist/app.js

inst:
	npm install --save-dev babel-cli
	npm install --save-dev browserify