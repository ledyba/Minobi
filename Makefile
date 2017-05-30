.PHONY: build test inst

build:
	browserify src/app.js -t babelify --outfile js/app.js

test:
	python3 -m http.server 8000

inst:
	npm install --save-dev babel-cli
	npm install --save-dev browserify