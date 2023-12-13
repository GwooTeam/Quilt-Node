# !/bin/bash
sudo cp ../../modulelib/libQuiltCrypto.so /lib/libqSafer.so

gcc -m64 -D_LINUX -o mmodule ../src/*.c -L../../modulelib -lQuiltCrypto #  && ./run

# rm run
 
