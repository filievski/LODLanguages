#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="tika_remaining.data"
while read -r downloadLink ext; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		#curl -q -m 520 -o /scratch/fii800/download.$searchFor $fullLink;
		#if [ $? -gt "0" ]; then
		#	echo $downloadLink >> "tryagain.data"
		#else
		fn="/scratch/fii800/LL12/12/$downloadLink/clean.$ext.gz"
		if [ -e $fn ]
		then
			zcat $fn | grep '"' | node tika_algorithm.js --max_old_space_size=8092 $downloadLink
			echo $downloadLink >> "tika_done.txt"
#		else
#			echo $downloadLink >> "tika_notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "tika_chunks.data"
