.PHONY: all get test clean

all:
	mkdir -p .bin
	gofmt -w .
	go build -o .bin/make-catalog github.com/ledyba/minobi/make-catalog

get:
	nop

test:
	python -m SimpleHTTPServer

clean:
	go clean github.com/ledyba/minobi/...
