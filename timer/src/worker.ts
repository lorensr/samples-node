import { Worker } from '@temporalio/worker';
import { config } from 'dotenv';

config();

run().catch((err) => console.log(err));

async function run(): Promise<void> {
  // Step 1: Automatically locate and register Activities and Workflows relative to __dirname.
  const worker = await Worker.create({
    workDir: __dirname,
    taskQueue: 'tutorial20210928',
  });
  // // Worker connects to localhost by default and uses console.error for logging.
  // // Customize the Worker by passing more options to create():
  // // https://nodejs.temporal.io/api/classes/worker.Worker

  // // If you need to configure server connection parameters, see the mTLS example:
  // // https://github.com/temporalio/samples-node/tree/main/hello-world-mtls

  // Step 2: Start accepting tasks on the `tutorial` queue
  await worker.run();

  // You may create multiple Workers in a single process in order to poll on multiple task queues.
}
