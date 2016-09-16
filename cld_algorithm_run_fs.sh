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
		fn="/scratch/fii800/LL12/12/$downloadLink/clean.$ext.gz"
		if [ -e $fn ]
		then
			zcat $fn | grep '"' | node cld_algorithm.js $downloadLink
			echo $downloadLink >> "cld_done.txt"
		else
			echo $downloadLink >> "cld_notexist.txt"
		fi
	fi
done < "$filename"
echo "Done: $searchFor" >> "cld_chunks.data"
