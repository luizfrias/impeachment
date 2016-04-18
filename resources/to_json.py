# -*- coding: utf8 -*-
import codecs
import json


with codecs.open('dados.json', 'r', encoding='utf8') as jsonfile:
	data = json.load(jsonfile)

for d in data:
	d['voto'] = 1

with codecs.open('dados_com_voto.json', 'w', encoding='utf8') as jsonfile:
	json.dump(data, jsonfile, indent=4, sort_keys=True, ensure_ascii=False)
