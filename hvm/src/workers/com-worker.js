self.onmessage = async event => {
    const [kernel_memory, registers] = event.data;

    // POSSIBLE SOLUTION: Implement a polling solution
    // while (true) {
    // executionLoop(kernel_memory, registers);
    // }
    // 
    executionLoop(kernel_memory, registers);
};

const executionLoop = (kernel_memory, registers) => {
    handleTextmodeDisplay(kernel_memory, registers);

    setTimeout(() => executionLoop(kernel_memory, registers));
}

/**
 * Handle the registers for the text mode display
 */
const handleTextmodeDisplay = (kernel_memory, registers) => {
    const push_addr = registers.textmode_transfer_push_register_address;
    const swap_addr = registers.textmode_transfer_swap_register_address;
    const clear_addr = registers.textmode_transfer_clear_register_address;
    const text_addr_begin = registers.textmode_transfer_buffer_address;
    const text_addr_end = registers.textmode_transfer_buffer_address + registers.textmode_transfer_buffer_size;

    const memory_buffer = new Uint8Array(kernel_memory.buffer);

    if (memory_buffer[clear_addr] > 0) {
        postMessage({
            system: "display",
            operation: "textmode-clear",
        });
        memory_buffer[clear_addr] = 0;
    }

    if (memory_buffer[push_addr] > 0) {
        const text_buffer = new Uint8Array(memory_buffer.subarray(text_addr_begin, text_addr_end));
        memory_buffer[push_addr] = 0;
        postMessage({
            system: "display",
            operation: "textmode-push-chars",
            data: text_buffer
        });
    }

    if (memory_buffer[swap_addr] > 0) {
        postMessage({
            system: "display",
            operation: "textmode-swap",
        });
        memory_buffer[swap_addr] = 0;
    }
}