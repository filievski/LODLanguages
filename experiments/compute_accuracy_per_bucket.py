import pickle

all_data=pickle.load(open("all_per_bucket.data", "rb"))

def compute_accuracy(tp, fp, total):

        precision=tp*1.0/(tp+fp)
        recall=tp*1.0/total
        f1=0.00
        if precision+recall>0.0:
                f1=2*precision*recall/(precision+recall)
        return str(float("{0:.2f}".format(f1*100.0)))

libs=["tika", "cld", "ld"]
bucket=0
tika_acc='tika\t'
ld_acc='ld\t'
cld_acc='cld\t'
while bucket<=15:
	bucket_data=all_data[str(bucket)]
	tika_correct=0
	tika_incorrect=0
	cld_correct=0
	cld_incorrect=0
	ld_correct=0
	ld_incorrect=0
	total=0
	for lang in bucket_data:
		cell=bucket_data[lang]
		for lib in libs:
			if lib in cell:
				lib_cell=cell[lib]
				c=0
				i=0
				if "c" in lib_cell:
					c=lib_cell["c"]
				if "i" in lib_cell:
					i=lib_cell["i"]
				if lib=="tika":
					tika_correct+=c
					tika_incorrect+=i
					total+=c+i
				elif lib=="cld":
					cld_correct+=c
					cld_incorrect+=i
				elif lib=="ld":
					ld_correct+=c
					ld_incorrect+=i

	tika_acc+=compute_accuracy(tika_correct, tika_incorrect, total) + '\t'
	ld_acc+=compute_accuracy(ld_correct, ld_incorrect, total) + '\t'
	cld_acc+=compute_accuracy(cld_correct, cld_incorrect, total) + '\t'

	bucket+=1

print tika_acc + '\n' + cld_acc + '\n' + ld_acc
