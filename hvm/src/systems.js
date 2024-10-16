/** @typedef {"textmode-display"} SystemType */

/**
 * @typedef {Object} SystemMessage 
 * @property {SystemType} system The VM system the message is for
 * @property {string} operation The operation of the message
 * @property {Object} data The data send from the message
 */

/**
 * Recieves a message from the systems manager and processes it.
 */
export class System {
    /**
     * Process a systems message
     * @param {SystemMessage} message The message to process
     */
    processMessage(message) { }
}

/**
 * Processes the messages send by the com-worker and facilitates interaction between the kernel and the vm.
 * @class
 * @property {Object.<SystemType, System>} systems The registered systems
 */
export class SystemManager {
    constructor() {
        this.systems = {};
    }

    /**
     * Send the message to the correct system
     * @param {SystemMessage} message The message to process
     */
    interpretMessage(message) {
        if (message.system in this.systems) {
            this.systems[message.system].processMessage(message);
        }
    }

    /**
     * Register a system to the systems manager
     * @param {System} system The system to register
     * @param {SystemType} type The type to register it to
     */
    registerSystem(system, type) {
        if (type in this.systems) {
            throw `System of type ${type} already registered`;
        }
        this.systems[type] = system;
    }
}