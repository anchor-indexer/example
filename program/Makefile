test:
	@anchor $@

deploy:
	@anchor build
	@anchor deploy

validator:
	@solana-test-validator

indexer:
	@env-cmd ./node_modules/.bin/ts-node support/indexer/indexer.ts 

integration:
	@env-cmd ./node_modules/.bin/ts-node $o

keygen:
	@solana-keygen new --force --outfile=./keys/default.json
	@solana airdrop 1 --keypair ./keys/default.json --url=http://127.0.0.1:8899

.PHONY: test \
	deploy \
	validator \
	indexer \
	keygen
