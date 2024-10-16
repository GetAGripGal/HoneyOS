#ifndef VERSION_H
#define VERSION_H

// Macro stringification
#define xstr(a) str(a)
#define str(a) #a

#define HS_KERNEL_MAJOR_VERSION 0
#define HS_KERNEL_MINOR_VERSION 1
#define HS_KERNEL_VERSION_STRING "honeyos-kernel" xstr(HS_KERNEL_MAJOR_VERSION) "." xstr(HS_KERNEL_MINOR_VERSION)

#endif // VERSION_H