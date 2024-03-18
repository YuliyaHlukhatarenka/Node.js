import { EventEmitter } from './task31.js';

class WithTime extends EventEmitter {
    async execute(asyncFunc, ...args) {
        super.emit('begin')
        console.time('timer');

        const data = await asyncFunc(args);
        console.log(data);
        super.emit('data');
        super.emit('end');

       console.timeEnd('timer');
   }
}

const fetchFromUrl = async (url, cb) => {
   const response = await fetch(url);
   const data = await response.json();

   return data;
}


const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));

withTime.execute(fetchFromUrl, 'https://jsonplaceholder.typicode.com/posts/1');

console.log(withTime.rawListeners('end'));