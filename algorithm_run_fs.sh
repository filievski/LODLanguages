#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5s.data"
while read -r downloadLink; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		fullLink="http://download.lodlaundromat.org/$downloadLink"
		#curl -q -m 520 -o /scratch/fii800/download.$searchFor $fullLink;
		#if [ $? -gt "0" ]; then
		#	echo $downloadLink >> "tryagain.data"
		#else
			zcat /scratch/lodlaundromat/crawls/12/$downloadLink/clean.*.gz | grep '"' | tee >(nodejs cld_algorithm.js $searchFor) >(nodejs tika_algorithm.js $searchFor) | nodejs ld_algorithm.js $searchFor
			echo $downloadLink >> "done.data"
		#fi
	fi
done < "$filename"

