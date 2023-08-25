async function work(id: number, worker: number): Promise<void> {
	const timeout = Math.ceil(Math.random() * 10_000)
	return new Promise(
		resolve => (
			console.log("start", worker, id, timeout),
			setTimeout(() => resolve(console.log("finished", worker, id, timeout)), timeout)
		)
	)
}
async function execute(
	total: number,
	workers: number,
	task: (id: number, worker: number) => Promise<void>,
	ramp = 0
): Promise<void> {
	let id = 0
	const result: Promise<void>[] = []
	const rampDelay = ramp / workers
	for (let worker = 0; worker < workers; worker++) {
		result.push(
			(console.log("starting worker", worker),
			(async (): Promise<void> => {
				console.log("worker started", worker)
				while (id < total)
					await task(id++, worker)
			})())
		)
		if (ramp > 0)
			await new Promise(resolve => setTimeout(resolve, rampDelay))
	}
	console.log("all workers started")
	await Promise.all(result)
	console.log("done")
}

execute(100, 10, work, 0)
