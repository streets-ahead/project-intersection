
i:
	rm -rf node_modules
	npm install
	
install: i
	
gen: clean
	node gen.js
	./node_modules/.bin/webpack --config ./webpack.config.min.js

serve:
	NODE_ENV=development node index.js

clean:
	-rm -rf dist

.PHONY: i install clean gen serve
