import json
import csv

combined={}
addon = ['0123', '4567', '89ab', 'cdef']

for add in addon:
	f=open('compatibility_' + add + '.json', 'r')
	for line in f:
		data = json.loads(line)
		if len(combined)==0:
			combined=data
		else:
			for ltag in data:
				if ltag in combined:
					for size in data[ltag]:
						if size in combined[ltag]:
							for c_or_i in data[ltag][size]:
								if c_or_i in combined[ltag][size]:
									combined[ltag][size][c_or_i]+=data[ltag][size][c_or_i]
								else:
									combined[ltag][size][c_or_i]=data[ltag][size][c_or_i]
						else:
							combined[ltag][size]=data[ltag][size]
				else:
					combined[ltag]=data[ltag]


with open("compatibility_langtags.csv", "w") as csvfile:
	fieldnames = ["Langtag", "Lognrwords", "COMPATIBLE", "INCOMPATIBLE"]
	writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
	writer.writeheader()
	
	for ltag in combined:
		for size in combined[ltag]:
			c=0
			i=0
			if "c" in combined[ltag][size]:
				c=combined[ltag][size]["c"]
                        if "i" in combined[ltag][size]:
                                i=combined[ltag][size]["i"]
			writer.writerow({'Langtag': ltag, 'Lognrwords': size, 'COMPATIBLE': c, 'INCOMPATIBLE': i})
