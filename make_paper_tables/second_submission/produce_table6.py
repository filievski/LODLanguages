import os
import json

docs=open("docs.txt", "r")
os.chdir("../../output/tika/")
u_sum=0
t_sum=0
filenum=0
languages={}
for f in docs:
	o=open(f.strip())
	j=json.load(o)
	tagged=j["tagged"]
	untagged=j["untagged"]
	for lang in tagged:
		if lang not in languages:
			languages[lang]=0
		for bs in tagged[lang]:
			for c_i in tagged[lang][bs]:
				languages[lang]+=tagged[lang][bs][c_i]
				t_sum+=tagged[lang][bs][c_i]
	for bs in untagged:
		u_sum+=untagged[bs]
	
	filenum+=1
	print(filenum)
print(filenum, t_sum, u_sum, t_sum+u_sum)
print(sorted(languages.items(), key=lambda x: x[1], reverse=True))
