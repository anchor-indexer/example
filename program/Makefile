test:
	@anchor $@

deploy:
	@anchor build
	@anchor deploy

test-validator:
	@solana-test-validator

indexer:
	@ts-node support/indexer/indexer.ts 

.PHONY: test \
	deploy \
	test-validator \
	indexer
