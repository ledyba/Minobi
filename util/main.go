package main

import (
	"bufio"
	"encoding/json"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
)

type byName []os.FileInfo

// Image ...
type Image struct {
	Path   string `json:"path"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

// Page ...
type Page struct {
	Images []Image `json:"images"`
	Width  int     `json:"width"`
	Height int     `json:"height"`
}

func (fi byName) Len() int {
	return len(fi)
}
func (fi byName) Swap(i, j int) {
	fi[i], fi[j] = fi[j], fi[i]
}
func (fi byName) Less(i, j int) bool {
	return strings.Compare(fi[j].Name(), fi[i].Name()) > 0
}

func analyzeImage(baseDir, filePath string) Image {
	var err error
	log.Print(filePath)
	f, err := os.Open(filePath)
	if err != nil {
		log.Fatal(err)
	}
	r := bufio.NewReader(f)
	defer f.Close()
	im, _, err := image.Decode(r)
	if err != nil {
		log.Fatal(err)
	}
	width := im.Bounds().Size().X
	height := im.Bounds().Size().Y
	rel, err := filepath.Rel(baseDir, filePath)
	if err != nil {
		log.Fatal(err)
	}
	return Image{
		Path:   rel,
		Width:  width,
		Height: height,
	}
}

func main() {
	var err error
	log.Println("-- minobi / catalog maker --")
	baseDir := os.Args[1]
	dirName := os.Args[2]
	log.Printf("Reading: %s", dirName)
	fileInfos, err := ioutil.ReadDir(dirName)
	if err != nil {
		log.Fatal("FATAL: ", err)
	}
	log.Printf("%d files.", len(fileInfos))
	var files = make([]os.FileInfo, 0)
	for _, info := range fileInfos {
		if !info.IsDir() {
			files = append(files, info)
		}
	}
	sort.Sort(byName(files))
	var pages []Page
	for _, info := range files {
		img := analyzeImage(baseDir, path.Join(dirName, info.Name()))
		page := Page{
			Images: []Image{img},
			Width:  img.Width,
			Height: img.Height,
		}
		pages = append(pages, page)
	}
	bs, err := json.MarshalIndent(pages, "", "  ")
	if err != nil {
		log.Fatal(err)
	}
	os.Stdout.Write(bs)
}
