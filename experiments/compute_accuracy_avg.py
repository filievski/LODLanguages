import sys
import pickle
import json

all_data=pickle.load(open("all_per_lang.data", "rb"))
top20=pickle.load(open("top20.data", "rb"))

libs=["tika", "cld", "ld"]

def compute_accuracy(cell, total):
	tp=0
	fp=0
	if "c" in cell:
		tp=cell["c"]
	if "i" in cell:
		fp=cell["i"]

	precision=tp*1.0/(tp+fp)
	recall=tp*1.0/total
	f1=0.00
	if precision+recall>0.0:
		f1=2*precision*recall/(precision+recall)
	return float("{0:.2f}".format(f1*100.0))

for lang in top20:
	lang_data=all_data[lang]
	cnt=0
	lang_csv=lang + "\t"
	while cnt<15:
		if str(cnt) in lang_data:
			cell=lang_data[str(cnt)]
			total_cell=0
			if "tika" in cell:
				if "c" in cell["tika"]:
					total_cell+=cell["tika"]["c"]
				if "i" in cell["tika"]:
					total_cell+=cell["tika"]["i"]
			sum_n=0.0
			n=0
			for lib in libs:
				if lib in cell:
					n+=1
					lib_acc=compute_accuracy(cell[lib], total_cell)
					print lang, cnt, lib_acc
					sum_n+=lib_acc
			if n>0:
				lang_csv+=str(sum_n/n) + '\t'
		else:
			lang_csv+='n/a\t'
		cnt+=1
	print lang_csv.rstrip()
