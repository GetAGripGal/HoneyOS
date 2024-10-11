"""
The build script for the kernel.
"""

if __name__ == "__main__":
    message = """Build script cannot be executed directly.
To build the kernel, use `devtools.py`:
devtools.py dist kernel"""
    print(message)

from enum import Enum
import subprocess
import os

OUTPUT_BINARY = "honey.wasm"
SOURCE_FILES = [
    "source/main.c",
]

# Clang compiler directives
COMPILER_OPTIONS = ["--target=wasm32", "-nostdlib", "-Wl,--no-entry", "-Wl,--import-memory", "-Wl,--shared-memory", "-pthread"]

class CompileResult(Enum):
    """ The result of the compiler """
    SUCCESS = 0
    FAILURE = -1
    ABORTED = -2

def check_for_clang() -> bool:
    """ Check if clang is installed on the host system """
    try:
        result = subprocess.run(["clang", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        print("Clang installation found: \n" + result.stdout.decode())
    except subprocess.CalledProcessError as error:
        print(f"Failed to determine installed clang version: {error}")
        return False
    except FileNotFoundError:
        print("Clang installation not found on host systen")
        return False
    return True
    

def compile_kernel(outpath: str) -> CompileResult:
    """ Compile the kernel to a wasm module """
    if not check_for_clang():
        return CompileResult.ABORTED
    
    # Get the full path of the source files
    kernel_path = os.path.dirname(os.path.realpath(__file__))
    source_paths = [kernel_path + "/" + path for path in SOURCE_FILES]
    command = ["clang", *COMPILER_OPTIONS, "-o", outpath + "/" + OUTPUT_BINARY, *source_paths]

    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError:
        return CompileResult.FAILURE
    else:
        print("Kernel compiled successfully: " + outpath + "/" + OUTPUT_BINARY)
        return CompileResult.SUCCESS

