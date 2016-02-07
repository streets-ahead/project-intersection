
i: clean
	npm install
	
gen: clean
	node gen.js
	./node_modules/.bin/webpack --config ./webpack.config.min.js

serve:
	node index.js

clean:
	-rm -rf dist

.PHONY: i clean gen serve
