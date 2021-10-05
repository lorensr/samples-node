import axios from 'axios';
export {fakeProgress} from './fake-progress.js';
export {cancellableFetch} from './cancellable-fetch.js';

export async function makeHTTPRequest(): Promise<string> {
  const res = await axios.get('http://httpbin.org/get?answer=42');

  return res.data.args.answer;
}

