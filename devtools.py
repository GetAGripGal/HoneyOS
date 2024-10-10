#!/usr/bin/python

from dataclasses import dataclass
from enum import Enum
import socketserver
import subprocess
import sys
import os
import shutil
from http.server import SimpleHTTPRequestHandler

from kernel.build import CompileResult, compile_kernel

HELP_MESSAGE = """devtools.py {action} {options}
actions:
    - help: # Show this help screen
    - dist: [(all)|hvm|kernel|website] # Build and distribute a part of the project
    - serve: # Serve the website on a local http server (for debugging)"""

DIST_DIRECTORY = "dist"
SERVE_HOSTNAME = "127.0.0.1"
SERVE_PORT = 8080

"""
The action to take
"""
class Action(Enum):
    HELP = 0
    DIST = 1
    SERVE = 2

"""
The distribution target
"""
class DistTarget:
    ALL = 0
    HVM = 1
    KERNEL = 2
    WEBSITE = 3

"""
The arguments of the devtools
"""
@dataclass
class Args:
    error: None | str = None
    action: Action = Action.HELP
    dist_target: DistTarget = DistTarget.ALL


def read_args() -> Args:
    """ Read the arguments from the process args """
    args = Args()

    if len(sys.argv) < 2:
        args.error = "No action provided"
        return args
    
    # Read the action
    if sys.argv[1] == "help":
        args.action = Action.HELP
    elif sys.argv[1] == "dist":
        args.action = Action.DIST

        if len(sys.argv) > 2:
            if sys.argv[2] == "all":
                args.dist_target = DistTarget.ALL
            elif sys.argv[2] == "hvm":
                args.dist_target = DistTarget.HVM
            elif sys.argv[2] == "kernel":
                args.dist_target = DistTarget.KERNEL
            elif sys.argv[2] == "website":
                args.dist_target = DistTarget.WEBSITE
            else:
                args.error = "Invalid tartget: " + sys.argv[2]
    elif sys.argv[1] == "serve":
        args.action = Action.SERVE
        args.dist_target = DistTarget.ALL # In order to serve all aspects of the project must first be distributed
    else:
        args.error = "Invalid action: " + sys.argv[1]
    
    return args

"""
Util methods
"""

def check_for_nodejs() -> bool:
    """ Check if node js is installed on the host system """
    try:
        result = subprocess.run(["node", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        print("Node installation found: " + result.stdout.decode())
    except subprocess.CalledProcessError as error:
        print(f"Failed to determine installed node version: {error}")
        return False
    except FileNotFoundError:
        print("Node installation not found on host systen")
        return False
    return True

"""
Distribution methods
"""

def distribute_hvm():
    """ Distribute the honeyos virtual machine """

    HVM_OUTFILE = "hvm.min.js"

    if not check_for_nodejs():
        print("Failed to distribute hvm.js")
        return

    # Run the distribution script
    os.system("cd hvm && npm install")
    os.system("cd hvm && npm run dist")

    # Move output to dist directory
    shutil.copy("hvm/dist/" + HVM_OUTFILE, DIST_DIRECTORY + "/" + HVM_OUTFILE)

def distribute_kernel():
    """ Distribute the kernel """

    result = compile_kernel("dist")
    if result == CompileResult.SUCCESS:
        print("Successfully compiled kernel")
    if result == CompileResult.FAILURE:
        print("Compiling kernel failed")
    if result == CompileResult.ABORTED:
        print("Compiling kernel aborted")


def distribute_website():
    """ Distribute the website """

    shutil.copytree("website", DIST_DIRECTORY, dirs_exist_ok=True)
    shutil.copy("branding/icons/honeyos.ico", DIST_DIRECTORY + "/favicon.ico")

def distribute(args: Args):
    """ Distribute the various parts of the project """

    # Create the dist dir if it doesn't exists
    if not os.path.isdir("dist"):
        os.mkdir("dist")
        
    if args.dist_target == DistTarget.ALL or args.dist_target == DistTarget.HVM:
        distribute_hvm()
    if args.dist_target == DistTarget.ALL or args.dist_target == DistTarget.KERNEL:
        distribute_kernel()
    if args.dist_target == DistTarget.ALL or args.dist_target == DistTarget.WEBSITE:
        distribute_website()

"""
Serving 
"""

class ServeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        return super().end_headers()

class ServeTCPServer(socketserver.TCPServer):
    allow_reuse_address = True 
    allow_reuse_port = True

def serve():
    """ Serve the honeyos website """

    with ServeTCPServer(("", SERVE_PORT), ServeHandler) as httpd:
        print("Serving at", "http://" + SERVE_HOSTNAME + ":" + str(SERVE_PORT))
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()
            print("Server stopped and port released")

def main():
    args = read_args()
    
    if args.error is not None:
        print(args.error)
        print(HELP_MESSAGE)
        return
    
    if args.action == Action.HELP:
        print(HELP_MESSAGE)
    elif args.action == Action.DIST:
        distribute(args)
    elif args.action == Action.SERVE:
        distribute(args)
        serve()

if __name__ == "__main__":
    main()