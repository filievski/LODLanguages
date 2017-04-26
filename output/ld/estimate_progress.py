import json
import csv, os

combined={}
tfound=0
ufound=0
for fn in os.listdir('.'):
	if fn.endswith('.json'): #and fn.startswith('cld_compatibility'):
		f=open(fn, 'r')
		for line in f:
			data = json.loads(line)
			if len(combined)==0:
				combined=data
			else:
				ddata=data["tagged"]
				if len(ddata):
					print ddata
					for ltag in ddata:
						print ddata[ltag]
						for size in ddata[ltag]:
							for c_or_i in ddata[ltag][size]:
								tfound+=ddata[ltag][size][c_or_i]

				udata=data["untagged"]
				if len(udata):
					print udata
					for size in udata:
						ufound+=udata[size]

print tfound
print ufound

