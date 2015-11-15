import json
import csv, os

combined={}
found=0
for fn in os.listdir('.'):
	if fn.endswith('.json') and fn.startswith('cld_compatibility'):
		f=open(fn, 'r')
		for line in f:
			data = json.loads(line)
			if len(combined)==0:
				combined=data
			else:
				for ltag in data:
					for size in data[ltag]:
						for c_or_i in data[ltag][size]:
							found+=data[ltag][size][c_or_i]

print found

