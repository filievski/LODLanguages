import os,sys
import json
from statistics import mean

#langs=['en', 'de', 'fr', 'it', 'es', 'ru', 'nl', 'pl', 'pt', 'sv']#, 'ja', 'zh', 'vi', 'fi', 'fa', 'ca', 'uk', 'cs', 'tl', 'hu']
stuff={}
#stuff={"tika":{}, "ld": {}, "cld": {}}

def create_json_for_language(stuff, x):
	stuff[x]={}
	b=0
	while b<15:
		stuff[x][str(b)]={}
		for lib in ['tika', 'cld', 'ld', 'best']:
			stuff[x][str(b)][lib]={}
			stuff[x][str(b)][lib]["c"]=0
			stuff[x][str(b)][lib]["i"]=0
		b+=1
	return stuff

def compute_accuracy(tp, fp, total):
	if total==0:
		return -1
	if tp+fp==0:
		return -1
	recall=tp/total
	prec=tp/(tp+fp)
	if prec+recall==0:
		return -1
	f1=2*prec*recall/(prec+recall)
	print(prec, recall, f1)
	return f1

for lib in ["tika", "ld", "cld"]:
	docs=open("/scratch/fii800/LODObservatory/experiments/second_submission/all_tika_docs.txt")
	filenum=0
	print(lib)

	rootdir="/scratch/fii800/LODObservatory/" + lib
	os.chdir(rootdir)
	for f in docs:
		o=open(f.strip())
		j=json.load(o)
		tagged=j["tagged"]
		for lang in tagged:
			if lang not in stuff:
				create_json_for_language(stuff, lang)
			for bs in tagged[lang]:
				bs2=bs
				if int(bs2)>14:
					bs2="14"
				if 'c' in tagged[lang][bs]:
					stuff[lang][bs2][lib]["c"]+=tagged[lang][bs]['c']
					
				if 'i' in tagged[lang][bs]:
					stuff[lang][bs2][lib]["i"]+=tagged[lang][bs]['i']
		filenum+=1


for lang in stuff:
	for bucket in stuff[lang]:
		best_f1=0.0
		best_c=0
		best_i=0
		for lib in ["tika", "cld", "ld"]:
			acc=compute_accuracy(stuff[lang][bucket][lib]["c"],stuff[lang][bucket][lib]["i"], stuff[lang][bucket]["tika"]["c"]+stuff[lang][bucket]["tika"]["i"])
			if acc>best_f1:
				best_f1=acc
				best_c=stuff[lang][bucket][lib]["c"]
				best_i=stuff[lang][bucket][lib]["i"]
		stuff[lang][bucket]["best"]["c"]=best_c
		stuff[lang][bucket]["best"]["i"]=best_i


total_c=0
total_i=0
total_tagged=2262243184
for lang in stuff:
	for bucket in stuff[lang]:
		total_c+=stuff[lang][bucket]["best"]["c"]
		total_i+=stuff[lang][bucket]["best"]["i"]

print("COMBINED ACCURACY\n")
print(compute_accuracy(total_c, total_i, total_tagged))
