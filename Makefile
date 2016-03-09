
i:
	rm -rf node_modules
	npm install
	
install: i
	
gen: clean
	NODE_ENV=build node gen.js
	NODE_ENV=production ./node_modules/.bin/webpack --config ./webpack.config.min.js
	cp -R images dist/
	cp node_modules/normalize.css/normalize.css dist/static/
	
serve:
	NODE_ENV=development node index.js
	
create: 
	node create.js

clean:
	-rm -rf dist

.PHONY: i install clean gen serve create
