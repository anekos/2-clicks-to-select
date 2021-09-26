
.PHONY: dev
dev:
	yarn dev

.PHONY:
build:
	npm run build

.PHONY: icon
icon:
	mkdir -p public/icon
	convert -resize 48x48 ./icon/kuri.svg ./icon/kuri.48x48.png
	convert -resize 64x64 ./icon/kuri.svg ./icon/kuri.64x64.png
	convert -resize 72x72 ./icon/kuri.svg ./icon/kuri.72x72.png
	convert -resize 96x96 ./icon/kuri.svg ./icon/kuri.96x96.png
	convert -resize 128x128 ./icon/kuri.svg ./icon/kuri.128x128.png
	convert -resize 144x144 ./icon/kuri.svg ./icon/kuri.144x144.png
	convert -resize 152x152 ./icon/kuri.svg ./icon/kuri.152x152.png
	convert -resize 192x192 ./icon/kuri.svg ./icon/kuri.192x192.png
	convert -resize 384x384 ./icon/kuri.svg ./icon/kuri.384x384.png
	convert -resize 512x512 ./icon/kuri.svg ./icon/kuri.512x512.png

.PHONY: release
release:
	./script/release
