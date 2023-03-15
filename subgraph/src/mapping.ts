import { BigInt, log } from '@anchor-indexer/ts';
import {
  InitializeCounterEvent,
  IncrementCounterEvent,
  DecrementCounterEvent,
  ResetCounterEvent,
  InitializeCall,
  IncrementCall,
  DecrementCall,
  ResetCall,
} from '../generated/Counter/Counter';
import { Counter, Call } from '../generated/schema';

export {
  InitializeCounterEvent,
  IncrementCounterEvent,
  DecrementCounterEvent,
  ResetCounterEvent,
  InitializeCall,
  IncrementCall,
  DecrementCall,
  ResetCall,
} from '../generated/Counter/Counter';
export { Counter, Call } from '../generated/schema';

export function handleInitializeCounterEvent(
  event: InitializeCounterEvent
): void {
  let id = event.params.authority;
  log.debug('initializing counter for {}', [id.toBase58()]);
  let counter = Counter.load(id.toBase58());
  if (!counter) {
    counter = new Counter(id.toBase58());
    counter.count = BigInt.fromU32(0);
    counter.authority = id;
    counter.save();
  }
}

export function handleIncrementCounterEvent(
  event: IncrementCounterEvent
): void {
  let id = event.params.authority;
  log.debug('incrementing counter for {}', [id.toBase58()]);
  let counter = Counter.load(id.toBase58());
  if (counter) {
    counter.count = counter.count.plus(BigInt.fromU32(1));
    counter.save();
  } else {
    log.error('counter({}) does not exist', [id.toBase58()]);
  }
}

export function handleDecrementCounterEvent(
  event: DecrementCounterEvent
): void {
  let id = event.params.authority;
  log.debug('decrementing counter for {}', [id.toBase58()]);
  let counter = Counter.load(id.toBase58());
  if (counter) {
    if (!counter.count.isZero()) {
      counter.count = counter.count.minus(BigInt.fromU32(1));
    }
    counter.save();
  } else {
    log.error('counter({}) does not exist', [id.toBase58()]);
  }
}

export function handleResetCounterEvent(event: ResetCounterEvent): void {
  let id = event.params.authority;
  log.debug('resetting counter for {}', [id.toBase58()]);
  let counter = Counter.load(id.toBase58());
  if (counter) {
    counter.count = BigInt.fromU32(0);
    counter.save();
  } else {
    log.error('counter({}) does not exist', [id.toBase58()]);
  }
}

export function handleInitializeCall(call: InitializeCall): void {
  let id = call.accounts.authority;
  log.debug('initialize call for {}', [id.toBase58()]);
  let calls = Call.load(id.toBase58());
  if (!calls) {
    calls = new Call(id.toBase58());
    calls.count = BigInt.fromU32(0);
    calls.authority = id;
    calls.save();
  }
}

export function handleIncrementCall(call: IncrementCall): void {
  let id = call.accounts.authority;
  log.debug('increment call for {}', [id.toBase58()]);
  let calls = Call.load(id.toBase58());
  if (calls) {
    calls.count = calls.count.plus(BigInt.fromU32(1));
    calls.save();
  } else {
    log.error('calls({}) does not exist', [id.toBase58()]);
  }
}

export function handleDecrementCall(call: DecrementCall): void {
  let id = call.accounts.authority;
  log.debug('decrement call for {}', [id.toBase58()]);
  let calls = Call.load(id.toBase58());
  if (calls) {
    calls.count = calls.count.plus(BigInt.fromU32(1));
    calls.save();
  } else {
    log.error('calls({}) does not exist', [id.toBase58()]);
  }
}

export function handleResetCall(call: ResetCall): void {
  let id = call.accounts.authority;
  log.debug('reset call for {}', [id.toBase58()]);
  let calls = Call.load(id.toBase58());
  if (calls) {
    calls.count = calls.count.plus(BigInt.fromU32(1));
    calls.save();
  } else {
    log.error('calls({}) does not exist', [id.toBase58()]);
  }
}
