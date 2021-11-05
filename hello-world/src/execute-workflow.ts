// @@@SNIPSTART typescript-hello-client
import { Connection, WorkflowClient } from '@temporalio/client';
import { example } from './workflows';

async function run() {
  const connection = new Connection(); // Connect to localhost with default ConnectionOptions.
  // In production, pass options to the Connection constructor to configure TLS and other settings.
  // This is optional but we leave this here to remind you there is a gRPC connection being established.

  const client = new WorkflowClient(connection.service, {
    // In production you will likely specify `namespace` here; it is 'default' if omitted
    workflowDefaults: { taskQueue: 'tutorial' },
  });

  const ALREADY_EXISTS = 6;

  // Invoke the `example` Workflow, only resolved when the workflow completes
  const handle = await client.start(example, {
    args: ['Temporal'], // type inference works! args: [name: string]
    workflowId: '123',
  });
  try {
    await client.start(example, {
      args: ['Temporal'], // type inference works! args: [name: string]
      workflowId: '123',
    });
  } catch (e: any) {
    if (e.code === ALREADY_EXISTS) {
      console.log('Already started workflow 123');
    } else {
      // unexpected error
      throw e;
    }
  }
  console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
// @@@SNIPEND
