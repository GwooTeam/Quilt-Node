# !/bin/bash
sudo cp ../modulelib/libQuiltCrypto.so /lib/libqSafer.so

gcc -m64 -D_LINUX -o dmodule *.c -L../modulelib -lQuiltCrypto
