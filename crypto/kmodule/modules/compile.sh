# !/bin/bash

gcc -m64 -D_LINUX -o kmodule ../src/*.c -L../../lib -lQuiltCrypto #  && ./run

# rm run
