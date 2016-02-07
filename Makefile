
i: clean
	npm install
	
gen: clean
	node gen.js

serve:
	node index.js

clean:
	-rm -rf dist

.PHONY: i clean gen serve
