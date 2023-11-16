# !/bin/bash

gcc -m64 -D_LINUX -o kmodule *.c -L. -lNSCrypto #  && ./run

# rm run
 