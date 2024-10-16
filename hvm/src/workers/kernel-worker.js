self.onmessage = async event => {
    const [binary, memory] = event.data;

    await WebAssembly.instantiate(binary, {
        env: { memory }
    }).then(result => {
        const instance = result.instance;
        // Push register configuration
        postMessage({
            type: "init",
            registers: {
                textmode_transfer_buffer_address: instance.exports._textmode_transfer_buffer_addr(),
                textmode_transfer_buffer_size: instance.exports._textmode_transfer_buffer_size(),
                textmode_transfer_push_register_address: instance.exports._textmode_transfer_push_register_addr(),
                textmode_transfer_swap_register_address: instance.exports._textmode_transfer_swap_register_addr(),
                textmode_transfer_clear_register_address: instance.exports._textmode_transfer_clear_register_addr(),
            },
            memory
        });
        instance.exports._start();
        postMessage({ type: "error", error: `Kernel aborted` });
    }).catch(reason => {
        postMessage({ type: "error", error: `Failed to instantiate kernel: ${reason}` });
    })
};