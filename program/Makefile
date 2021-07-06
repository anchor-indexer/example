test:
	@anchor $@

deploy:
	@anchor build
	@anchor deploy

v:
	@solana-test-validator

indexer:
	@ts-node support/indexer/indexer.ts 

.PHONY: test \
	deploy \
	v \
	indexer
