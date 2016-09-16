import sys
import json
import pickle

all_data={"0": {}, "1":{}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}, "8": {}, "9": {}, "10": {}, "11": {}, "12" : {}, "13": {}, "14": {}, "15": {}}
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
						for bucket in tagged[klang]:
							if "c" in tagged[klang][bucket]:
								c=tagged[klang][bucket]["c"] 
							else:
								c=0
                                                        if "i" in tagged[klang][bucket]:
								i=tagged[klang][bucket]["i"] 
							else:
								i=0
							if klang in all_data[bucket]:
								if lib in all_data[bucket][klang]:
									all_data[bucket][klang][lib]["c"]+=c
                                                                        all_data[bucket][klang][lib]["i"]+=i
								else:
                                                                        all_data[bucket][klang][lib]={"c": c, "i": i}
							else:
								all_data[bucket][klang]={lib:{"c": c, "i": i}}
							if lib=="tika":
								if "total" in all_data[bucket][klang]:
									all_data[bucket][klang]["total"]+=c+i
								else:
									all_data[bucket][klang]["total"]=c+i

		cnt+=1	
	pickle.dump(all_data, open("all.data", "wb"))
