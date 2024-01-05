# !/bin/bash

gcc -m64 -D_LINUX -o ../modules/kmodule *.c -L../modules -lNSKem #  && ./run

# rm run
 
