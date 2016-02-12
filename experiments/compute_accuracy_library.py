import pickle

all_data=pickle.load(open("all_per_bucket.data", "rb"))

def compute_accuracy(tp, fp, total):

        precision=tp*1.0/(tp+fp)
        recall=tp*1.0/total
        f1=0.00
        if precision+recall>0.0:
                f1=2*precision*recall/(precision+recall)
	return precision, recall, f1
#        return str(float("{0:.2f}".format(f1*100.0)))

libs=["tika", "cld", "ld"]
bucket=0
tika_correct=0
tika_incorrect=0
cld_correct=0
cld_incorrect=0
ld_correct=0
ld_incorrect=0
total=0
combi_correct=0
combi_incorrect=0
choice={"cld": 0, "ld": 0, "tika": 0}
while bucket<=15:
	bucket_data=all_data[str(bucket)]

	for lang in bucket_data:
		cell=bucket_data[lang]
		best_c=-1
		best_i=-1
		best_f1=-1.0
		best_lib=""
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
					local_total=c+i
					total+=local_total

				elif lib=="cld":
					cld_correct+=c
					cld_incorrect+=i
				elif lib=="ld":
					ld_correct+=c
					ld_incorrect+=i
			
				score=compute_accuracy(c, i, local_total)
				if score[2]>best_f1:
					best_c=c
					best_i=i
					best_f1=score[2]
					best_lib=lib
		if best_c>=0 and best_i>=0 and best_f1>=0:
			combi_correct+=best_c
			combi_incorrect+=best_i
			choice[best_lib]+=1
	bucket+=1
tika_acc=compute_accuracy(tika_correct, tika_incorrect, total)
ld_acc=compute_accuracy(ld_correct, ld_incorrect, total)
cld_acc=compute_accuracy(cld_correct, cld_incorrect, total)
combi_acc=compute_accuracy(combi_correct, combi_incorrect, total)
print "Precision\tRecall\tF1\n"
print "Tika: ", tika_acc 
print "CLD: ", cld_acc
print "LD: ", ld_acc
print "Combined: ", combi_acc
print choice
