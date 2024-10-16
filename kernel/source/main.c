#include "version.h"
#include "registers.h"
#include <stdint.h>

#define ASCII_COLOR_ICON "  \x1b[31mO\x1b[93mOO\x1b[31mO\n"                  \
                         " \x1b[91mO\x1b[31mO\x1b[93mOO\x1b[31mO\x1b[91mO\n" \
                         " \x1b[31mOO\x1b[93mOO\x1b[31mOO\n"                 \
                         "\x1b[37mO\x1b[33mOOOOOO\x1b[37mO\n"                \
                         "\x1b[97mO\x1b[93mOOOOOO\x1b[97mO\n"                \
                         " \x1b[33mOOOOOO\n"                                 \
                         " \x1b[97mO\x1b[30mOOOO\x1b[97mO\n"                 \
                         "  \x1b[97mO\x1b[30mOO\x1b[97mO\n"

char *itoa(int value, char *result, int base)
{
    // check that the base if valid
    if (base < 2 || base > 36)
    {
        *result = '\0';
        return result;
    }

    char *ptr = result, *ptr1 = result, tmp_char;
    int tmp_value;

    do
    {
        tmp_value = value;
        value /= base;
        *ptr++ = "zyxwvutsrqponmlkjihgfedcba9876543210123456789abcdefghijklmnopqrstuvwxyz"[35 + (tmp_value - value * base)];
    } while (value);

    // Apply negative sign
    if (tmp_value < 0)
        *ptr++ = '-';
    *ptr-- = '\0';

    // Reverse the string
    while (ptr1 < ptr)
    {
        tmp_char = *ptr;
        *ptr-- = *ptr1;
        *ptr1++ = tmp_char;
    }
    return result;
}

void display_push_str(const char *str)
{
    uint32_t i = 0;
    uint32_t buffer_index = 0;

    while (str[i] != '\0')
    {
        if (buffer_index == TEXTMODE_BUFFER_LENGTH)
        {
            break;
        }

        TEXTMODE_TRANSFER_BUFFER[buffer_index++] = str[i++];
    }

    // Fill remaining buffer space with zeroes if necessary
    while (buffer_index < TEXTMODE_BUFFER_LENGTH)
    {
        TEXTMODE_TRANSFER_BUFFER[buffer_index++] = 0;
    }

    *TEXTMODE_BUFFER_PUSH_REGISTER = 1;
}

void display_swap(void)
{
    // Swap the buffers
    *TEXTMODE_BUFFER_SWAP_REGISTER = 1;
}

void display_clear(void)
{
    *TEXTMODE_BUFFER_CLEAR_REGISTER = 1;
}

void display_poll_push(void)
{
    while (*TEXTMODE_BUFFER_PUSH_REGISTER > 0)
        ;
}

void display_poll_swap(void)
{
    while (*TEXTMODE_BUFFER_SWAP_REGISTER > 0)
        ;
}

void display_poll_clear(void)
{
    while (*TEXTMODE_BUFFER_CLEAR_REGISTER > 0)
        ;
}

/**
 * @brief The honey kernel entrypoint
 */
__attribute__((export_name("_start"))) void _start(void)
{
    uint32_t cycle = 0;

    for (;;)
    {
        display_clear();
        display_poll_clear();

        char cycle_string[10];
        itoa(cycle, cycle_string, 10);

        display_push_str(ASCII_COLOR_ICON "\n"
                                          "With love! <3 - GetAGripGal\n"
                                          "Cycle: ");
        display_poll_push();
        display_push_str(cycle_string);
        display_poll_push();

        display_swap();
        display_poll_swap();

        cycle++;
    }
}