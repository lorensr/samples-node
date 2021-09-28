import fs from 'fs';
import { Worker, Core } from '@temporalio/worker';
import path from 'path';
import { getEnv, Env } from './mtls-env';
import * as activities from './activities';

/**
 * Run a Worker with an mTLS connection, configuration is provided via environment variables.
 * Note that serverNameOverride and serverRootCACertificate are optional.
 */
async function run({
  address,
  namespace,
  clientCertPath,
  clientKeyPath,
  serverNameOverride,
  serverRootCACertificatePath,
  taskQueue,
}: Env) {
  let serverRootCACertificate: Buffer | undefined = undefined;
  if (serverRootCACertificatePath) {
    serverRootCACertificate = fs.readFileSync(serverRootCACertificatePath);
  }

  await Core.install({
    serverOptions: {
      address,
      namespace,
      tls: {
        serverNameOverride,
        serverRootCACertificate,
        // See docs for other TLS options
        clientCertPair: {
          crt: fs.readFileSync(clientCertPath),
          key: fs.readFileSync(clientKeyPath),
        },
      },
    },
  });

  const worker = await Worker.create({
    workflowsPath: path.join(__dirname, 'workflows'),
    nodeModulesPath: path.join(__dirname, '../node_modules'),
    activities,
    taskQueue,
  });
  console.log('Worker connection succesfully established');
  // Start accepting tasks on the `tutorial` queue
  await worker.run();
}

run(getEnv()).catch((err) => {
  console.error(err);
  process.exit(1);
});
