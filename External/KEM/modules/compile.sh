# !/bin/bash

gcc -m64 -D_LINUX -o kmodule ../src/*.c -L. -lNSKem #  && ./run

# rm run
 
