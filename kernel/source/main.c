#include "version.h"
#include "stdint.h"

#define ASCII_COLOR_ICON "  \x1b[31mO\x1b[93mOO\x1b[31mO\n"                  \
                         " \x1b[91mO\x1b[31mO\x1b[93mOO\x1b[31mO\x1b[91mO\n" \
                         " \x1b[31mOO\x1b[93mOO\x1b[31mOO\n"                 \
                         "\x1b[37mO\x1b[33mOOOOOO\x1b[37mO\n"                \
                         "\x1b[97mO\x1b[93mOOOOOO\x1b[97mO\n"                \
                         " \x1b[33mOOOOOO\n"                                 \
                         " \x1b[97mO\x1b[30mOOOO\x1b[97mO\n"                 \
                         "  \x1b[97mO\x1b[30mOO\x1b[97mO\n"

#define TEXT_BUFFER_LENGTH sizeof(uint8_t) * 8

volatile uint8_t *TEXTBUFFER_PUSH_REG = (uint8_t *)0x0000009;
volatile uint8_t *TEXTBUFFER_ADDR = (uint8_t *)0x0000000A;

void display_push_str(const char *str)
{
    uint32_t i = 0;
    uint8_t buffer_index = 0;

    while (str[i] != '\0')
    {
        if (buffer_index == TEXT_BUFFER_LENGTH)
        {
            *TEXTBUFFER_PUSH_REG = 1;
            while (*TEXTBUFFER_PUSH_REG > 0)
                ;
            buffer_index = 0;
        }

        TEXTBUFFER_ADDR[buffer_index++] = str[i++];
    }

    // Fill remaining buffer space with zeroes if necessary
    while (buffer_index < TEXT_BUFFER_LENGTH)
    {
        TEXTBUFFER_ADDR[buffer_index++] = 0;
    }

    *TEXTBUFFER_PUSH_REG = 1;
    while (*TEXTBUFFER_PUSH_REG > 0)
        ;
}

/**
 * @brief The honey kernel entrypoint
 */
__attribute__((export_name("_start"))) void _start(void)
{
    display_push_str(ASCII_COLOR_ICON "\n");
    display_push_str("With love! <3 - GetAGripGal\n");

    for (;;)
    {
    }
}