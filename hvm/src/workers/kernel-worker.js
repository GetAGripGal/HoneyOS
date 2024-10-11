self.onmessage = async event => {
    const [binary, memory] = event.data;

    await WebAssembly.instantiate(binary, {
        env: { memory }
    }).then(result => {
        const instance = result.instance;
        instance.exports._start();
        postMessage({ error: `Kernel aborted` });
    }).catch(reason => {
        postMessage({ error: `Failed to instantiate kernel: ${reason}` });
    })
};