#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
#filename="md5s.data"
while read -r downloadLink; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		#curl -q -m 520 -o /scratch/fii800/download.$searchFor $fullLink;
		#if [ $? -gt "0" ]; then
		#	echo $downloadLink >> "tryagain.data"
		#else
			zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.*.gz | grep '"' | tee >(nodejs cld_algorithm.js $downloadLink) >(nodejs tika_algorithm.js $downloadLink) | nodejs ld_algorithm.js $downloadLink
			echo $downloadLink >> "done.data"
		#fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
