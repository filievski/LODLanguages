import pickle
import operator


all_data=pickle.load(open("all.data", "rb"))

langs={}

for bucket in all_data:
	for lang in all_data[bucket]:
		total=all_data[bucket][lang]["total"]
		if lang in langs:
			langs[lang]+=total
		else:
			langs[lang]=total

# Totals counted. Now order and cut after the first N (N=25)

sorted_x = sorted(langs.items(), key=operator.itemgetter(1) , reverse=True)

cnt=0
top20=[]
for k in sorted_x:
	cnt+=1
	if cnt>20:
		break
	top20.append(k[0])

pickle.dump(top20, open("top20.data", "wb"))
