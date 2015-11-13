#! /bin/bash
searchFor="$1"
if [ -z $1 ]; then
	searchFor="."
fi
while read -r downloadLink; do
  #      echo $downloadLink
	docid=${downloadLink##*/}
        curl -q -o - $downloadLink | zcat | grep '"' | tee >(nodejs cld_untagged.js) >(nodejs all_untagged.js) | nodejs ld_untagged.js
	#curl -q -o - $downloadLink | zcat > /dev/null        
#	echo "done"
done < <( ./Frank/frank documents --downloadUri | grep -E "http://download\.lodlaundromat\.org/[$searchFor]" )
