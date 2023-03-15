o?=o

test:
	@anchor $@

idl:
	@anchor --provider.cluster devnet idl init Bi99o1ryNWTZRxdyENFadCVxWPweK6TV8YrRzdL6Bbs5 --filepath target/idl/counter.json
#	@anchor --provider.cluster devnet idl upgrade Bi99o1ryNWTZRxdyENFadCVxWPweK6TV8YrRzdL6Bbs5 --filepath target/idl/counter.json

deploy:
	@anchor build
	@anchor deploy --provider.cluster devnet

integration:
	@env-cmd ./node_modules/.bin/ts-node $o

airdrop:
	@solana airdrop 1 $(solana address) --url=devnet

.PHONY: test idl deploy integration airdrop
