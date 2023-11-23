# !/bin/bash

gcc -m64 -D_LINUX -o kmodule *.c -L../modules -lNSKEM #  && ./run

# rm run
 