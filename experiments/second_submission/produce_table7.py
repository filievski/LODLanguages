import os,sys
import json
from statistics import mean

langs=['en', 'de', 'fr', 'it', 'es', 'ru', 'nl', 'pl', 'pt', 'sv']#, 'ja', 'zh', 'vi', 'fi', 'fa', 'ca', 'uk', 'cs', 'tl', 'hu']
b=0
stuff={}
#stuff={"tika":{}, "ld": {}, "cld": {}}

for x in langs:
	stuff[x]={}
	b=0
	while b<15:
		stuff[x][str(b)]={}
		for lib in ['tika', 'cld', 'ld']:
			stuff[x][str(b)][lib]={}
			stuff[x][str(b)][lib]["c"]=0
			stuff[x][str(b)][lib]["i"]=0
		b+=1

print(stuff)
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
			if lang not in langs:
				continue
			for bs in tagged[lang]:
				bs2=bs
				if int(bs2)>14:
					bs2="14"
				if 'c' in tagged[lang][bs]:
					stuff[lang][bs2][lib]["c"]+=tagged[lang][bs]['c']
					
				if 'i' in tagged[lang][bs]:
					stuff[lang][bs2][lib]["i"]+=tagged[lang][bs]['i']
		filenum+=1

w=open("/scratch/fii800/LODObservatory/experiments/second_submission/bigtable.tsv", "w")
for x in langs:
	b=0
	towrite=x + ' & '
	all_values=[]
	while b<15:
		bs=str(b)
		values=[]
		for lib in ["tika", "ld", "cld"]:
			

			if (stuff[x][bs]["tika"]["c"]+stuff[x][bs]["tika"]["i"]==0):
				recall="N/A"
			else:
				recall=stuff[x][bs][lib]["c"]/(stuff[x][bs]["tika"]["c"]+stuff[x][bs]["tika"]["i"])
			if (stuff[x][bs][lib]["c"]+stuff[x][bs][lib]["i"]==0):
				prec="N/A"
			else:
				prec=stuff[x][bs][lib]["c"]/(stuff[x][bs][lib]["c"]+stuff[x][bs][lib]["i"])
			if prec!="N/A" and recall!="N/A" and prec+recall>0:
				print(x, prec, recall,  2*prec*recall/(prec+recall))
				f1=2*prec*recall/(prec+recall)
				values.append(str(round(f1*100.0,2)))
			else:
				print(x, prec, recall, "N/A")
				values.append("N/A")
		all_values.append(' \\newline '.join(values))
		b+=1
	towrite+=' & '.join(all_values) + ' \\\\ \\hline\n'
	w.write(towrite)
