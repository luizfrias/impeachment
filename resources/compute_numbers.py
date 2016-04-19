# -*- coding: utf8 -*-
import codecs
import json


with codecs.open('dados_com_voto.json', 'r', encoding='utf8') as jsonfile:
    data = json.load(jsonfile)

criminosos = {
    'favor': 0,
    'contra': 0
}
inocentes = {
    'favor': 0,
    'contra': 0
}

for d in data:
    n_oc = int(d['n_ocorrencias'])
    voto = d['voto']
    if voto == -1:
        continue
    if voto == 1:
        voto_class = 'favor'
    else:
        voto_class = 'contra'

    if n_oc > 1:
        criminosos[voto_class] += 1
    else:
        inocentes[voto_class] += 1

print criminosos
print inocentes
