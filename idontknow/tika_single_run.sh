#! /bin/bash
	start=`date +%s`
        docid="b7f7f37bc2573a2e70901b63940fa7ab"
        downloadLink="http://download.lodlaundromat.org/$docid"
        echo $downloadLink
        curl -q -o - $downloadLink | zcat | grep '"' | nodejs tika_algorithm.js "test"
        end=`date +%s`
        runtime=$((end-start))
        echo $runtime
#	echo "done"
