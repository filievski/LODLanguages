import operator
import sys
import glob
import json
from collections import defaultdict

library=sys.argv[1]
data_location="../../output/%s/*.json" % library

counting=defaultdict(int)

for f in glob.glob(data_location):
	with open(f, 'r') as myfile:
		for line in myfile:
			j=json.loads(line)
			if len(j['untagged']):
				for k in j['untagged']:
					counting[k]+=j['untagged'][k]
sorted_counts = sorted(counting.items(), key=operator.itemgetter(1), reverse=True)

print(sorted_counts[:10])
