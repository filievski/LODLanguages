import sys
import json
import pickle

top20=pickle.load(open("top20.data", "rb"))

all_data={}
for lang in top20:
	all_data[lang]={}
print all_data

cnt=0
with open("md5s.data") as f:
	for line in f:
		filename=line.strip() + ".json"
		for lib in ["tika", "cld", "ld"]:
			with open(lib + "/" + filename) as libfile:
				for content in libfile:
					j=json.loads(content)
					tagged=j["tagged"]
					for klang in tagged: # Languages iteration
						if klang not in top20:
							continue
						for bucket in tagged[klang]:
							if "c" in tagged[klang][bucket]:
								c=tagged[klang][bucket]["c"] 
							else:
								c=0
                                                        if "i" in tagged[klang][bucket]:
								i=tagged[klang][bucket]["i"] 
							else:
								i=0
							if bucket in all_data[klang]:
								if lib in all_data[klang][bucket]:
									all_data[klang][bucket][lib]["c"]+=c
                                                                        all_data[klang][bucket][lib]["i"]+=i
								else:
                                                                        all_data[klang][bucket][lib]={"c": c, "i": i}
							else:
								all_data[klang][bucket]={lib:{"c": c, "i": i}}
							if lib=="tika":
								if "total" in all_data[klang]:
									all_data[klang]["total"]+=c+i
								else:
									all_data[klang]["total"]=c+i

		cnt+=1	
	pickle.dump(all_data, open("all_per_lang.data", "wb"))
