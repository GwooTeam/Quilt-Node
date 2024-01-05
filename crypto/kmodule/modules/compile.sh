# !/bin/bash
sudo cp ../../modulelib/libQuiltCrypto.so /lib/libqSafer.so

gcc -m64 -D_LINUX -o kmodule ../src/*.c -L../../modulelib -lQuiltCrypto #  && ./run

# rm run
