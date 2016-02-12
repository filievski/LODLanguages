#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
filename="md5s_with_ext.data"
while read -r downloadLink ext; do
	if [[ $downloadLink == [$searchFor]* ]] ; then
		#curl -q -m 520 -o /scratch/fii800/download.$searchFor $fullLink;
		#if [ $? -gt "0" ]; then
		#	echo $downloadLink >> "tryagain.data"
		#else
		fn="/scratch/lodlaundromat/crawls/12/$downloadLink/clean.$ext.gz"
		if [ -e $fn ]
		then
			zcat $fn | grep '"' | tee >(node cld_algorithm.js $downloadLink) >(node tika_algorithm.js $downloadLink) | node ld_algorithm.js $downloadLink
			echo $downloadLink >> "done.txt"
		else
			echo $downloadLink >> "notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "chunks.data"
