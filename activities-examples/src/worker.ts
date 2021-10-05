import { Worker } from '@temporalio/worker';
import path from 'path';
import * as activities from './activities/index.js';

run().catch((err) => console.log(err));

async function run() {
  const dirname = path.dirname(new URL(import.meta.url).pathname)
  
  const worker = await Worker.create({
    workflowsPath: path.join(dirname, 'workflows'),
    nodeModulesPath: path.join(dirname, '../node_modules'),
    activities,
    taskQueue: 'tutorial',
  });

  await worker.run();
}
