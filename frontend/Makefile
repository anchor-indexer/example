CWD=$(shell pwd)

run: node_modules src/app/idls
	@yarn dev

node_modules:
	@yarn

src/app/idls:
	@mkdir -p $@
	@cp -f $(CWD)/../program/target/idl/counter.json $@

lint:
	@yarn $@

.PHONY: \
	run \
	lint \
	src/app/idls