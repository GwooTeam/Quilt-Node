# !/bin/bash

gcc -m64 -D_LINUX -o mmodule ../src/*.c -L../../lib -lQuiltCrypto #  && ./run

# rm run
 
