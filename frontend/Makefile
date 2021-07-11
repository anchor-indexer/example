CWD=$(shell pwd)

run: node_modules src/idl
	@yarn start

node_modules:
	@yarn

src/idl:
	@ln -s $(CWD)/../program/target/idl src

lint:
	@yarn $@

.PHONY: \
	run \
	lint