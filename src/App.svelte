<script lang="ts">
  import { ThrottlingStrategy, startSubscription } from "./startSubscription";
  import type { Subscription } from "rxjs";

  let subscription: Subscription;
  let numbers: number[] = [];
  let currentStrategy = ThrottlingStrategy.NONE;

  const next = (n: number) => {
    numbers = [...numbers, n];
  }

  const switchThrottlingStrategy = (strategy: ThrottlingStrategy) => () => {
    subscription.unsubscribe();
    numbers = [];
    currentStrategy = strategy;
    subscription = startSubscription(strategy, next);
  };

  subscription = startSubscription(ThrottlingStrategy.NONE, next);
</script>

<main>
	<h1>rxjs-lossless-throttle demo!</h1>
	<p>
		<a href="https://github.com/rogisolorzano/rxjs-lossless-throttle" target="_blank">Github</a>
		<span>&nbsp;-&nbsp;</span>
		<a href="https://www.npmjs.com/package/rxjs-lossless-throttle" target="_blank">npm</a>
	</p>
	<p>
		<button on:click={switchThrottlingStrategy(ThrottlingStrategy.LOSSLESS)}>Lossless throttling</button>
		<button on:click={switchThrottlingStrategy(ThrottlingStrategy.BUFFERED)}>Lossless throttling w/ max buffer</button>
		<button on:click={switchThrottlingStrategy(ThrottlingStrategy.LOSSY)}>Lossy throttling</button>
		<button on:click={switchThrottlingStrategy(ThrottlingStrategy.NONE)}>No throttling</button>
	</p>
	<p>
		{#if currentStrategy === ThrottlingStrategy.LOSSLESS}
			<p>Lossless throttling. Events are being emitted at 100ms, but they are throttled to emit every 1 second. No events are lost.</p>
		{:else if currentStrategy === ThrottlingStrategy.BUFFERED}
			<p>
				Lossless throttling w/ a max buffer size. You have the option to set a max buffer as a fail-safe to prevent
				unbound memory growth. When this threshold is hit, extra items are discarded. In this example, the max buffer is
				set to 3 and the producer is faster than the consumer to demonstrate items being lost.
			</p>
		{:else if currentStrategy === ThrottlingStrategy.LOSSY}
			<p>Lossy throttling. This is the built-in throttlingTime function in RxJS which is lossy. Events are emitted every second
				and any extra events are discarded.</p>
		{:else}
			<p>No throttling. Events are being emitted every 100ms.</p>
		{/if}
	</p>
	<p class="text-left">
		{#each numbers as number, i}
			<span>{number}</span>

			{#if i !== numbers.length - 1}
				<span> -> </span>
			{/if}
		{/each}
	</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
	.text-left {
		text-align: left;
	}
</style>
