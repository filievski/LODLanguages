#!/bin/bash

#./setup_stuff.sh
./cld_algorithm_run_fs.sh ad &
./cld_algorithm_run_fs.sh bc &
./cld_algorithm_run_fs.sh ef &
./cld_algorithm_run_fs.sh 03 &
./cld_algorithm_run_fs.sh 12 &
./cld_algorithm_run_fs.sh 45 &
./cld_algorithm_run_fs.sh 67 &
./cld_algorithm_run_fs.sh 89 &

./ld_algorithm_run_fs.sh ad &
./ld_algorithm_run_fs.sh bc &
./ld_algorithm_run_fs.sh ef &
./ld_algorithm_run_fs.sh 03 &
./ld_algorithm_run_fs.sh 12 &
./ld_algorithm_run_fs.sh 45 &
./ld_algorithm_run_fs.sh 67 &
./ld_algorithm_run_fs.sh 89 &

./tika_algorithm_run_fs.sh ad &
./tika_algorithm_run_fs.sh bc &
./tika_algorithm_run_fs.sh ef &
./tika_algorithm_run_fs.sh 03 &
./tika_algorithm_run_fs.sh 12 &
./tika_algorithm_run_fs.sh 45 &
./tika_algorithm_run_fs.sh 67 &
./tika_algorithm_run_fs.sh 89 &
