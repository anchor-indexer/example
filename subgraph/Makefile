deploy:
	@$(MAKE) idl
	@anchor-indexer deploy counter

create:
	@anchor-indexer create counter devnet

remove:
	@anchor-indexer remove counter

codegen:
	@$(MAKE) idl
	@anchor-indexer codegen

build:
	@$(MAKE) idl
	@$(MAKE) codegen
	@anchor-indexer build

idl:
	@mkdir -p idls
	@cp -f $(PWD)/../program/target/idl/counter.json idls/counter.json | echo

.PHONY: deploy create remove codegen build idl