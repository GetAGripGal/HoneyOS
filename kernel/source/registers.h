#ifndef REGISTERS_H
#define REGISTERS_H

#include <stdint.h>

/**
 * Textmode buffer
 */

#define TEXTMODE_BUFFER_LENGTH 1028

static volatile uint8_t TEXTMODE_TRANSFER_BUFFER[TEXTMODE_BUFFER_LENGTH];
static volatile uint8_t TEXTMODE_BUFFER_PUSH_REGISTER[1];
static volatile uint8_t TEXTMODE_BUFFER_SWAP_REGISTER[1];
static volatile uint8_t TEXTMODE_BUFFER_CLEAR_REGISTER[1];
static volatile uint8_t TEXTMODE_REFRESHED[1];

__attribute__((export_name("_textmode_transfer_buffer_addr"))) uint32_t _textmode_transfer_buffer_addr(void)
{
    return (uint32_t)TEXTMODE_TRANSFER_BUFFER;
}

__attribute__((export_name("_textmode_transfer_buffer_size"))) uint32_t _textmode_transfer_buffer_size(void)
{
    return (uint32_t)TEXTMODE_BUFFER_LENGTH;
}

__attribute__((export_name("_textmode_transfer_push_register_addr"))) uint32_t _textmode_transfer_push_register_addr(void)
{
    return (uint32_t)TEXTMODE_BUFFER_PUSH_REGISTER;
}

__attribute__((export_name("_textmode_transfer_swap_register_addr"))) uint32_t _textmode_transfer_swap_register_addr(void)
{
    return (uint32_t)TEXTMODE_BUFFER_SWAP_REGISTER;
}

__attribute__((export_name("_textmode_transfer_clear_register_addr"))) uint32_t _textmode_transfer_clear_register_addr(void)
{
    return (uint32_t)TEXTMODE_BUFFER_CLEAR_REGISTER;
}

#endif // REGISTERS_H