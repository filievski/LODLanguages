import os
import json

total=2262243184
x=0
stuff={"tika":{}, "ld": {}, "cld": {}}
while x<16:
	stuff["tika"][str(x)]={}
	stuff["cld"][str(x)]={}
	stuff["ld"][str(x)]={}
	stuff["tika"][str(x)]["c"]=0
	stuff["tika"][str(x)]["i"]=0
	stuff["cld"][str(x)]["c"]=0
	stuff["cld"][str(x)]["i"]=0
	stuff["ld"][str(x)]["c"]=0
	stuff["ld"][str(x)]["i"]=0
	x+=1
for lib in ["tika", "ld", "cld"]:
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
				bs2=bs
				if int(bs2)>15:
					bs2="15"
				if 'c' in tagged[lang][bs]:
					stuff[lib][bs2]["c"]+=tagged[lang][bs]['c']
					
				if 'i' in tagged[lang][bs]:
					stuff[lib][bs2]["i"]+=tagged[lang][bs]['i']
		filenum+=1
	print(filenum)
	print(c,i)
	b=0
	w=open("buckets.tsv", "w")
	while b<16:
		bs=str(b)
		if (stuff["tika"][bs]["c"]+stuff["tika"][bs]["i"]==0):
			recall="N/A"
		else:
			recall=stuff[lib][bs]["c"]/(stuff["tika"][bs]["c"]+stuff["tika"][bs]["i"])
		if (stuff[lib][bs]["c"]+stuff[lib][bs]["i"]==0):
			prec="N/A"
		else:
			prec=stuff[lib][bs]["c"]/(stuff[lib][bs]["c"]+stuff[lib][bs]["i"])
		if prec!="N/A" and recall!="N/A" and prec+recall>0:
			print(bs, prec, recall,  2*prec*recall/(prec+recall))
			w.write(str(2*prec*recall/(prec+recall)) + '\n')
		else:
			print(bs, prec, recall, "N/A")
			w.write("N/A\n")
		b+=1
