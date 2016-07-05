.PHONY: all get clean

all:
	mkdir -p .bin
	gofmt -w .
	go build -o .bin/make-catalog github.com/ledyba/minobi/make-catalog

get:
	nop

clean:
	go clean github.com/ledyba/minobi/...
