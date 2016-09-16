import os
import json

total=2262243184

for lib in ["ld", "cld", "tika"]:
	docs=open("/scratch/fii800/LODObservatory/experiments/second_submission/all_tika_docs.txt")
	filenum=0
	c=0
	i=0
	print(lib)

	rootdir="/scratch/fii800/LODObservatory/" + lib
	os.chdir(rootdir)
	for f in docs:
		o=open(f.strip())
		j=json.load(o)
		tagged=j["tagged"]
		for lang in tagged:
			for bs in tagged[lang]:
				if 'c' in tagged[lang][bs]:
					c+=tagged[lang][bs]['c']
				if 'i' in tagged[lang][bs]:
					i+=tagged[lang][bs]['i']
		
		filenum+=1
	print(filenum)
	print(c,i)
	recall=c/total
	prec=c/(c+i)
	print("precision", prec)
	print("recall", recall)
	print("f1", 2*prec*recall/(prec+recall))
